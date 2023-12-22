import { ExcelDataMgr } from "Data/ExcelDataMgr";
import { EventMgr } from "eventMgr";
import { testCreat } from "Loader/otherPlan/testCreat";
import { UiManager } from "PSDUI/UiManager";
import { multiToucher } from "Scripts/multiToucher";
import { commTool } from "Tools/commTool";
import { consTool } from "Tools/consTool";
import { GameInfoUtil } from "Tools/GameInfoUtil";
import { htmlCode } from "Tools/htmlCode";
import { miniAPIType, miniGame } from "Tools/miniGame";
import { PlatformType, PlatformUtil, SystemQualityType } from "Tools/PlatformUtil";
import { metaUIManager } from "UIBase/metaUIManager";
import { AudioEnum } from "./Audio/AudioEnum";
import { AudioPlayer } from "./Audio/AudioPlayer";
import { StageMgr } from "./Core/StageMgr";
import { ConfigMgr } from "./Data/configMgr";
import { GameMgr } from "./GameMgr";
import { UiNames } from "./Manager/UIData/UiNames";
import { UIOpenOrHideManager } from "./Manager/UIOpenOrHideManager";
import { NetWebscoket } from "./Net/NetWebsocket";
import { ResMgr } from "./Res/ResMgr";

/** core enter point */
export class AppMain {
    constructor() {

        // window["eruda"].init();
        //显示loading  UI 界面
        // UIOpenOrHideManager.Instance.OpenLoadingView();
        UIOpenOrHideManager.Instance.OpenTloadingView();
        UiManager.InitUi(UiNames.tips);

        // pbtest.AsyncTest01();
        // console.error("end");
        // NetworkRegisterManager.init();
        ExcelDataMgr.init(`lib/node_modules/@types/`);

        //
        // NetWebscoket.Instance.connect("ws://127.0.0.1", 3300);
        // Ress.init(app).then(() => {  //gdPromise 有问题 故此处理
        //     configMgr.PreInit();
        // });
        consTool.init();

        //init
        console.log(`appMain inited`);

        // 引擎启动
        this.initEngine();
        let app = m4m.framework.sceneMgr.app;
        //项目启动
        let width: number = 1280;
        let height: number = 720;

        //屏幕适配处理
        //因会被广告位档到  iphone  5  5s   iphone 8  ui整体微调缩小
        let isLowPix = app.canvasClientHeight <= 414;
        let pixChange = 1;
        pixChange = (app.canvasClientHeight * 530) / (height * (app.canvasClientHeight - 135));
        let screenMatchRate = 1;  //如果是以高度固定的 模屏 模式  要把这个值设置为1   默认为竖屏模式

        //处理窄屏UI适配问题
        let asp = app.width / app.height;
        let min = 0.6;
        let max = 1.68;
        asp = asp < min ? min : asp;
        if (asp < max) {
            screenMatchRate = (asp - min) / (max - min);
        }

        //相机ui
        // UiManager.init(1280,720,1,"","");
        // uiMgr.init(width, height,screenMatchRate,appMain.UIPath,appMain.atlasPath);
        UiManager.init(width, height, screenMatchRate, GameMgr.UIPath, GameMgr.atlasPath);
        m4m.framework.batcher2D["limitCount"] = 1024 * 64;  //设置 UI vbo buffer 大小上限 ， 不同项目需要平衡（太大太小都不好）。
        //测试下来 1024 * 64 或 1024 * 128 最优
        //小游戏平台
        miniGame.init(UiManager);
        this.setMini();
        // //初始化服务器连接
        // if (miniGame.miniType != miniAPIType.none) {
        //     LoginTool.miniLogin(this.initAccountNetByMini.bind(this));
        //     // this.initAccountNet();
        // } else {
        //     this.initAccountNet();
        // }

        // GameMgr.openWalletBol = true;
        // let id = m4m["accountID"];
        // if (id != null) {
        //     id = decodeURI(id);
        //     if (id == "跳过钱包") {
        //         GameMgr.openWalletBol = false;
        //     }
        // }
        //gameMgr
        GameMgr.init(app);
        //testCreat
        testCreat.init(GameMgr.CDNURL, PlatformUtil.systemQuality, PlatformUtil.WXGetSystemPlatformType, GameMgr.pathReplaceMap);
        //animclip 使用test asset模式
        commTool.enableAnimclipAssetVerTest("TESTAsset/");  //设定匹配 字符串为 TESTAsset/
        //htmltool
        htmlCode.runCode();
        //multiToucher
        multiToucher.init(metaUIManager.ActiveSelf.overlay, m4m.framework.sceneMgr.app);

        //event reg
        EventMgr.addListener("res_dependent_loaded", this.onResLoaded, this);

        //res
        ResMgr.init();
        //Audio
        AudioPlayer.init();

        //
        this.connectWebSocket();

        //IOS必须由html点击触发声音
        let playAudio = () => {
            AudioPlayer.play(AudioEnum.WoodButtonNormal, 0);
            console.log("playAudio");
            window.removeEventListener("touchstart", playAudio, false);
        };

        window.addEventListener("touchstart", playAudio, false);
    }

    //连接服务器
    private connectWebSocket() {
        // 外网
        //"wss://kingzet.cn"
        m4m.io.loadText(`res/server.json`, (txt, _err, isFail) => {
            if (isFail) {
                console.error(`load  server.json err : ${_err}`);
                return;
            }
            let obj = JSON.parse(txt);
            NetWebscoket.Instance.connect(obj.SERVER_ID);
            // console.error(`账号配置加载完毕!`,obj.SERVER_ID);
        });
    }

