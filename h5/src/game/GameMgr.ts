import { ExcelDataBase } from "Data/ExcelDataBase";
import { UiManager } from "PSDUI/UiManager";
import { engineParallelType } from "Tools/engineParallel/spInterface";
import { FrameMgr } from "Tools/FrameMgr";
import { miniGame } from "Tools/miniGame";
import { PlatformType, PlatformUtil, SystemQualityType } from "Tools/PlatformUtil";
import { uiMgr } from "UIBase/uiMgr";
import { AudioEnum } from "./Audio/AudioEnum";
import { AudioPlayer } from "./Audio/AudioPlayer";
import { InputManager } from "./Manager/InputManager";
import { DatGUITool } from "./Tool/datGUITool";

export enum gState {
    /** 游戏开始运行前 */
    beforeRuning = 0,
    /** 游戏运行状态 */
    gameRuning = 1,
    /** 游戏暂停状态 */
    gamePaused = 2,
    /** 游戏结束 */
    gameStop = -1,
}

/** 并行接入性能引擎 */
export class GameMgr {
    //布阵场景ID
    public static campSceneID: number = 4001;
    //英雄详情场景ID
    public static heroDetailsSceneID: number = 3002;
    /** 标记为 帧动画骨骼 */
    public static readonly isKFAnimtionTag = "__isKFAnimtionTag__";

    /** 使用微信性能引擎 */
    public static engineParallel: engineParallelType;

    static get hasWxEngine() { return window["engine"] != null; }

    /** 是否使用 testCreat 新加载资源工具 */
    public static useTestCreate = false;
    /** 性能调试模式 */
    public static performanceDebug: boolean = false;
    /** 性能调试开启 */
    public static perfDebugStart: boolean = false;
    /** 性能调试结果输出 */
    public static perfDebugOutput: boolean = false;
    /** 场景隐藏调试 */
    public static sceneHideDebug: boolean = false;
    /** 角色模型隐藏调试 */
    public static roleModelHideDebug: boolean = false;
    /** 特效隐藏调试 */
    public static effectHideDebug: boolean = false;
    /** UI隐藏调试 */
    public static uiHideDebug: boolean = false;
    public static testStr: string = "全显示状态";
    /** 调试GUI 开启 */
    public static debugGUIEnable: boolean = false;
    /**  显示 2d绘制 调试线框 */
    public static Draw2dDebug: boolean = false;
    /** 无敌模式调试 */
    public static godModeDebug: boolean = false;
    /** 和平模式调试（角色都不扣血） */
    public static peaceModeDebug: boolean = false;
    /** 调试 战斗 */
    public static debugModeBattle: boolean = false;
    // /** 调试 引导 */
    // public static debugGuide: boolean = false;

    public static gameState: gState = gState.beforeRuning;
    public static app: m4m.framework.application;
    public static assetMgr: m4m.framework.assetMgr;
    public static inputMgr: m4m.framework.inputMgr;

    //单机版本测试
    public static isSingleTest: boolean = false;
    //鱿鱼游戏单机版本测试
    public static issquidgameSingleTest: boolean = false;
    /** 强制清理UI */
    public static ClearBol: boolean = false;
    /** 强制清理 场景 和 资源 */
    public static forceClearScene: boolean = true;
    /** 声音打开 */
    public static soundOn = "soundOn";
    /** 震动 场景 和 资源 */
    public static shockOn = "shockOn";
    // /** 光效 */
    // static rayOn = "rayOn";
    // /** 雾效 */
    // static fogOn = "fogOn";

    /** 高画质 */
    public static highQuality = "highQuality";
    /** 当前限制帧率 ，仅供只读- */
    public static limitFrame: number;
    //分享试用鲨鱼id
    public static trySharkID: number = -1;
    //分享成功的试用鲨鱼ID
    public static shareSucSharkId: number;
    //单机开始
    public static standAlone: number = 0;//单人开始分享试用 0 竞技开始分享试用 1  升级界面分享试用 2
    /** 游戏语言 */
    public static language = "zh";
    //浮窗任务是否完成
    public static windowBol: boolean = false;

    public static resPlat = "PC";

