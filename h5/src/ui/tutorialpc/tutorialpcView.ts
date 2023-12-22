
import { UIOpenOrHideManager } from "Manager/UIOpenOrHideManager";
import { commTool } from "Tools/commTool";
import { tutorialpc } from "./tutorialpc";
/*PC引导界面*/
export class tutorialpcView extends tutorialpc {
    public static Instance: tutorialpcView;
    // private ViewData: tloadingViewData;
    /** 当前UI是否会影响场景玩家操作 */
    public influenceSceneAction: boolean = true;
    public onInit() {
        super.onInit();
        // //打开当前界面不影响其他界面 TipPanel
        // this.noAffected = true;
        //屏蔽UI事件
        commTool.makeUIEventDiscard(this.gamebg1_img.transform);
        // this.ViewData = new tloadingViewData();
        //多语言版本
        this.onShow = this.onShowFun.bind(this);
        this.onHide = this.onHideFun.bind(this);
        this.onDispose = this.onDisposeFun.bind(this);
        this.close_btn_btnEvent = this.closeBtnFun.bind(this);
        this.title1_lab_text("CONTROL TUTORIAL");
        this.title1_lab.label.fontsize += 20;
        this.close1_lab_text("CLOSE");
        this.close_btn.close1_lab.label.fontsize += 5;
        this.close_btn.close1_lab.label.color2 = new m4m.math.color(1, 0.25, 0.40);
        this.direction_lab_text("MOVE");
        this.textbg.direction_lab.label.fontsize += 5;
        this.mouse_lab_text("ROTATE CAMERA");
        this.textbg.mouse_lab.label.fontsize += 5;
        this.shift_lab_text("SPEED UP");
        this.textbg.shift_lab.label.fontsize += 5;
        this.space_lab_text("JUMP");
        this.textbg.space_lab.label.fontsize += 5;
        //this.close_btn.button.addListener(m4m.event.UIEventEnum.PointerDown, this.closeBtnFun, this);
    }
    private closeBtnFun() {
        UIOpenOrHideManager.Instance.HideTutorialpcView();
        // UIOpenOrHideManager.Instance.OpenHallView();
        UIOpenOrHideManager.Instance.OpenRockerView();
    }
    private onShowFun() {
    }
    private onHideFun() {
    }
    private onDisposeFun() {
    }
}