import { StageMgr } from "Core/StageMgr";
import { BindKeyName } from "Data/BindKeyName";
import { PlayGameType } from "gamePlays/PlayGameType";
import { UIOpenOrHideManager } from "Manager/UIOpenOrHideManager";
import { WebsocketTool } from "Net/WebsocketTool";
import { UiDataManager } from "PSDUI/UiDataManager";
import { uiLayerType } from "PSDUI/UiManager";
import { PlatformType, PlatformUtil } from "Tools/PlatformUtil";
import { Steer } from "./Steer";
import { ConnectWalletTonkeeper } from "Core/blockchain/ConnectWalletTonkeeper";
import { TipPanelType, UITipManager } from "Manager/UITipManager";

export class SteerView extends Steer.Steer {
    /**其他面板show 时 不隐藏 */
    public notHideOnOtherShow: boolean = true;
    public uiLayer = uiLayerType.highlayer;
    public LoginSucceeded: Function;
    public onInit() {
        super.onInit();
        this.onShow = this.onShowFunc.bind(this);
        this.onHide = this.onHideFunc.bind(this);
        this.onDispose = this.onDisposeFunc.bind(this);
        this.titlebg_btn_btnEvent = this.titleBtnfun.bind(this)
        this.title2_lab_text("CONTROL TUTORIAL");
        this.title1_lab_text("");
        this.LoginSucceeded = this.LoginSucceededFun.bind(this);
        UiDataManager.bindFunctionData(BindKeyName.LoginSucceeded, this.LoginSucceeded);
    }

    private onShowFunc() {
        this.LoginSucceededFun();
        if (PlatformUtil.getTypeByBrowser() == PlatformType.PC) {
            this.gamingbg.titlebg1_img.steer1_img.transform.visible = true;
            this.gamingbg.titlebg1_img.steer_img.transform.visible = false;
        } else {
            this.gamingbg.titlebg1_img.steer1_img.transform.visible = false;
            this.gamingbg.titlebg1_img.steer_img.transform.visible = true;
        }
    }

    private onDisposeFunc() {
        UiDataManager.unBindFunctionData(BindKeyName.LoginSucceeded, this.LoginSucceeded)
    }

    private onHideFunc() {

    }

    public titleBtnfun() {
        if (!StageMgr.PlayerGUID) {
            ConnectWalletTonkeeper.Instance.loginAccount((res) => {
                let address = res;
                console.error(res);
                WebsocketTool.Instance.LoginManager_loginWithOutWallet(address, "123", ConnectWalletTonkeeper.Instance.tid);
            });
            // ConnectWalletManager.Instance.loginToken((res) => {
            //     let address = res;
            //     console.error(res);
            //     WebsocketTool.Instance.LoginManager_loginWithOutWallet(address, "123");
            // });
        } else {
            ConnectWalletTonkeeper.Instance.send()
                .then((res) => {
                    console.error("res", res);
                    if (res) {
                        WebsocketTool.Instance.TicketManager_getTicketWithOutWallet(1, PlayGameType.GreatChampionship);
                        WebsocketTool.Instance.TicketManager_useTickToGameRoom(PlayGameType.GreatChampionship);
                        UIOpenOrHideManager.Instance.HideSteerView();
                    } else {
                        UITipManager.Instance.tipPanelText = "Cancelled";
                        UITipManager.Instance.type = TipPanelType.rest;
                        UIOpenOrHideManager.Instance.OpenTipsTCView();
                    }
                })
                .catch((res) => {
                    console.error("error", res);
                });
        }
    }

    public LoginSucceededFun() {
        if (!StageMgr.PlayerGUID) {
            this.title_lab_text("CONNET WALLET");
        } else {
            this.title_lab_text("START");
            this.title1_lab_text("This will charge you 0.001 TON.");
        }
    }
}