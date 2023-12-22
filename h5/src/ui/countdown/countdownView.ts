import { CommonUIUtils } from "Data/CommonUIUtils";
import { ScoreboardManager } from "Manager/ScoreboardManager";
import { commTool } from "Tools/commTool";
import { imgSpriteArrange } from "UIBase/imgSpriteArrange";
import { GamePlayType } from "GameEnum";
import { GamePlayMgr } from "gamePlays/GamePlayMgr";
import { UIOpenOrHideManager } from "Manager/UIOpenOrHideManager";
import { countdown } from "./countdown";
import { GameRunningCountdownManager } from "Manager/GameRunningCountdownManager";
import { WebsocketTool } from "Net/WebsocketTool";
import { EffectMgr } from "Core/EffectMgr";
import { Over3dModelMgr } from "Tools/Over3dModelMgr";
import { GameMgr } from "GameMgr";
import { GameLogic } from "Core/GameLogic";
import { UiManager } from "PSDUI/UiManager";
import { UiDataManager } from "PSDUI/UiDataManager";
import { BindKeyName } from "Data/BindKeyName";
import { EventGeneric, EventMgr } from "eventMgr";
import { PlayGameType } from "gamePlays/PlayGameType";
import { ConnectWalletTonkeeper } from "Core/blockchain/ConnectWalletTonkeeper";

/*结算弹窗*/
export class countdownView extends countdown {

    public noAffected = true;
    public uiLayer = 1;

    /** 当前UI是否会影响场景玩家操作 */
    public influenceSceneAction: boolean = true;
    private isWin: boolean = false;

    private yanhuaEff: number = null;
    private jinbiEff: number = null;

    public onInit() {
        super.onInit();

        this.onShow = this.onShowFunc.bind(this);
        this.onDispose = this.onDisposeFunc.bind(this);
        this.onHide = this.onHideFunc.bind(this);

        this.button1_btn_btnEvent = this.closeClickFunc.bind(this);
        this.button2_btn_btnEvent = this.buttonFun.bind(this)

        this.btntext1_lab_text("CLOSE");

        this.btntext2_lab_text("PLAY AGAIN");

        //先不显示面板
        this.bg00_img.transform.visible = false;

        //红色边框

        //屏蔽ui事件
        commTool.makeUIEventDiscard(this.bg00_img.transform);
    }

    //关闭按钮点击
    public closeClickFunc() {
        // console.error("回单人大厅");
        //回到单人大厅场景
        UIOpenOrHideManager.Instance.OpenSteerView();
        GamePlayMgr.RunGame(GamePlayType.singleHall);
        WebsocketTool.Instance.GameManager_outGame();
        //关闭面板
        ScoreboardManager.Instance.closeBoard();
    }

    public buttonFun() {
        ConnectWalletTonkeeper.Instance.send()
            .then((res) => {
                console.error("res", res);
                if (res) {
                    //关闭面板
                    GamePlayMgr.RunGame(GamePlayType.singleHall);
                    WebsocketTool.Instance.GameManager_outGame();
                    ScoreboardManager.Instance.closeBoard();
                    setTimeout(() => {
                        WebsocketTool.Instance.TicketManager_getTicketWithOutWallet(1, PlayGameType.GreatChampionship);
                        WebsocketTool.Instance.TicketManager_useTickToGameRoom(PlayGameType.GreatChampionship);
                    }, 100);
                }
            })
    }


    public async onShowFunc() {
        //禁用摇杆和触摸
        EventMgr.dispatchEvent("rocker_View_TouchEnable", new EventGeneric(false));
        //隐藏玩家头顶名称
        UiDataManager.changeFunctionData(BindKeyName.setTopBarVisible, false);

        this.isWin = ScoreboardManager.Instance.isWin;
        //排名
        let rank = ScoreboardManager.Instance.rank;
        if (this.isWin) {
            let score = Math.max(1, 4 - rank);
            Over3dModelMgr["tryInit"]();
            //胜利
            this.title_lab_text("VICTORY");
            this.rank_lab_text("CONGRATULATIONS");
            this.point_lab_text("");

            // await this.showJinbiEffect();
            // await this.showYanhuaEffect();
            this.bg00_img.transform.visible = true;
        } else {
            //失败
            this.bg00_img.transform.visible = true;
            this.title_lab_text("DEFEAT");
            this.rank_lab_text("GAME OVER");
            this.point_lab_text("");
        }
    }

    //烟花特效
    public async showYanhuaEffect() {
        let v3Pos = new m4m.math.vector3(0, 0, 10);
        //UI 上显示特效
        this.yanhuaEff = await EffectMgr.setPlay("fx_ui_yanhua" as any, v3Pos, 3);
        //设置layer ，跳转到第二个相机去渲染
        EffectMgr.effectLayerChange(this.yanhuaEff, GameLogic.layerIndexOverUI3d);
    }

    //金币特效
    public async showJinbiEffect() {
        let v3Pos = new m4m.math.vector3(0, 10, 10);
        //UI 上显示特效
        this.jinbiEff = await EffectMgr.setPlay("fx_ui_jinbi" as any, v3Pos, 4, null, null, null, true);
        EffectMgr.effectLayerChange(this.jinbiEff, GameLogic.layerIndexOverUI3d);
    }

    public clearAllEffect() {
        if (this.jinbiEff != null) {
            //清理改回 默认层级
            EffectMgr.effectLayerChange(this.jinbiEff, GameLogic.layerIndexDefault);
            EffectMgr.setStop(this.jinbiEff);
        }
        if (this.yanhuaEff != null) {
            //清理改回 默认层级
            EffectMgr.effectLayerChange(this.yanhuaEff, GameLogic.layerIndexDefault);
            EffectMgr.setStop(this.yanhuaEff);
        }
    }

    public onDisposeFunc() {

    }

    public onHideFunc() {
        EventMgr.dispatchEvent("rocker_View_TouchEnable", new EventGeneric(true));
        //显示玩家头顶名称
        UiDataManager.changeFunctionData(BindKeyName.setTopBarVisible, true);
        this.clearAllEffect();
    }

}