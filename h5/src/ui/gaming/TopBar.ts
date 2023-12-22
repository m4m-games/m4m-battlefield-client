import { IDispose } from "Tools/engineParallel/spInterface";
import { statebg } from "./gaming";

export class TopBar implements IDispose {

    public bar: statebg;
    public barTrans: m4m.framework.transform2D;
    public barMaxWidth: number = 100;

    public constructor(bar: statebg) {
        this.bar = bar;
        this.barTrans = bar.transform;

        bar.blood5_bar.transform.visible = false;

        bar.blood1_img.transform.visible = true;
        bar.blood1_img.transform.height = 8;
        bar.blood1_img.transform.width = this.barMaxWidth;
        bar.blood1_img.transform.layoutState = m4m.framework.layoutOption.LEFT | m4m.framework.layoutOption.TOP;
        bar.blood1_img.transform.setLayoutValue(m4m.framework.layoutOption.LEFT, -bar.blood1_img.transform.width/2);
        bar.blood1_img.transform.setLayoutValue(m4m.framework.layoutOption.TOP, 10);
        bar.blood1_img.transform.markDirty();
        bar.blood2_img.transform.visible = true;
        bar.blood2_img.transform.height = 8;
        bar.blood2_img.transform.width = this.barMaxWidth;
        bar.blood2_img.transform.layoutState = m4m.framework.layoutOption.LEFT | m4m.framework.layoutOption.TOP;
        bar.blood2_img.transform.setLayoutValue(m4m.framework.layoutOption.LEFT, -bar.blood1_img.transform.width/2);
        bar.blood2_img.transform.setLayoutValue(m4m.framework.layoutOption.TOP, 10);
        bar.blood2_img.transform.markDirty();
    }
    private topRoot: m4m.framework.transform2D;
    /** 设置根节点 */
    public setRoot(topRoot: m4m.framework.transform2D) {
        this.topRoot = topRoot;
        topRoot.addChild(this.barTrans);
    }
    /** 设置坐标 */
    public setPos(pos: m4m.math.vector2) {
        m4m.math.vec2Clone(pos, this.barTrans.localTranslate);
        this.barTrans.markDirty();
    }
    /** 设置是否显示 */
    public setVisible(v: boolean) {
        this.barTrans.visible = v;
    }
    /** 设置名称 */
    public setPlayerName(str: string) {
        this.bar.name_lab.label.text = str;
    }
    /**
     * 设置 HP 进度条
     * @param normal 单位进度百分比值 （0 - 1）
     */
    public setHP(normal: number) {
        this.bar.blood1_img.transform.width = this.barMaxWidth * normal;
    }
    public dispose() {
        if (this.topRoot) {
            this.topRoot.removeChild(this.barTrans);
            this.barTrans.dispose();
        }
    }
}