    private loadTestAccountIDConfig(): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = m4m["accountID"];
            if (id == null) {
                id = "";
            }
            console.error("H5版本账号ID  :" + id);
            m4m.io.loadText(`res/accountID/config${id}.json`, (txt, _err, isFail) => {
                if (isFail) {
                    console.error(`loadTestAccountIDConfig err : ${_err}`);
                    reject();
                    return;
                }
                //set config
                let obj = JSON.parse(txt);
                ConfigMgr.setConf(obj);
                console.log(`账号配置加载完毕!`);
                resolve(null);
            });
        });
    }

    private initEngine() {
        let app = m4m.framework.sceneMgr.app;
        if (!app) {
            app = new m4m.framework.application();
            // 引擎启动
            app.bePlay = true;
            let rootEle = document.getElementById("gamecontainer") as HTMLDivElement;
            app.start(rootEle, m4m.framework.CanvasFixedType.Free);
            app.orientation = m4m.framework.OrientationMode.LANDSCAPE;
            if (window != null) {
                window.onorientationchange = () => {
                    app.refreshOrientationMode();   //屏幕有旋转时，刷新屏幕方向。
                };
            }
        }
    }

    private onResLoaded() {
        console.log(`前置依赖资源加载完毕！`);
        EventMgr.removeListener("res_dependent_loaded", this.onResLoaded, this);
        //stageMgr
        StageMgr.init();
        // //
        // Pick3DModelsMgr.init();
        //多点功能init
        multiToucher.init(UiManager.overlay, GameMgr.app);
    }

    private setMini() {
        //PlatformUtil default
        PlatformUtil.systemQuality = SystemQualityType.high;
        PlatformUtil.WXGetSystemPlatformType = PlatformType.PC;
        let _miniAPIType = "web 浏览器";
        //mini set
        if (miniGame.miniType != miniAPIType.none) {
            miniGame.onMemoryWarning((res) => {
                let level = 0;
                if (res) {
                    level = res.level;
                }
                console.warn(`微信内存警告！ onMemoryWarningReceive , 级别：${level}`);
                //尝试清理 内存
                miniGame.triggerGC();
            });

            if (miniGame.wxSystemInfo) {
                this.setSysInfoInitOnPlay(miniGame.wxSystemInfo);
            }
            _miniAPIType = miniAPIType[miniGame.miniType];
        } else {
            PlatformUtil.WXGetSystemPlatformType = PlatformUtil.getTypeByBrowser();
        }

        PlatformUtil.platform = PlatformType[PlatformUtil.WXGetSystemPlatformType];
        console.log(`h5平台 类型 ：${_miniAPIType} \n设备类型 PlatformType ： ${PlatformUtil.platform} `);
    }

    private setSysInfoInitOnPlay(res) {
        GameInfoUtil.brand = res.brand;
        GameInfoUtil.model = res.model;
        GameInfoUtil.version = res.version;
        GameInfoUtil.systemStr = res.system;
        GameInfoUtil.SDKVersion = res.SDKVersion;

        // //流海屏 UI层偏移位置
        // UIOpenOrHideManager.Instance.liuhaiOffset();

        console.error("当前平台 **********   " + res.platform);
        PlatformUtil.recordWXPlatform = res.platform;
        if (res.platform == "ios") {
            PlatformUtil.WXGetSystemPlatformType = PlatformType.iPhone;
            // PlatformUtil.platform = "ios";
            // console.error("苹果 ");
        } else if (res.platform == "android") {
            PlatformUtil.WXGetSystemPlatformType = PlatformType.Android;
            // PlatformUtil.platform = "android";
        }

        let _model: string = res.model;
        console.log("当前机型  " + _model + " platform  " + res.platform);

        let qua: string = "高";
        //ios  暂设置 iPhone8及以下 机型为低端机
        if (PlatformUtil.WXGetSystemPlatformType == PlatformType.iPhone) {
            let modelArr: string[] = _model.split(" ");
            if (modelArr.length > 1) {
                let modelStr = modelArr[1];
                modelStr = modelStr[0];//因拿 到的机型值 种类比较多  暂时直接拿 第一位数值来判断  8以下 4以上都是低端机  所以可以这样先做判断
                let isNum = Number(modelStr);
                if (!isNaN(isNum) && isNum >= 4 && isNum <= 8) {
                    PlatformUtil.systemQuality = SystemQualityType.low;
                    console.log("当前机型  " + _model + "  品质  low");
                    qua = "低";
                }
            }
        } else if (PlatformUtil.WXGetSystemPlatformType == PlatformType.Android) {
            if (res.benchmarkLevel != -1 && res.benchmarkLevel <= 9) {
                PlatformUtil.systemQuality = SystemQualityType.low;
                qua = "低";
            }
            qua += "    安卓设备性能等级  " + res.benchmarkLevel;
        }
        console.error("当前机型  " + _model + "  品质 " + qua);
        if (PlatformUtil.systemQuality === SystemQualityType.low) {
            m4m.framework.sceneMgr.app["globalMacros"].push("LOW_END");    //shader 中增加全局宏
        }
    }
}

setTimeout(() => {
    let a = new AppMain();
}, 0);