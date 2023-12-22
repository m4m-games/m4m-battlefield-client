import { CellData } from "Data/CellData";
import { Grid } from "Data/Grid";
import { GridData } from "Data/GridData";
import { PlayGameType } from "gamePlays/PlayGameType";
import { UIOpenOrHideManager } from "Manager/UIOpenOrHideManager";
import { TipPanelType, UITipManager } from "Manager/UITipManager";
import { WebsocketTool } from "Net/WebsocketTool";
import { uiLayerType } from "PSDUI/UiManager";
import { CTimer } from "Time/CTimer";
import { commTool } from "Tools/commTool";
import { FrameMgr } from "Tools/FrameMgr";
import { PlatformUtil } from "Tools/PlatformUtil";
import { imgSpriteArrange } from "UIBase/imgSpriteArrange";
import { tips } from "./tips";

export class tipsView extends tips {
    public static Instance: tipsView;
    public uiLayer = uiLayerType.highlayer;
    public startTimeID: number = -1;
    public time: any;
    public leftTime: any;
    // private ViewData: tloadingViewData;
    public onInit() {
        super.onInit();
        // //打开当前界面不影响其他界面 TipPanel
        this.noAffected = true;
        //屏蔽UI事件
        commTool.makeUIEventDiscard(this.heroallbg_btn.transform);
        // this.ViewData = new tloadingViewData();
        //多语言版本
        this.heroallbg_btn_btnEvent = this.heroallbg.bind(this);
        //this.heroallbg_btn.button.addListener(m4m.event.UIEventEnum.PointerDown, this.heroallbg, this);
        // this.gamebg2_img.text1_lab.label.horizontalOverflow = false;
        // this.gamebg2_img.text1_lab.label.verticalOverflow = true;//说明支持换行
        // this.gamebg2_img.text1_lab.label.verticalType = m4m.framework.VerticalType.Top;
        // this.gamebg2_img.text1_lab.label.linespace = 1.2;
        this.onShow = this.onShowFun.bind(this);
        this.onHide = this.onHideFun.bind(this);
        this.onDispose = this.onDisposeFun.bind(this);
    }
    //设置tips 文本
    private setTipsText() {
        //粉色弹窗可以关闭
        if (UITipManager.Instance.type == null) {
            this.gamebg2_img.transform.visible = false;
            this.gamebg1_img.transform.visible = true;
            this.gamebg1_img.text2_lab.label.text = UITipManager.Instance.tipPanelText;
        } else {
            switch (UITipManager.Instance.type) {
                //黑色弹窗可以关闭
                case TipPanelType.rest:
                    this.gamebg2_img.transform.visible = true;
                    this.gamebg1_img.transform.visible = false;
                    this.gamebg2_img.text1_lab.label.text = UITipManager.Instance.tipPanelText;
                    break;
                //黑色弹窗不可以关闭
                case TipPanelType.mistake:
                    this.gamebg2_img.transform.visible = true;
                    this.gamebg1_img.transform.visible = false;
                    if (UITipManager.Instance.tipsData == 1) {
                        this.RefreshResetTime(5);
                        UITipManager.Instance.tipsData = null;
                    } else {
                        this.gamebg2_img.text1_lab.label.text = UITipManager.Instance.tipPanelText;
                    }
                    break;
            }
        }
    }

    private heroallbg() {
        console.error("关闭tips");
        if (UITipManager.Instance.type == null) {
            UIOpenOrHideManager.Instance.HideTipsTCView();
        } else {
            switch (UITipManager.Instance.type) {
                case TipPanelType.rest:
                    UIOpenOrHideManager.Instance.HideTipsTCView();
                    break;
                case TipPanelType.mistake:
                    break;
            }
        }
    }

    private onShowFun() {
        // this.gamebg1_img.text2_lab.label.fontsize = 16;
        this.setTipsText();
    }
    private onHideFun() {
        UITipManager.Instance.type = null;
        this.StopTime();
    }
    private onDisposeFun() {
    }

    //重置
    public RefreshResetTime(leftTime: number) {
        if (leftTime != null) {
            this.leftTime = leftTime;
            this.starCDTime();
        }
    }

    //定时器
    public starCDTime() {
        this.StopTime();
        this.startTimeID = CTimer.Instance.loopTimeUpdate(1000, this.cdUpdateFun.bind(this));
        this.Act_Settime();
    }
    //停掉定时器
    public StopTime() {
        if (this.startTimeID != -1) {
            CTimer.Instance.stop(this.startTimeID);
        }
    }
    //定时器回调
    public cdUpdateFun() {
        if (--this.leftTime > 0) {
            // tslint:disable-next-line: no-parameter-reassignment
            this.Act_Settime();
        } else {
            this.StopTime();
            location.reload();
        }
    }
    //显示
    public Act_Settime() {
        this.gamebg2_img.text1_lab.label.text = UITipManager.Instance.tipPanelText + "\t" + `${"(" + this.leftTime + ")"}`;
    }
}