import { BindKeyName } from "Data/BindKeyName";
import { ViewBaseData } from "Data/ViewBaseData";
import { ShopType } from "GameEnum";
import { WebsocketTool } from "Net/WebsocketTool";
import { UiDataManager } from "PSDUI/UiDataManager";
import { HallView } from "./HallView";

export class HallViewData implements ViewBaseData {
    private refreshTicketFunBind: any;
    public constructor() {
        this.refreshTicketFunBind = this.refreshTicketFun.bind(this);
        UiDataManager.bindFunctionData(BindKeyName.refreshTicket, this.refreshTicketFunBind);
    }
    public refreshTicketFun(data) {
        // console.error("刷新剩余门票数据", data);
        let totalNum = data.totalBoughtTicketNum;
        // let costNum = data.ticketCostNum;
        // let leftTicket = totalNum - costNum;
        // // console.error(leftTicket);
        HallView.Instance.ticketImgNum.setNum(totalNum);
    }
    public dispose() {
        UiDataManager.unBindFunctionData(BindKeyName.refreshTicket, this.refreshTicketFunBind);
    }
}