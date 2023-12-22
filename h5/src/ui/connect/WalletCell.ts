import { CommonCell } from "Common/CommonCell";
import { CommonUIUtils } from "Data/CommonUIUtils";
import { commTool } from "Tools/commTool";
import { imgSpriteArrange } from "UIBase/imgSpriteArrange";
import { button1_img } from "./connect";
import { connectView } from "./connectView";

@gd3d.reflect.node2DComponent
export class WalletCell extends CommonCell {
    private nowClass: button1_img;
    private awardNum: imgSpriteArrange;
    public setCellClass(value: any) {
        this.nowClass = value;
        // this.awardNum = commTool.makeImgSpriteArrange(this.nowClass.paiming_img.image);
        // this.awardNum.transform.layoutState = gd3d.framework.layoutOption.LEFT | gd3d.framework.layoutOption.V_CENTER;
        // this.awardNum.transform.setLayoutValue(gd3d.framework.layoutOption.LEFT, 550);
        // this.nowClass.paiming_img.transform.visible = false;

    }
    //选中当前cell 时的fun
    public selectFun(selectbool: boolean) {
        super.selectFun(selectbool);
        // this.nowClass.status2_img.transform.visible = selectbool;
    }
    public setData(value: any): void {
        this.cellData.data = value;
        console.error("wallet数据", value);

        if (value) {
            let iconStr = "";
            switch (value) {
                case 1:
                    iconStr = connectView.Instance.uiName + `.atlas.json_iconmetamask`;
                    break;
                case 2:
                    iconStr = connectView.Instance.uiName + `.atlas.json_icontrustwallet`;
                    break;
                case 3:
                    iconStr = connectView.Instance.uiName + `.atlas.json_iconmathwallet`;
                    break;
                case 4:
                    iconStr = connectView.Instance.uiName + `.atlas.json_icontokenpocket`;
                    break;
                case 5:
                    iconStr = connectView.Instance.uiName + `.atlas.json_iconwalletconnect`;
                    break;
                case 6:
                    iconStr = connectView.Instance.uiName + `.atlas.json_iconbinancechainwallet`;
                    break;
                case 7:
                    iconStr = connectView.Instance.uiName + `.atlas.json_iconontowallet`;
                    break;
                case 8:
                    iconStr = connectView.Instance.uiName + `.atlas.json_iconcloverwallet`;
                    break;
            }
            this.nowClass.icon_img.image.sprite = CommonUIUtils.getSprite(iconStr);
            this.nowClass.transform.visible = true;
        } else {
            this.nowClass.transform.visible = false;
        }
    }
}
