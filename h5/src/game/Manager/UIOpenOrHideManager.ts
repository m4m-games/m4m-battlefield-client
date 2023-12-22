import { EventBase, EventGeneric, EventMgr } from "eventMgr";
import { SceneHideEvent } from "events/sceneHideEvent";
import { SceneShowEvent } from "events/sceneShowEvent";
import { SceneType, SceneVisualEvent } from "events/sceneVisualEvent";
// import { SlotRoleEvent } from "events/SlotRoleEvent";
import { UiManager } from "PSDUI/UiManager";
import { miniGame } from "Tools/miniGame";
import { PlatformUtil } from "Tools/PlatformUtil";
import { touchPad } from "UIBase/touchPad";
// import { FuncType } from "../Data/GameEnum";
// import { PlayerData } from "../Data/PlayerData";
import { GameMgr } from "../GameMgr";
import { UiNames } from "./UIData/UiNames";
// import { CommonOpenFunPanelManager } from "./CommonOpenFunPanelManager";
// import { UiNames } from "./UIData/UiNames";
// import { UITipManager } from "./UITipManager";

export class UIOpenOrHideManager {
    public static get Instance(): UIOpenOrHideManager {
        if (this._instance == null) {
            this._instance = new UIOpenOrHideManager();
        }
        return this._instance;
    }
    // public set showRoomEuler(v) { this._showRoomEuler = v; this.refreashShowRoompaltformEuler(); }
    // public get showRoomEuler() { return this._showRoomEuler; }

    //是否可以显示loading
    public static needShowLoading: boolean = true;

    public _showRoomEuler = 0;
    public touchPadTran: m4m.framework.transform2D;
    public roleId: number = 0;

    //设置下一个打开的UI
    public nextOpenUiName: string;
    /**设置矿洞页面 */
    public cavePageNumber = 0;

    public constructor() {
        ///隐藏 不主动释放的 UI列表
        UiManager.dontDisposeUIList = [];
        UiManager.dontDisposeUIList.push(UiNames.loading);
        UiManager.dontDisposeUIList.push(UiNames.wloading);
        // UiManager.dontDisposeUIList.push(UiNames.Tooltip);
        // UiManager.dontDisposeUIList.push(UiNames.Circleloading);
        // UiManager.dontDisposeUIList.push(UiNames.Cardsone);
        // UiManager.dontDisposeUIList.push(UiNames.Cardsten);
        // UiManager.dontDisposeUIList.push(UiNames.Guide);
        // UiManager.dontDisposeUIList.push(UiNames.Playgame);

        //开始打开UI 回调
        UiManager.startLoadCallBack = (uiname) => {
            if (UIOpenOrHideManager.needShowLoading && uiname != UiNames.wloading) {
                // console.error("开始加载UI " + uiname);
                if (this.uiloadingCanShow) {
                    //显示UIloading界面
                    UiManager.showUi(UiNames.wloading);
                    this.uiloadingCanShow = false;
                }
            }
        };
        UiManager.endLoadCallBack = (uiname) => {
            if (UIOpenOrHideManager.needShowLoading && uiname != UiNames.wloading) {
                // console.error("UI加载完成 " + uiname);
                //半闭UIloading界面
                if (UiManager.isUiShow(UiNames.wloading)) {
                    UiManager.hideUi(UiNames.wloading);
                }
                this.uiloadingCanShow = true;
            }
        };
    }
    private static _instance: UIOpenOrHideManager;
    private uiloadingCanShow: boolean = true;
    public OpenNextUI() {
        if (this.nextOpenUiName) {
            UiManager.showUi(this.nextOpenUiName);
            this.nextOpenUiName = "";
        } else {
            // UiManager.showUi(UiNames.Main);
        }
    }
    //通用面板中调用打开别的UI面板方法
    // public CommonOpenFunPanel(funcType: FuncType, param, param2 = null) {
    //     CommonOpenFunPanelManager.Instance.funcType = funcType;
    //     CommonOpenFunPanelManager.Instance.param = param;
    //     CommonOpenFunPanelManager.Instance.param2 = param2;

