import { EventMgr } from "eventMgr";
import { StageMgr } from "../Core/StageMgr";
import { ResultBaseEvent } from "../Net/DataEvents/ResultBaseEvent";
import { WsDataManager } from "../Net/WsDataManager";
import { ScoreboardManager } from "./ScoreboardManager";

//游戏结算统一调用
export class GameResultManager {
    public static get Instance(): GameResultManager {
        if (this._instance == null) {
            this._instance = new GameResultManager();
        }
        return this._instance;
    }
    private static _instance: GameResultManager;
    //初始化
    public init() {
        //结算
        WsDataManager.ResultBaseData.addEventListener(ResultBaseEvent.Init, this.resultDataFun.bind(this));
    }

    //显示胜利结算面板
    public showResultPanle(lose: boolean, timeOut: number) {
        if (lose == true) {
            //如果自己在失败列表中
            ScoreboardManager.Instance.showLostBoard();
        } else {
            let winers = JSON.parse(WsDataManager.ResultBaseData.winers);
            let myToken = StageMgr.PlayerGUID;
            let myRank = 0;
            for (let key in winers) {
                let player = winers[key];
                if (player.token == myToken) {
                    myRank = Number(key);
                }
            }

            setTimeout(() => {
                //弹出胜利面板
                ScoreboardManager.Instance.rank = myRank;
                ScoreboardManager.Instance.showWinBoard();
            }, timeOut);
        }
    }

    //结算
    private resultDataFun() {
        console.error("服务器消息:  结算:", WsDataManager.ResultBaseData);
        EventMgr.dispatchEvent("game_result", {
            data: {
                resultData: WsDataManager.ResultBaseData,
            },
        });
    }
}