    public static _pageType: number;
    //分享类型  是否已始化过
    public static shareInited: boolean = false;
    //需要暂停   stopPage 面板 和  mapPage 面板打开时  为true
    public static realityPaused: boolean = false;
    public static onGameHide: Function;
    public static onGameShow: Function;
    //第一个场景加载时间
    public static firstSceneLoadTime: number = 0;
    //游戏场景加载时间
    public static gameSceneLoadTime: number = 0;
    //加载场景用时记录
    public static SceneLoadTimeNum: number = 0;
    public static readonly gameName = "hungrysharkevo";//"hungerShark";
    public static isNewAuth = false; //是否是 新授权登录（需要点击 微信登录 按钮） 的用户
    public static readonly developModel = false; //debuge 模式
    public static readonly maxLoadingCount = 100;  //max loading progress lines count
    public static readonly cubeLayer = 8; //cube terrain layer number
    public static readonly limitDtime = 0.06; //dTime limit
    //品质框通用命名 如果一个UI中有重复的 会在命名后加 a  b  c来区分
    public static readonly qualityIconName = `.atlas.json_frame`;
    //职业图标通用命名 如果一个UI中有重复的 会在命名后加 a  b  c来区分
    public static readonly professionalIconName = `.atlas.json_ui_icon`;
    //阵营通用命名 如果一个UI中有重复的 会在命名后加 a  b  c来区分
    public static readonly campIconName = `.atlas.json_ui_campmark`;
    public static readonly CampMark = `ui_CampMark_`;

    public static readonly atlasPath = `res/art/atlas/`; //图集
    public static readonly UIPath = `res/art/ui/`; //UI
    public static readonly configPath = `res/config/`; //配置
    public static readonly sceneObstaclePath = `res/obstacleJson/`; //场景障碍配置
    public static readonly ExcelConfigPath = `res/config/ExcelData/`; //Excel 配置
    public static readonly ExcelSplitConfigPath = `res/config/ExcelDataSplit/`; //Excel 拆分 配置
    public static readonly TexPath = `res/art/texture/`; //贴图
    // static readonly UIPath = `Resources/props/TESTAsset/ui/`; //UI

    public static readonly EquipIcon = `res/art/EquipIcon/`; //装备图
    public static readonly HeroIcon = `res/art/HeroIcon/`; //npc头像图
    public static readonly GoodsIcon = `res/art/GoodsIcon/`; //物品图
    public static readonly PiecesIcon = `res/art/PiecesIcon/`; //碎片图
    public static readonly SkillIcon = `res/art/SkillIcon/`; //技能图
    public static readonly WeaponIcon = `res/art/WeaponIcon/`; //宝石图
    public static readonly tipscon = `res/art/tips/`; //提示说明
    public static readonly RechargeGZ = `res/art/RechargeGZ/`; //贵族特权界面的特权说明
    public static readonly MythicalCreatureIcon = `res/art/MythicalCreatureIcon/`; //魔兽图
    //
    public static readonly Icon = `res/art/Icon/`; //
    //头像框
    public static readonly head = "res/art/head/";
    public static readonly MapPic = `res/art/mapImg/`; //地图图片
    public static readonly MapCloud = `res/art/mapCloud/`; //云图片
    public static readonly GuideImg = `res/art/guideImg/`; //引导相关图片资源
    //新英雄推荐签到背景图
    public static readonly Newhero = `res/art/texture/Newhero/`; //贵族特权界面的特权说明
    /** 音频目录 */
    public static readonly AudioPath = `res/art/audio/`;

    public static readonly SugarCakePolygon = "res/polygonTool/"; //扣糖饼的形状配置

    // public static readonly sharkSkinPath = `Resources/sharkSkin/`; //鲨鱼皮肤

    public static itemPath: string; //物件
    public static rolePath: string; //角色
    public static scenePath: string; //场景物件
    public static effectPath: string; //特效
    public static readonly shaderPath = `res/shaders/`; //shader 资源
    public static readonly bgPath = `Resources/img/bg/`; //背景图
    // public static readonly iconPath = `Resources/icon/`; //图标
    public static readonly fontPath = `Resources/font/`; //字体
    // public static readonly terrainPath = `Resources/terrain/`; //场景地形障碍
    // public static readonly spawnerPath = `Resources/spawner/`; //场景怪生成配置
    public static readonly PFiconPath = `Resources/PFicon/`; //图鉴
    // public static readonly onShelfIcon = `Resources/onShelfIcon/`; //新鲨鱼上架
    public static readonly strangeHeadPath = `Resources/strangeHead/`; //微信陌生人头像目录  wxgame目录下
    public static readonly progressTipicon = `Resources/progressTipicon/`; //初始进游戏加载界面
    public static DNS_AND_PORT = "";
    public static REPORT_SERVER = "";
    /**特效资源路径 微信引擎  */
    public static readonly fxPathWXEngine = "Assets/Resources/Prefabs/effect/"; //
    /** shader 微信引擎*/
    public static readonly shaderPathWXEngine = "Assets/shaders/"; //
    /** 角色资源路径 微信引擎 */
    public static readonly rolePathWXEngine = "Assets/Resources/Prefabs/Role/";
    /** 物品资源路径 微信引擎 */
    public static readonly itemPathWXEngine = "Assets/Resources/Prefabs/Item/";
    /** 场景 微信引擎 */
    public static readonly scenePathWXEngine = "Assets/Resources/Prefabs/Scene/";