    //     switch (funcType) {
    //         case FuncType.FT_RECHARGE:  //充值
    //             this.OpenReCharge2();
    //             break;
    //         case FuncType.FT_QIAN_DAO: //签到
    //             this.OpenSigninView();
    //             break;
    //         case FuncType.FT_HEISHI:  //神秘商店
    //             this.OpenShopView();
    //             break;
    //         case FuncType.FT_HERO_LIST:  //英雄列表
    //             this.OpenHeroListView();
    //             break;
    //         case FuncType.FT_JJC: //竞技场
    //             this.OpenArenaView();
    //             break;
    //         case FuncType.FT_CHALLENGE: //试炼 挑战
    //             this.OpenLadderView();
    //             break;
    //         case FuncType.FT_RES_DUNGEON: //沙漠探索
    //             this.OpenCaveView();
    //             break;
    //         case FuncType.FT_DESERT_EXPLORE: //沙漠探索
    //             // this.OpenLadderView();
    //             break;
    //         case FuncType.FT_MAIN: //主界面
    //             this.OpenMainView();
    //             break;
    //         case FuncType.FT_FRIEND: //好友
    //             this.OpenFriendsPanel();
    //             break;
    //         case FuncType.FT_FAST_COLLECT_BUILD_PRIZE: //挂机奖励
    //             this.OpenGuajiTCView();
    //             break;
    //         case FuncType.FT_ALLIANCE: // 悬赏
    //             this.OpenXStaskView();
    //             break;
    //         case FuncType.FT_CARD: // 酒馆召唤
    //             this.OpenSummonView();
    //             break;
    //         case FuncType.FT_UPGRADE_QUALITY: // 英雄祭坛
    //             this.OpenHeroAltarView();
    //             break;
    //         case FuncType.FT_RECHARGE: // 英雄祭坛
    //             this.OpenHeroAltarView();
    //             break;
    //         case FuncType.FT_EQUIP: // 装备强化
    //             this.OpenHeroListView();
    //             break;
    //         case FuncType.FT_ACTIVE_DEGREE: //任务界面
    //             this.OpenMainRWView();
    //             break;
    //         default:
    //             UITipManager.Instance.tipPanelText = "未找到需要打开的面板！类型 " + funcType;
    //             UIOpenOrHideManager.Instance.OpenTipsTCView();
    //     }
    // }

    //流海屏 UI层偏移位置
    public liuhaiOffset() {
        if (PlatformUtil.isLiuHai == false) {
            if (miniGame.wxSystemInfo && miniGame.wxSystemInfo.safeArea) {//判断流海屏
                //如果是流海屏
                PlatformUtil.isLiuHai = miniGame.wxSystemInfo.safeArea.left > 0;//||res.safeArea.top>0;
                // console.error("是否流海屏 " + PlatformUtil.isLiuHai);
                if (PlatformUtil.isLiuHai) {//流海屏 UI层偏移位置
                    let num = 45;
                    UiManager.baselayer.transform.setLayoutValue(m4m.framework.layoutOption.LEFT, num);
                    UiManager.baselayer.transform.markDirty();
                    UiManager.midlayer.transform.setLayoutValue(m4m.framework.layoutOption.LEFT, num);
                    UiManager.midlayer.transform.markDirty();
                    UiManager.highlayer.transform.setLayoutValue(m4m.framework.layoutOption.LEFT, num);
                    UiManager.highlayer.transform.markDirty();
                    // console.error("是否流海屏 移动位置 " + PlatformUtil.isLiuHai);
                }
            }
        }
    }
    //调用场景显示
    public loadSceneFun(sceneID: number, uiName: string = null) {
        //显示目标场景
        let sceneShowEvent = new SceneShowEvent();
        sceneShowEvent.sceneID = sceneID;
        sceneShowEvent.uiName = uiName;
        EventMgr.dispatchEvent("scene_show", sceneShowEvent);
    }
    /**关闭 英雄详情界面*/
    public hideHeroView() {
        this.hideSceneFun(GameMgr.heroDetailsSceneID);
    }
    //调用场景显示
    public hideSceneFun(sceneID: number) {
        //显示目标场景
        let sceneShowEvent = new SceneHideEvent();
        sceneShowEvent.sceneID = sceneID;
        sceneShowEvent.dispose = false;
        EventMgr.dispatchEvent("scene_hide", sceneShowEvent);
    }

