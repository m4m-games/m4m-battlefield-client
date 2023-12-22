
import { UIOpenOrHideManager } from "Manager/UIOpenOrHideManager";
import { commTool } from "Tools/commTool";
import { tutorialmb } from "./tutorialmb";
/*手机引导界面*/
export class tutorialmbView extends tutorialmb {
    public static Instance: tutorialmbView;
    /** 当前UI是否会影响场景玩家操作 */
    public influenceSceneAction: boolean = true;
    // private ViewData: tloadingViewData;
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
        this.close_btn.close1_lab.label.color2 = new m4m.math.color(1,0.25,0.40);
        this.walk3_lab_text("WALK");
        this.walkbg.walk3_lab.label.fontsize += 5;
        this.run3_lab_text("RUN");
        this.runbg.run3_lab.label.fontsize += 5;
        this.jump1_lab_text("JUMP");
        this.jumpbg.jump1_lab.label.fontsize += 5;
        //this.close_btn.button.addListener(m4m.event.UIEventEnum.PointerDown, this.closeBtnFun, this);
    }
    private closeBtnFun() {
        UIOpenOrHideManager.Instance.HideTutorialmbView();
        // UIOpenOrHideManager.Instance.OpenHallView();
    }
    private onShowFun() {
    }
    private onHideFun() {
    }
    private onDisposeFun() {
    }
}