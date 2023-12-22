import { UiTools } from "PSDUI/UiTools";
import { commTool } from "Tools/commTool";
import { statebg } from "./gaming";
import { TopBar } from "./TopBar";

type transform2D = m4m.framework.transform2D;
type image2D = m4m.framework.image2D;
type label = m4m.framework.label;

/** 头顶状态条 控制 */
export class TopBarCtr {
    public static get instance() {
        if (!this._instance) {
            this._instance = new TopBarCtr();
        }
        return this._instance;
    }
    private static _instance: TopBarCtr;
    private topRoot: transform2D;
    private templete: statebg;

    public init(templete: statebg) {
        this.templete = templete;
        this.topRoot = new m4m.framework.transform2D();
        this.topRoot.name = "TopRoot";
        let lp = m4m.framework.layoutOption;
        this.topRoot.layoutState = lp.TOP | lp.RIGHT | lp.BOTTOM | lp.LEFT;
    }

    public onShow(uiRoot: transform2D) {
        //this.topRoot = uiRoot;
        uiRoot.addChild(this.topRoot);
    }
    public onHide() {
        let p = this.topRoot.parent;
        if (p) {
            p.removeChild(this.topRoot);
        }
    }

    /** 获取 一个bar */
    public newBar(): TopBar {
        let t = UiTools.cloneUi(this.templete);
        let result = new TopBar(t);
        result.setRoot(this.topRoot);
        return result;
    }
}