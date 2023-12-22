import { cMap } from "Data/Map";
import { EventGeneric, EventMgr } from "eventMgr";
import { SceneShowEvent } from "events/sceneShowEvent";
import { SceneVisualEvent } from "events/sceneVisualEvent";
import { CameraFollowCtr } from "Scripts/CameraFollowCtr";
import { TimeUtil } from "Time/TimeUtil";
import { addSpCustomComp, getSpTransform, spAPP, wxEngineEnvSet } from "Tools/engineParallel/parallelEngineTool";
import { ISpCamera, ISpComponent, ISpTransform, spComponentType } from "Tools/engineParallel/spInterface";
import { FrameMgr } from "Tools/FrameMgr";
import { LateUpdateMgr } from "Tools/LateUpdateMgr";
import { miniAPIType, miniGame } from "Tools/miniGame";
import { GamePlayType, TicketType } from "../GameEnum";
import { GameMgr } from "../GameMgr";
import { GamePlayMgr } from "../gamePlays/GamePlayMgr";
import { PerformanceTestMgr } from "../Manager/PerformanceTestMgr";
import { Role } from "../Role/Role";
import { UIOpenOrHideManager } from "../Manager/UIOpenOrHideManager";
import { RoleMgr } from "../Role/RoleMgr";
import { SceneMgr } from "../Scene/SceneMgr";
import { EffectMgr } from "./EffectMgr";
import { PlatformType, PlatformUtil } from "Tools/PlatformUtil";
import { FontMgr } from "Tools/fontMgr";
import { GameDataEventInitManager } from "../Manager/GameDataEventInitManager";
import { WsDataManager } from "../Net/WsDataManager";
import { PingTimeManager } from "../Net/PingTimeManager";
import { WebsocketTool } from "../Net/WebsocketTool";
import { ActionBase } from "ActionBase";
export class SDKRankRewardData {
    //日奖池
    public gamePool1: any;
    //周奖池
    public gamePool7: any;
    //月奖池
    public gamePool30: any;
    // public gameTicket: any;
    // public gameTicket:any;
}
// import { RankPrizeData } from "../Data/rankPrizeData";
declare var squidgameJssdk;
export class StageMgr {
    //在游戏场景中
    static get inGame(): boolean {
        return GameMgr.gameState == 1;
    }
    /** palyer 的GUID */
    public static get PlayerGUID() { return this._playerGUID; }
    public static mainCam: ISpCamera;
    public static camCtr: CameraFollowCtr;
    public static syncParallelEngineCamera: ISpCamera;
    public static inited = false;
    //服务器数据是否已经授权
    public static needAuthorizationBol: boolean;
    //钱包地址
    public static accountID: string = "";
    /**浏览器窗口失去焦点**/
    public static isBlur: boolean = false;
    /** 场景 root节点 */
    public static sceneRoot: ISpTransform;
    /** 角色 root节点 */
    public static roleRoot: ISpTransform;
    /** 特效 root节点 */
    public static effectRoot: ISpTransform;
    public static scene: m4m.framework.scene;
    public static hasEnterGame: boolean;
    public static needGuildBol: boolean = true;
    public static isFirstAutograph: boolean = true;
    public static blance: number = 0;
    public static allownce: number = 0;
    public static agreeAutographbol: boolean = true;
    public static ranktype: number = -1;
    public static haveTicketNum: number = 1;
    public static totalBoughtTicketNum: number = 0;
    public static ticketCostNum: number = 0;
    public static dailySQTnum: number = 0;
    public static weeklySQTnum: number = 0;
    public static monthlySQTnum: number = 0;
    public static dailyUSDTnum: number = 0;
    public static weeklyUSDTnum: number = 0;
    public static monthlyUSDTnum: number = 0;
    public static dailyrate: number = 0;
    public static weekrate: number = 0;
    public static monthrate: number = 0;
    public static levelType: number = 1;
    public static ticketType: TicketType = TicketType.wooden;
    public static SQTawardDataArr: any[];
    public static USDTawardDataArr: any[];
    public static ReverseUserOrdersDic: cMap<any> = new cMap<any>();
    public static rankAwardData: any;
    public static canClickBol: boolean = false;
    public static SQTclaimableNum: number = 0;
    public static dailySQTclaimableNum: number = 0;
    public static weeklySQTclaimableNum: number = 0;
    public static monthlySQTclaimableNum: number = 0;
    public static derectionType: number = 0;
    public static currentRoundHasSlipedBol: boolean = false;
    public static tugOfWarProTime: number = 0;
    public static endGameBol: boolean = false;
    public static gotoPlayGameBol: boolean = false;
    public static playerID: string;
    public static playerinfo: any;
    public static playername: any;
    public static init() {
        //动态加载字体 
        // tslint:disable-next-line: max-line-length
        let useBufferMode = PlatformUtil.WXGetSystemPlatformType == PlatformType.iPhone && (miniGame.miniType == miniAPIType.qq || miniGame.miniType == miniAPIType.none); //解决qq 下 ios ，动态字体刷新bug
        let isIosBol = PlatformUtil.WXGetSystemPlatformType == PlatformType.iPhone;
        FontMgr.Instance.init(useBufferMode, isIosBol);

        //
        GameDataEventInitManager.init();
        // this.ReverseUserOrdersDic = new cMap<any>();
        let scene = this.scene = m4m.framework.sceneMgr.scene;
        //node
        let _Root = getSpTransform(scene.getRoot());

        this.sceneRoot = getSpTransform(new m4m.framework.transform());
        //性能调试模式
        if (GameMgr.performanceDebug) {
            if (GameMgr.sceneHideDebug) {
                this.sceneRoot.gameObject.visible = false;
                GameMgr.testStr = "场景隐藏";
            }
        }
        this.sceneRoot.name = `sceneRoot`;
        _Root.addChild(this.sceneRoot);

        this.roleRoot = getSpTransform(new m4m.framework.transform());
        //性能调试模式
        if (GameMgr.performanceDebug) {
            if (GameMgr.roleModelHideDebug) {
                this.roleRoot.gameObject.visible = false;
                GameMgr.testStr = "角色隐藏";
            }
        }
        this.roleRoot.name = `roleRoot`;
        _Root.addChild(this.roleRoot);

        this.effectRoot = getSpTransform(new m4m.framework.transform());
        //性能调试模式
        if (GameMgr.performanceDebug) {
            if (GameMgr.effectHideDebug) {
                this.effectRoot.gameObject.visible = false;
                GameMgr.testStr = "特效隐藏";
            }
        }
        this.effectRoot.name = `effectRoot`;
        _Root.addChild(this.effectRoot);
        //
        if (miniGame.miniType != miniAPIType.none) {
            console.error(` SDKVersion : ${miniGame.wxSystemInfo.SDKVersion}`);
        }

        //性能设置
        //time
        TimeUtil.init(GameMgr.app, GameMgr.limitFrame);
        //渲染场景
        SceneMgr.init();
        //角色管理器
        RoleMgr.init();
        //特效管理器
        EffectMgr.init(this.effectRoot);
        //广告 ID初始化
        //性能测试 
        if (GameMgr.performanceDebug) {
            //PerformanceTestMgr.init();
        }

        //相机
        this.cam_Light_Init();

        //lateupdate
        scene.onLateUpdate = LateUpdateMgr.onUpdate.bind(LateUpdateMgr);

        this.inited = true;

        //wx 引擎环境
        wxEngineEnvSet();

        //update reg
        FrameMgr.Add(this.update, this);
        LateUpdateMgr.Add(this.lateUpdate, this);

        //事件
        // EventMgr.addListener("battle_role_ready", this.onBattleRoleReady, this);
        EventMgr.addListener("scene_visual_change", this.onSceneVisualChange, this);
        //
        // this.enterHall();
        // this.connect();
        //进入登录页面
        this.enterLogin();

        // window.onblur = () => {
        //     console.error("小伙不要走，我要和你对决");
        //     //浏览器窗口失去焦点
        //     StageMgr.isBlur = true;
        // };

        // window.onfocus = () => {
        //     console.error("亲，欢迎你回来");
        //     StageMgr.isBlur = false;
        // };
    }

