import { GamesConfigBaseEvent } from "../Net/DataEvents/GamesConfigBaseEvent";
import { WsDataManager } from "../Net/WsDataManager";

//进游戏场景数据
export class EnterGameManager {
    public static get Instance(): EnterGameManager {
        if (this._instance == null) {
            this._instance = new EnterGameManager();
        }
        return this._instance;
    }
    private static _instance: EnterGameManager;

    //初始化
    public init() {
        WsDataManager.GamesConfigBaseData.addEventListener(GamesConfigBaseEvent.Init, this.loadGameSceneFun.bind(this));
    }

    private loadGameSceneFun() {
        console.error("进游戏场景", WsDataManager.GamesConfigBaseData);
    }
}