    // /*关闭单人大厅按钮界面*/
    public HideHallView() {
        UiManager.hideUi(UiNames.Hall);
    }
    // /*打开单人大厅按钮界面*/
    public OpenHallView() {
        UiManager.showUi(UiNames.Hall);
    }

    /** 打开摇杆ui */
    public OpenRockerView() {
        UiManager.showUi(UiNames.rocker);
    }
    /** 打开登录ui */
    public OpenTestView() {
        UiManager.showUi(UiNames.test);
    }
    /** 关闭登录ui */
    public HideTestView() {
        UiManager.hideUi(UiNames.test);
    }
    /** 打开游戏中UI */
    public OpenGamingView() {
        UiManager.showUi(UiNames.gaming, null, false);
    }
    /** 关闭游戏中UI */
    public HideGamingView() {
        UiManager.hideUi(UiNames.gaming);
    }

    /** 打开通用结算 */
    public OpenCountdownView() {
        UiManager.showUi(UiNames.countdown);
    }
    /** 关闭通用结算 */
    public HideCountdownView() {
        UiManager.hideUi(UiNames.countdown);
    }

    /** 打开新loading */
    public OpenTloadingView() {
        UiManager.showUi(UiNames.tloading);
    }
    /** 关闭新loading */
    public HideTloadingView() {
        UiManager.hideUi(UiNames.tloading);
    }

    /** 打开手机操作引导图 */
    public OpenTutorialmbView() {
        UiManager.showUi(UiNames.tutorialmb);
    }
    /** 关闭手机操作引导图 */
    public HideTutorialmbView() {
        UiManager.hideUi(UiNames.tutorialmb);
    }
    /** 打开pc操作引导图 */
    public OpenTutorialpcView() {
        UiManager.showUi(UiNames.tutorialpc);
    }
    /** 关闭pc操作引导图 */
    public HideTutorialpcView() {
        UiManager.hideUi(UiNames.tutorialpc);
    }
    /**开启多人大厅等待文字提示*/
    public OpentxtbgView() {
        UiManager.showUi(UiNames.txtbg, null, false);
    }
    /**关闭多人大厅等待文字提示*/
    public HidetxtbgView() {
        UiManager.hideUi(UiNames.txtbg);
    }
    /**开启信号提示*/
    public OpensignalsView() {
        UiManager.showUi(UiNames.signals, null, false);
    }
    /** 打开loading界面 */
    public OpenLoadingView() {
        UiManager.showUi(UiNames.loading);
    }
    /** 关闭loading界面 */
    public HideLoadingView() {
        UiManager.hideUi(UiNames.loading);
    }

    /**关闭信号提示*/
    public HidesignalsView() {
        UiManager.hideUi(UiNames.signals);
    }
    /** 打开tips */
    public OpenTipsTCView() {
        UiManager.showUi(UiNames.tips);
    }
    /** 关闭tips */
    public HideTipsTCView() {
        UiManager.hideUi(UiNames.tips);
    }

    /** 打开圆环旋转loading */
    public OpenWloadingView() {
        UiManager.showUi(UiNames.wloading);
    }
    /** 关闭圆环旋转loading */
    public HideWloadingView() {
        UiManager.hideUi(UiNames.wloading);
    }
    /** 打开链接钱包 */
    public OpenConnectWalletView() {
        UiManager.showUi(UiNames.connect);
    }
    /** 关闭链接钱包 */
    public HideConnectWalletView() {
        UiManager.hideUi(UiNames.connect);
    }

    public OpenSteerView(){
        UiManager.showUi(UiNames.Steer);
    }
    public HideSteerView(){
        UiManager.hideUi(UiNames.Steer);
    }
}
