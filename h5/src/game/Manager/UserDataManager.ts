import { UiDataManager } from "PSDUI/UiDataManager";
import { UiManager } from "PSDUI/UiManager";
import { CDManage } from "Time/CDManage";
import { StageMgr } from "../Core/StageMgr";
import { BindKeyName } from "../Data/BindKeyName";
import { TicketType } from "../GameEnum";
import { GameMgr } from "../GameMgr";
import { UserVarBaseEvent } from "../Net/DataEvents/UserVarBaseEvent";
import { WsDataManager } from "../Net/WsDataManager";
import { UiNames } from "./UIData/UiNames";

//玩家账号数据
export class UserDataManager {
    public static get Instance(): UserDataManager {
        if (this._instance == null) {
            this._instance = new UserDataManager();
        }
        return this._instance;
    }
    public moveSpeed: number = 0;//走的速度
    public runSpeed: number = 0;//跑的速度
    public backpack: any[] = [];
    private static _instance: UserDataManager;
    private ticketData: { [key: number]: number } = {};//玩家拥有的门票 数量 TicketType

    //根据类型获取门票数量
    public getTicketNum(type: TicketType): number {
        let num = this.ticketData[type];
        return num == undefined ? 0 : num;
    }

    //根据类型设置门票数量
    public setTicketNum(type: TicketType, num: number): void {
        if (this.ticketData[type] == null) {
            this.ticketData[type] = num;
        } else {
            for (let key in this.ticketData) {
                if (key == type.toString()) {
                    this.ticketData[type] = this.ticketData[type] + num;
                }
            }
        }
        // console.error("根据类型设置门票数量");
    }

    //初始化
    public init() {
        // console.error(WsDataManager.UserVarBaseData);
        WsDataManager.UserVarBaseData.addEventListener(UserVarBaseEvent.Init, this.userInfoFun.bind(this));
        WsDataManager.UserVarBaseData.addEventListener(UserVarBaseEvent.items, this.upDateItems.bind(this));
        WsDataManager.UserVarBaseData.addEventListener(UserVarBaseEvent.mailItem, this.UpdataMali.bind(this));
    }

    private userInfoFun(data: any) {
        // console.error("玩家name",data.playerName);
        StageMgr.playername = data.playerName;
        let roleStatus = JSON.parse(WsDataManager.UserVarBaseData.roleStatus);
        let items = JSON.parse(WsDataManager.UserVarBaseData.items);
        console.error("玩家数据更新", WsDataManager.UserVarBaseData.roleStatus);
        let itemCount = 0;
        let itemData: any;
        this.ticketData = {};
        for (const key in items) {
            if (key) {
                itemData = items[key];
                if (itemData) {
                    this.setTicketNum(itemData.baseId, itemData.count);
                    this.backpack.push(itemData);
                }
            }
        }
        // this.ticketNum = itemCount;
        // console.error("玩家当前拥有的门票数", this.ticketNum);
        if (roleStatus.ms) {
            this.moveSpeed = roleStatus.ms;//走的速度
        } else {
            console.error("服务器返回走的速度出错！");
        }
        if (roleStatus.rs) {
            this.runSpeed = roleStatus.rs;//跑的速度
        } else {
            console.error("服务器返回跑的速度出错！");
        }
        // this.moveSpeed = 2;//为了效果暂时设置

        let serverTime = WsDataManager.UserVarBaseData.loginTime;
        CDManage.Instance.setServerTime(serverTime);
        //登录成功返回
        // UIOpenOrHideManager.Instance.HideTestView();
        // UIOpenOrHideManager.Instance.HideConnectWalletView();
        //
        StageMgr.onLoginServerSuccess();
        setTimeout(() => {
            UiDataManager.changeFunctionData(BindKeyName.LoginSucceeded, true);
        }, 500)
    }
    //有道具更新
    private upDateItems(data) {
        if (GameMgr.openWalletBol) {
            let items = JSON.parse(WsDataManager.UserVarBaseData.items);
            let itemData: any;
            this.ticketData = {};
            for (const key in items) {
                if (key) {
                    itemData = items[key];
                    if (itemData) {
                        this.setTicketNum(itemData.baseId, itemData.count);
                        this.backpack.push(itemData);
                    }
                }
            }
            // if (keys.length > 0) {
            //     let item = data[keys[0]];
            //     this.setTicketNum(item.baseId, item.count);
            // }
        } else {
            let items = JSON.parse(WsDataManager.UserVarBaseData.items);
            // console.log(items);
            let itemData: any;
            this.ticketData = {};
            for (const key in items) {
                if (key) {
                    itemData = items[key];
                    if (itemData) {
                        this.setTicketNum(itemData.baseId, itemData.count);
                        this.backpack.push(itemData);
                    }
                }
            }
        }
        // console.error("有道具更新 ", data);
        // console.error("买票弹窗状态  ",UiManager.isUiShow(UiNames.buyticketWindow),"前往游戏大厅  ",StageMgr.gotoPlayGameBol);
        // if (UiManager.isUiShow(UiNames.buyticketWindow) && !StageMgr.gotoPlayGameBol) {
        //     UiDataManager.changeFunctionData(BindKeyName.buyTicketSuccessToGame, { gameType: StageMgr.levelType });
        // }
    }
    private UpdataMali() {
        if (GameMgr.openWalletBol) {
            let maitems = JSON.parse(WsDataManager.UserVarBaseData.mailItem);
            console.error("钱包邮件道具更新", maitems);
            UiDataManager.changeFunctionData(BindKeyName.mail, null);
        } else {
            let maitems = JSON.parse(WsDataManager.UserVarBaseData.mailItem);
            console.error("邮件道具", maitems);
            UiDataManager.changeFunctionData(BindKeyName.mail, null);
        }
    }
    // tslint:disable-next-line: member-ordering
    public dispose() {
        this.backpack.length = 0;
    }
}