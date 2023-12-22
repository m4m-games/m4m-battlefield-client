
import { UiNames } from "Manager/UIData/UiNames";
import { UIOpenOrHideManager } from "Manager/UIOpenOrHideManager";
import { TipPanelType, UITipManager } from "Manager/UITipManager";
import { uiLayerType, UiManager } from "PSDUI/UiManager";
import { FrameMgr } from "Tools/FrameMgr";
import { imgSpriteArrange } from "UIBase/imgSpriteArrange";
import { tloading } from "./tloading";
import { tloadingViewData } from "./tloadingViewData";
/*标题加载界面*/
export class tloadingView extends tloading.tloading {
    public static Instance: tloadingView;
    private ViewData: tloadingViewData;
    private currentPro: number = 0;
    private proNumImg: imgSpriteArrange;
    public uiLayer = uiLayerType.highlayer;
    private timeCount = 0;
    private stopUpdateBol: boolean = false;
    public onInit() {
        super.onInit();
        // //打开当前界面不影响其他界面 TipPanel
        // this.noAffected = true;
        //屏蔽UI事件
        // commTool.makeUIEventDiscard(this.gamebg.transform);
        // this.proNumImg = commTool.makeImgSpriteArrange(this.number_img.image);
        // this.number_img.transform.visible = false;
        // this.loog_img.gamingbg.title_lab.label.text = "LOADING...";
        this.title1_lab_text("LOADING...");
        this.ViewData = new tloadingViewData();
        //多语言版本
        this.onShow = this.onShowFun.bind(this);
        this.onHide = this.onHideFun.bind(this);
        this.onDispose = this.onDisposeFun.bind(this);
        // this.loadbg_bar.progressbar.value =100;
    }
    private UpdateFun(del) {
        if (this.stopUpdateBol) return;
        this.timeCount += del;
        let rand = Math.round(Math.random() * 10);
        this.currentPro += rand;
        this.loog_img.loadbg_bar.progressbar.value = this.currentPro / 100;
        if (this.currentPro > 100) {
            this.currentPro = 100;
        }
        //let proStr = `${this.currentPro}b`;
        //this.proNumImg.setStr(proStr);
        if (this.timeCount >= 20) {
            UITipManager.Instance.tipPanelText = "Load timeout\nplease refresh the page and re-enter the game";
            UITipManager.Instance.type = TipPanelType.mistake;
            UIOpenOrHideManager.Instance.OpenTipsTCView()
            this.stopUpdateBol = true;
        }
    }

    private onShowFun() {
        this.stopUpdateBol = false;
        this.currentPro = 0;
        this.timeCount = 0;
        FrameMgr.Add(this.UpdateFun, this);
        if (UiManager.isUiShow(UiNames.wloading)) {
            UIOpenOrHideManager.Instance.HideWloadingView();
        }
    }
    private onHideFun() {
        FrameMgr.Remove(this.UpdateFun, this);
    }
    private onDisposeFun() {

    }
}