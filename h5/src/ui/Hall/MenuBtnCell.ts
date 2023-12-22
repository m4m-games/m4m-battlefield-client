import { CommonCell } from "Common/CommonCell";
import { UIOpenOrHideManager } from "Manager/UIOpenOrHideManager";
import { WebsocketTool } from "Net/WebsocketTool";
import { functionbtn1_img} from "./Hall";
import { HallView } from "./HallView";
import { ShopType } from "GameEnum";
// import { UIShopManager } from "Manager/UIShopManager";

@m4m.reflect.node2DComponent
export class MenuBtnCell extends CommonCell {
    public nowClass: functionbtn1_img;
    public setCellClass(value: any) {
        this.nowClass = value;
    }

    // 选中当前cell 时的fun
    public selectFun(selectbool: boolean) {
        super.selectFun(selectbool);
        if (selectbool) {
            switch (this.cellData.data.type) {
                case 1:  // 排行榜
                    this.rankAndAwardFun();
                    break;
                case 2: // 商店
                    this.shopFun();
                    break;
                case 3:  // 仓库
                    this.backpackFun();
                    break;
            }
        }
        // this.nowClass.selectbox_img.transform.visible = selectbool;
    }
    public setData(value: any): void {
        this.cellData.data = value;
        if (value) {
            this.nowClass.functionbtn_lab.label.fontsize = 20;
            this.nowClass.functionbtn_lab.label.text = value.namme.toString();
            this.nowClass.transform.visible = true;
        } else {
            this.nowClass.transform.visible = false;
        }

    }
    // 打开钱包
    private buyTicketFun() {
        console.error("打开了仓库");
        // UIOpenOrHideManager.Instance.OpenBuyTicketView();
        // UIOpenOrHideManager.Instance.HideHallView();
        // HallView.menu = true;
    }
    // 打开排行榜
    private rankAndAwardFun() {
        console.error("点击排名按钮");
        // UIOpenOrHideManager.Instance.OpenRankView();
        UIOpenOrHideManager.Instance.HideHallView();
        HallView.menu = true;
    }
    // 打开商店
    private shopFun() {
        UIOpenOrHideManager.Instance.HideHallView();
        // UIOpenOrHideManager.Instance.OpenShopView();
        HallView.menu = true;
    }
    private backpackFun(){
        UIOpenOrHideManager.Instance.HideHallView();
        // UIOpenOrHideManager.Instance.OpenBackpackView();
        HallView.menu = true;

    }
}