    //动作配置文件数据
    public static actionBaseConfigObj: any = {};
    /** 登录服务器成功 */
    public static onLoginServerSuccess() {
        //显示玩家头顶UI
        // UIOpenOrHideManager.Instance.OpenGamingView();
        //初始化UIloading界面
        // UiManager.InitUi(UiNames.Circleloading);
        //进入 大厅
        // this.enterHall();
        //进入 木头人
        //this.enterWooden();
        //信号显示
        // UIOpenOrHideManager.Instance.OpensignalsView();

        //开启 pingTime
        PingTimeManager.Instance.pingTimeFun();

        StageMgr._playerGUID = WsDataManager.UserVarBaseData.token;
        //动作配置文件加载暂写在这
        ActionBase.getAllDataCallBack(() => {
            //ActionBase.list;
            let states = {};
            let arr = [];
            arr.push({ from: "__entry__", to: "Idle" });
            ActionBase.list.forEach((value, key) => {
                // console.error(key);
                let obj = {};
                obj["clipName"] = key;
                obj["speed"] = value.speed;
                obj["normalizeTime"] = 1;
                obj["mirror"] = value.mirror;
                states[key] = obj;

                let tra = { from: "__anyState__", to: key };
                arr.push(tra);
            });
            StageMgr.actionBaseConfigObj["states"] = states;
            StageMgr.actionBaseConfigObj["transitions"] = arr;
            //进入单人大厅 
            GamePlayMgr.RunGame(GamePlayType.singleHall);
        });
        // //进入单人大厅 
        // GamePlayMgr.RunGame(GamePlayType.singleHall);
        //进入 扣糖饼
        // this.enterSugar();
        // //开启摇杆
        // UIOpenOrHideManager.Instance.OpenRockerView();
        //进入 拔河
        // this.enterTug();

        WebsocketTool.Instance.TicketManager_getAllTicketInfo(); // 通知服务器获取所有门票
    }

