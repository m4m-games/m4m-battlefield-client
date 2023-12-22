import { GamePlayType } from "../GameEnum";
import { IGamePlay } from "./IGamePlay";
import { MeleeGame } from "./MeleeGame";
import { SingleHall } from "./SingleHall";

/**
 * 游戏玩法控制 管理器
 */
export class GamePlayMgr {
    /** 游戏结算状态 */
    public static gameSettlementState: boolean = false;
    /** 游戏开始准备状态 */
    public static gameReadyState: boolean = false;

    public static currGameType: GamePlayType = null;
    private static _cacheMap: { [gameType: number]: IGamePlay } = {};
    private static _curr: GamePlayType = null;
    private static tryGet(_type: GamePlayType) {
        return this._cacheMap[_type];
    }

    /** 当前 在的游戏 */
    public static get curr() { return this._curr; }

    public static get currGame() {
        return this.tryGet(this._curr);
    }

    /**
     * 开始 游戏
     * @param _type 
     */
    public static RunGame(_type: GamePlayType) {
        if (this._curr) {
            this.ExitGame();
        }
        let gpCtr = this.tryGet(_type);
        this._curr = _type;
        this.currGameType = _type;
        switch (_type) {
            // case GamePlayType.hall: gpCtr = new Hall(); break;
            case GamePlayType.singleHall: gpCtr = new SingleHall(); break;
            case GamePlayType.melee: gpCtr = new MeleeGame(); break;
            default:
        }

        //开始游戏的准备状态
        GamePlayMgr.gameReadyState = true;
        GamePlayMgr.gameSettlementState = false;
        gpCtr.runGame();
        this._cacheMap[_type] = gpCtr;
    }

    /**
     * 退出 当前游戏
     */
    public static ExitGame() {
        if (!this._curr) { return; }
        let gpCtr = this.tryGet(this._curr);
        delete this._cacheMap[this._curr];
        this._curr = null;
        if (!gpCtr) { return; }
        gpCtr.exitGame();
    }

}