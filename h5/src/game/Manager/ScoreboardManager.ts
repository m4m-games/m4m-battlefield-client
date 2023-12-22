import { UiManager } from "PSDUI/UiManager";
import { RoleMgr } from "../Role/RoleMgr";
import { UiNames } from "./UIData/UiNames";
import { UIOpenOrHideManager } from "./UIOpenOrHideManager";

export class ScoreboardManager {

    //面板是否打开
    public isOpen: boolean = false;

    //是否胜利
    public isWin: boolean = true;
    //你的排名
    public rank: number = 0;
    //分数
    // public score: number = 0;

    public static get Instance(): ScoreboardManager {
        if (this._instance == null) {
            this._instance = new ScoreboardManager();
        }
        return this._instance;
    }
    private static _instance: ScoreboardManager;

    /**
     * 显示胜利面板
     */
    public showWinBoard() {
        this.isWin = true;
        if (!UiManager.isUiShow(UiNames.countdown)) {
            UIOpenOrHideManager.Instance.OpenCountdownView();
        }
        this.isOpen = true;
    }

    /**
     * 显示失败面板
     */
    public showLostBoard() {
        this.isWin = false;
        UIOpenOrHideManager.Instance.OpenCountdownView();
        this.isOpen = true;
    }

    /**
     * 关闭失败/胜利面板
     */
    public closeBoard() {
        UIOpenOrHideManager.Instance.HideCountdownView();
        this.isOpen = false;
    }
}