    /** 场景切换 */
    private static onSceneVisualChange(ev: SceneVisualEvent) {
        console.log(`场景切换 isShow : ${ev.isShow} , sceneID : ${ev.sceneID} , sceneType : ${ev.sceneType}`);
    }

    /** 登录游戏页面 */
    private static enterLogin() {
        // UIOpenOrHideManager.Instance.OpenTestView();
        // UIOpenOrHideManager.Instance.OpenConnectWalletView();
        UIOpenOrHideManager.Instance.HideTloadingView();
        UIOpenOrHideManager.Instance.OpenRockerView();
        UIOpenOrHideManager.Instance.OpenSteerView();
    }

    /** 进入 到大厅 */
    private static enterHall() {
        //准备 大厅 场景 
        // //准备角色
        // //自己的角色
        // let roleId = 10004;

        //进入 大厅游戏
        //GamePlayMgr.RunGame(GamePlayType.sugarCake);
        GamePlayMgr.RunGame(GamePlayType.hall);
    }

    public static enterSugar() {
        //准备角色
        // //自己的角色
        //进入 扣糖饼
        GamePlayMgr.RunGame(GamePlayType.sugarCake);
    }

    // private static enterWooden() {
    //     //准备角色
    //     //自己的角色
    //     let roleInfo = new RoleAttrInfo();
    //     roleInfo.roleType = RoleTypeEnum.Player;
    //     roleInfo.GUID = StageMgr.PlayerGUID;
    //     EventMgr.dispatchEvent("role_make", new EventGeneric<{ roleInfo: RoleAttrInfo }>({ roleInfo }));
    //     //进入 木头人
    //     GamePlayMgr.RunGame(GamePlayType.woodenPeople);
    // }

    private static enterTug() {
        //准备角色
        //进入 拔河游戏
        GamePlayMgr.RunGame(GamePlayType.tugOfWar);

    }

    /** 等待 角色创建完毕 */
    public static waitRoleMakeSuc(GUID: string = "") {
        let end: Function;
        let p = new Promise((resolve) => {
            end = resolve;
        });
        let obj = {
            fun: (ev: EventGeneric<string>) => {
                if (GUID && GUID != ev.data) { return; }
                end();
                EventMgr.removeListener("role_makeSuccess", obj.fun, obj);
            },
        };
        EventMgr.addListener("role_makeSuccess", obj.fun, obj);

        return p;
    }