    //Convert res path
    /** 角色资源路径 微信引擎 Convert */
    public static readonly rolePathWXEngineConvert = "FromToolConvert/Role/";
    /** 场景 微信引擎 Convert*/
    public static readonly scenePathWXEngineConvert = "FromToolConvert/Scene/";
    // 是否启用钱包
    public static openWalletBol: boolean = false;
    //是否钱包交互跳转loading
    public static connectWalletLoadingBool: boolean = true;
    /** testCrete 使用 资源路径重定向Map  */
    public static pathReplaceMap: { [srcPath: string]: string } = {
        // "res/art/role/": "res/TESTAsset/role/",
        // "res/art/scene/": "res/TESTAsset/scene/",
        // "res/art/item/": "res/TESTAsset/item/",
    };

    /** 性能模式 */
    private static appUpdateFun: any;

    private static isNewVerUIMgr = true;
    /** 获取 UIManager */
    public static getUImgr() {
        return this.isNewVerUIMgr ? UiManager : uiMgr;
    }

    private static nullFun = () => { };

    public static init(app: m4m.framework.application) {
        // //debug gui 
        if (this.debugGUIEnable) {
            DatGUITool.runGameGUI();
        }

        //按钮开启 路径回调 功能
        m4m.framework.button.enablePathDispatch = true;
        m4m.framework.button.onPath = this.onButtonClickCallBackFun.bind(this);

        m4m.framework.transform.prototype["checkToTop"] = () => { };      //检查 去掉优化
        // if(this.developModel){
        //     consTool.init();
        // }
        this.app = app;
        this.appUpdateFun = this.app["update"];
        this.assetMgr = this.app.getAssetMgr();
        //加载的资源由.bin  .txt  文件   后缀都加上了.js     (.bin.js    .txt.js)
        // m4m.framework.assetMgr.useBinJs = true;
        //优化设置
        this.app.markNotify = () => { }; //不需要广播
        let pType = PlatformUtil.WXGetSystemPlatformType;
        let ismobilePhone = pType != PlatformType.PC; //是手机
        if (ismobilePhone) {
            //app.OffOrientationUpdate = true; //不需要方向检测UPdate , 会监听屏幕旋转
        }
        this.app.getScene().autoCollectlightCamera = false;  //手动管理 灯光和相机的收集
        // this.app.isFrustumCulling = false; //剔除不需要
        this.inputMgr = this.app.getInputMgr();
        this.app.addUserCode(FrameMgr.name);  //帧管理对象创建
        if (m4m["CDNURL"]) {
            this._CDNURL = m4m["CDNURL"];
        }
        //设置 加载URL 
        this.platformLoadUrlSet();
        this.engineParallel = miniGame.engineParallel;
        //
        this.resPolicyInit();
        //excel url overload
        ExcelDataBase.excelData = GameMgr.ExcelConfigPath;
        ExcelDataBase.excelSplitData = GameMgr.ExcelSplitConfigPath;
        InputManager.init();
    }

    //按钮被点击回调
    private static onButtonClickCallBackFun(pathStr: string) {
        //如果是  点击操作行为
        if (pathStr.indexOf("PointerClick") != -1) {
            AudioPlayer.play(AudioEnum.WoodButtonNormal);
        }
    }

    /** 引擎暂停 */
    public static enginePause() {
        this.app["update"] = this.nullFun;
        console.error("引擎暂停");
    }

    /** 引擎恢复运行 */
    public static engineReplay() {
        this.app["update"] = this.appUpdateFun;
        console.error("引擎恢复运行");
    }

    private static beforPausedState: gState;
    /** 游戏场景暂停 */
    static get gamePaused() {
        return this.gameState == gState.gamePaused;
    }

    static set gamePaused(v: boolean) {
        if (v) {
            if (this.gameState == gState.gamePaused) { return; }

            this.beforPausedState = this.gameState;
            this.gameState = gState.gamePaused;
        } else {
            let s = this.beforPausedState == null ? gState.gameRuning : this.beforPausedState;
            this.gameState = s;
        }
    }

    //获取 storge 或者 服务器上的数据
    public static downLoadData() {

    }

    // //震动开关
    // static get swSound() { return saveTool.swSound; };
    // static set swSound(val) { saveTool.swSound = val; };

