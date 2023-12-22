import { CommonCell } from "Common/CommonCell";
import { CommonUIUtils } from "Data/CommonUIUtils";
import { downlabbg } from "./gaming";
import { gamingView } from "./gamingView";

@m4m.reflect.node2DComponent
export class gamingrnCell extends CommonCell {
    private nowClass: downlabbg;
    public setCellClass(value: any) {
        this.nowClass = value;
        this.nowClass.downcup_img.transform.visible = false;
    }

    public onPlay() {

    }
    //选中当前cell 时的fun
    public selectFun(selectbool: boolean) {
        super.selectFun(selectbool);
    }
    public setData(value: any): void {
        this.cellData.data = value;
        if (value) {
            if (typeof value.num == "string") {
                if (value.index == 0) {
                    let iconType = gamingView.Instance.uiName + ".atlas.json_downcup1";
                    this.nowClass.downcup_img.image.sprite = CommonUIUtils.getSprite(iconType);
                    this.nowClass.downlab2_lab.label.text = "Player" + value.num;
                    this.nowClass.downlab3_lab.label.text = value.timeintegr.toString();
                    this.nowClass.downlab4_lab.label.text = "1ST:";
                    this.nowClass.downcup_img.transform.visible = true;
                } else if (value.index == 1) {
                    let iconType = gamingView.Instance.uiName + ".atlas.json_downcup2";
                    this.nowClass.downcup_img.image.sprite = CommonUIUtils.getSprite(iconType);
                    this.nowClass.downlab2_lab.label.text = "Player" + value.num;
                    this.nowClass.downlab3_lab.label.text = value.timeintegr.toString();
                    this.nowClass.downlab4_lab.label.text = "2ND:";
                    this.nowClass.downcup_img.transform.visible = true;
                } else if (value.index == 2) {
                    let iconType = gamingView.Instance.uiName + ".atlas.json_downcup3";
                    this.nowClass.downcup_img.image.sprite = CommonUIUtils.getSprite(iconType);
                    this.nowClass.downlab2_lab.label.text = "Player" + value.num;
                    this.nowClass.downlab3_lab.label.text = value.timeintegr.toString();
                    this.nowClass.downlab4_lab.label.text = "3RD:";
                    this.nowClass.downcup_img.transform.visible = true;
                } else if (value.count) {
                    this.nowClass.downlab4_lab.label.text = "";
                    this.nowClass.downlab2_lab.label.text = value.num;
                    this.nowClass.downlab3_lab.label.text = value.timeintegr.toString();
                }
            } else {
                if (value.index == 0) {
                    let iconType = gamingView.Instance.uiName + ".atlas.json_downcup1";
                    this.nowClass.downcup_img.image.sprite = CommonUIUtils.getSprite(iconType);
                    this.nowClass.downlab2_lab.label.text = "Player" + value.num;
                    this.nowClass.downlab3_lab.label.text = value.timeintegr.toString();
                    this.nowClass.downlab4_lab.label.text = "1ST:";
                    this.nowClass.downcup_img.transform.visible = true;
                } else if (value.index == 1) {
                    let iconType = gamingView.Instance.uiName + ".atlas.json_downcup2";
                    this.nowClass.downcup_img.image.sprite = CommonUIUtils.getSprite(iconType);
                    this.nowClass.downlab2_lab.label.text = "Player" + value.num;
                    this.nowClass.downlab3_lab.label.text = value.timeintegr.toString();
                    this.nowClass.downlab4_lab.label.text = "2ND:";
                    this.nowClass.downcup_img.transform.visible = true;
                } else if (value.index == 2) {
                    let iconType = gamingView.Instance.uiName + ".atlas.json_downcup3";
                    this.nowClass.downcup_img.image.sprite = CommonUIUtils.getSprite(iconType);
                    this.nowClass.downlab2_lab.label.text = "Player" + value.num;
                    this.nowClass.downlab3_lab.label.text = value.timeintegr.toString();
                    this.nowClass.downlab4_lab.label.text = "3RD:";
                    this.nowClass.downcup_img.transform.visible = true;
                } else if (value.count) {
                    this.nowClass.downlab4_lab.label.text = "";
                    this.nowClass.downlab2_lab.label.text = value.num.toString();
                    this.nowClass.downlab3_lab.label.text = value.timeintegr.toString();
                }
            }
            this.nowClass.transform.visible = true;
        } else {
            this.nowClass.transform.visible = false;
        }
    }
}