    // /**
    //  * 等待场景的 可视状态变化
    //  * @param sceneID 场景ID
    //  * @param isShow 是否显示
    //  * @returns 
    //  */
    // public static waitSceneVisualChange(sceneID: number = NaN, isShow: boolean = null) {
    //     let end: Function;
    //     let p = new Promise((resolve) => {
    //         end = resolve;
    //     });
    //     let obj = {
    //         fun: (ev: SceneVisualEvent) => {
    //             if (!isNaN(sceneID) && sceneID != ev.sceneID) { return; }
    //             if (isShow != null && isShow != ev.isShow) { return; }
    //             end();
    //             EventMgr.removeListener("scene_visual_change", obj.fun, obj);
    //         },
    //     };
    //     EventMgr.addListener("scene_visual_change", obj.fun, obj);

    //     return p;
    // }

    //游戏场景加载
    public static loadGameScene(roleArr) {
        //进入木头人场景
        GamePlayMgr.RunGame(GamePlayType.woodenPeople);
    }
    // //创建玩家模型角色
    // public static createRole(roleArr) {
    //     // for (let key in roleArr) {
    //     //     // console.log(`key:${i}`);
    //     //     let roleData = roleArr[key];
    //     //     this.onPlayerMake(roleId, roleData.id);
    //     // }

    //     for (let key in roleArr) {
    //         // console.log(`key:${i}`);
    //         let roleData = roleArr[key];
    //         // this.onPlayerMake(roleId, roleData.id);
    //         let GUID = roleData.playerInfo.token;
    //         let isMain = GUID == StageMgr.PlayerGUID;
    //         let setPos = roleData.pos;
    //         let roleInfo = new RoleAttrInfo();
    //         roleInfo.roleType = RoleTypeEnum.Player;
    //         roleInfo.GUID = GUID;
    //         // roleInfo.angle=rot;
    //         if (isMain) {
    //             console.error("玩家ID " + GUID + " 进入等待房间");
    //         }
    //         EventMgr.dispatchEvent("role_make", new EventGeneric<{ roleInfo: RoleAttrInfo }>({ roleInfo }));
    //     }
    // }

    // //玩家移动
    // public static moveRole(roleArr) {
    //     // for (let key in roleArr) {
    //     //     // console.log(`key:${i}`);
    //     //     let roleID = key;
    //     //     let str = roleArr[key];
    //     //     let isMain = roleID == MessageSendConversion.userID;
    //     //     if (isMain) {
    //     //         //
    //     //     } else {
    //     //         let player: Role = this.roleTestDic.get(roleID);
    //     //         let currentRole = player.roleDoll;
    //     //         // let strArr = str.split("+");
    //     //         let targetPoint = new m4m.math.vector3(str.x, str.y, str.z);
    //     //         currentRole.move(targetPoint);
    //     //     }
    //     // }

    //     for (let key in roleArr) {
    //         // console.log(`key:${i}`);
    //         let GUID = key;
    //         let posAngle = roleArr[key];
    //         console.error(posAngle);
    //         let isMain = GUID == StageMgr.PlayerGUID;
    //         if (isMain) {
    //             //
    //         } else {
    //             // let player: Role = this.roleTestDic.get(GUID);
    //             // let currentRole = player.roleDoll;
    //             // // let strArr = str.split("+");
    //             // let targetPoint = new m4m.math.vector3(str.x, str.y, str.z);
    //             // currentRole.move(targetPoint);

    //             let angle: number = posAngle.angle;
    //             let str = posAngle.pos;
    //             let data = new m4m.math.vector3(str.x, str.y, str.z);
    //             EventMgr.dispatchEvent("role_Data_upDate", new EventGeneric<{ GUID: string, data: any }>({ GUID, data }));
    //         }
    //     }
    // }