    // static get swVibrate() { return saveTool.swVibrate; };
    // static set swVibrate(val) { saveTool.swVibrate = val; };

    //-----------------

    public static platformLoadUrlSet() {
        let reso: string = "Resources/";
        let quality: string = "";
        switch (PlatformUtil.systemQuality) {//性能高中低
            case SystemQualityType.low:
                quality = `low`;
                break;
            case SystemQualityType.middle:
            case SystemQualityType.high:
                quality = `middle`;
                break;
            default:
                quality = "low";
        }

        let pType = PlatformUtil.WXGetSystemPlatformType;
        let platformFolder = pType == PlatformType.iPhone ? "IOS" : pType == PlatformType.Android ? "ANDROID" : "PC";

        GameMgr.scenePath = `res/art/scene/`;
        GameMgr.rolePath = `res/art/role/`;
        GameMgr.itemPath = `res/art/item/`;
        GameMgr.effectPath = `res/art/fx/`;
        if (this.useTestCreate) {    //设置 testCreat 加载工具 的 替换路径
            this.pathReplaceMap[GameMgr.scenePath] = `res/TESTAsset/scene/`;
            this.pathReplaceMap[GameMgr.rolePath] = `res/TESTAsset/role/`;
            this.pathReplaceMap[GameMgr.itemPath] = `res/TESTAsset/item/`;
            // this.pathReplaceMap[GameMgr.effectPath] = `res/TESTAsset/fx/`;
        }

        // //因如果切换了高低性能  加载的资源路径发生改变 需重置原来存的路径
        // EnterGamePreloadManager.Instance.init();
    }

    private static _CDNURL: string = "";
    static get CDNURL() { return this._CDNURL; }

    //----------------- tags
    // static readonly t_BossIntro = "BossIntro";

    //资源政策
    /** 强制指定走 m4m 模式的资源列表 */
    private static m4mPolicyList = [
        // //role
    ];

    /** 强制指定走 weChat 模式的资源列表 */
    private static _weChatPolicyList = [""];

    private static _hasPolicy = false;   //有政策
    private static _resPolicyMap: { [resName: string]: engineParallelType } = {};
    private static _wxLoadHasShellMap: { [resName: string]: boolean } = {};
    /** 微信资源路径 有壳模式 */
    public static wxResHasShell(path: string) {

        return this._wxLoadHasShellMap[path] != null;

    }

    /**
     * 资源类型策略
     * @param resName 资源名字
     */
    public static engineTypePolicy(resName: string): engineParallelType {
        if (!this._hasPolicy) { return GameMgr.engineParallel; }
        let result = this._resPolicyMap[resName];
        if (result == null) {
            result = GameMgr.engineParallel;
        }
        return result;
    }

    /**
     * 角色路径策略
     * @param resName 资源名
     */
    public static rolePath_Policy(resName: string): string {
        return this.getPolicyPath(resName, this.rolePath, this.rolePathWXEngine);
    }

    /**
     * 单个物品 路径策略
     * @param resName 资源名
     */
    public static itemPath_Policy(resName: string): string {
        return this.getPolicyPath(resName, this.itemPath, this.itemPathWXEngine);
    }

    /**
     * 场景路径策略
     * @param resName 资源名
     */
    public static scenePath_Policy(resName: string): string {
        return this.getPolicyPath(resName, this.scenePath, this.scenePathWXEngine);
    }

    /** 资源类型平台策略 */
    private static getPolicyPath(resName: string, m4mPath: string, wxPath: string) {
        let result: string = "";
        let _type = this.engineTypePolicy(resName);
        switch (_type) {
            case engineParallelType.none: result = m4mPath; break;
            case engineParallelType.wxEngine: result = wxPath; break;
            default: result = "";
        }
        return result;
    }

    private static resPolicyInit() {
        //m4m
        let _gdlist: string[] = this.m4mPolicyList;
        for (let i = 0, len = _gdlist.length; i < len; i++) {
            this._resPolicyMap[_gdlist[i]] = engineParallelType.none;
            this._hasPolicy = true;
        }

        //weChat
        _gdlist = this._weChatPolicyList;
        for (let i = 0, len = _gdlist.length; i < len; i++) {
            this._resPolicyMap[_gdlist[i]] = engineParallelType.wxEngine;
            this._hasPolicy = true;
        }

        //wx
        this.wxResHasShellInit();
    }

    private static wxResHasShellInit() {
        this._wxLoadHasShellMap[this.rolePathWXEngineConvert] = true;
        this._wxLoadHasShellMap[this.scenePathWXEngineConvert] = true;
    }

    //测试控制 开关
    //static testOpt = new testOptionStruct();
}