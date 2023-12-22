
import { uiLayerType } from "PSDUI/UiManager";
import { commTool } from "Tools/commTool";
import { loading } from "./loading";
/**加载界面*/
export class loadingView extends loading {
    public static Instance: loadingView;
    /**其他面板show 时 不隐藏 */
    public notHideOnOtherShow: boolean = true;
    /**打开时不影响其他uiPage */
    public noAffected: boolean = true;
    public uiLayer: uiLayerType = uiLayerType.poplayer;
    public onInit() {
        super.onInit();
        //屏蔽UI事件
        commTool.makeUIEventDiscard(this.gamebg_img.transform);
        //多语言版本
        this.onShow = this.onShowFun.bind(this);
        this.onHide = this.onHideFun.bind(this);
        this.onDispose = this.onDisposeFun.bind(this);
    }
    private onShowFun() {
        console.error("显示loading界面");
    }
    private onHideFun() {
    }
    private onDisposeFun() {

    }
}