    public static setPos(): void {
        let player: Role = RoleMgr.getRoleByGUID(StageMgr.PlayerGUID);
        let currentRole = player.roleDoll;
        let pos = currentRole.model.localPosition;
        let targetPoint = new m4m.math.vector3(pos.x, pos.y, pos.z + 1);
        // currentRole.startMove(targetPoint, 2);

        // MessageSendConversion.updataGame(targetPoint);
    }
    // 创建 player 玩家 测试
    // tslint:disable-next-line: no-async-without-await
    private static async onPlayerMake(roleId: number, uuid: string) {
        // let _player = new Role();
        // await _player.init(roleId);
        // let pos = _player.roleDoll.model.localPosition;
        // pos.y += 2;
        // _player.roleDoll.model.localPosition = pos;
        // let isMain = uuid == MessageSendConversion.userID;
        // if (isMain) {
        //     console.error("玩家ID " + uuid);
        //     MainRoleManager.Instance.mainRole = _player;
        // }
        // this.roleTestDic.set(uuid, _player);
        // console.error("添加玩家 位置信息 ", uuid, pos);
        // if (isMain) {
        //     StageMgr.camCtr.setTarget(_player.roleDoll.model);
        //     StageMgr.camCtr.distance = 20;
        //     StageMgr.camCtr.tiltAngle = 30;
        // }
    }
    // /** 战斗角色准备完毕 */
    // private static onBattleRoleReady() {
    //     //
    //     console.log(`战斗角色准备完毕`);
    // }

    // public static startGame() {

    // }

    // /**
    //  * 开始进入游戏场景
    //  */
    // public static enterGame(sceneBlockId: number = 3) {
    //     // console.error("进游戏场景 开始进入场景 enterGame()");
    //     this.hasEnterGame = true;
    // }

    // /**
    //  * 切换场景
    //  */
    // public static changeScene() {

    // }

    // /**
    //  * 离开游戏场景
    //  */
    // public static leaveGame() {
    //     GameMgr.gameState = -1;
    //     //场景资源释放
    //     //关闭各系统
    //     //清理
    //     // //结束游戏前 清理一下
    //     this.hasEnterGame = false;
    // }

    //相机 灯光 初始化设置
    private static cam_Light_Init() {
        let scene = this.scene;
        scene.mainCamera.backgroundColor = new m4m.math.color(0, 98 / 255, 144 / 255, 0);
        // scene.mainCamera.fov =0.523559  角度 30 的弧度值
        scene.mainCamera.fov = 0.9075712110370514;// 角度值 52
        //60 * Math.PI / 180;
        scene.mainCamera.far = 1000;
        scene.mainCamera.near = 0.2;

        this.mainCam = getSpTransform(scene.mainCamera.gameObject.transform).gameObject
            .getFirstComponent(spComponentType.camera) as ISpCamera;

        let camCtr = addSpCustomComp<CameraFollowCtr>(this.mainCam.gameObject.transform, CameraFollowCtr);

        //抖动问题
        // LateUpdateMgr.Add(camCtr.stepUpdate, camCtr);

        camCtr.distance = 0;
        camCtr.tiltAngle = 0;

        this.camCtr = camCtr;

        spAPP.setEnableFog(false);
    }

    //update
    public static update(delta: number) {
        // //轮错误日志上报
        // if (!this.inGame) {//不在游戏场景中
        //     return;
        // }

        //性能分析用 ， 统计 平均帧率
        if (GameMgr.performanceDebug) {
            PerformanceTestMgr.update(delta);
        }
    }

    //lateUpdate
    public static lateUpdate(delta: number) {
        if (this.camCtr) {
            this.camCtr.step();     //相机位置计算更新
        }

        this.wxCamUpdate(delta);
    }

    //微信 相机同步
    private static wxCamUpdate(dt: number) {
        let pCam = this.syncParallelEngineCamera;
        if (pCam) {
            let rawCam = this.scene.mainCamera;
            pCam.fov = rawCam.fov;

            let rawCamTran = rawCam.gameObject.transform;
            let ptran = pCam.gameObject.transform;
            ptran.localPosition = rawCamTran.localPosition;
            ptran.localRotate = rawCamTran.localRotate;
        }
    }
    private static _evMakeRole: EventGeneric<{ roleId: number, GUID: string }> = new EventGeneric({ roleId: -1, GUID: "'" });
    private static _playerGUID: string = "";

    // tslint:disable-next-line: member-ordering
    private static roleTestDic: cMap<Role> = new cMap();

}