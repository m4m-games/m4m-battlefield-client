import { EventMgr } from "eventMgr";
import { UiDataManager } from "PSDUI/UiDataManager";
import { CDManage } from "Time/CDManage";
import { FrameMgr } from "Tools/FrameMgr";
import { BindKeyName } from "../Data/BindKeyName";
import { GameState } from "../GameEnum";
//游戏开始倒计时
export class GameStartCountdownManager {
    public static get Instance(): GameStartCountdownManager {
        if (this._instance == null) {
            this._instance = new GameStartCountdownManager();
        }
        return this._instance;
    }
    private static _instance: GameStartCountdownManager;
    private _startTime: number = 0;
    //倒计时结束时间
    private _countdownTime: number = 0;
    private _start: boolean = false;
    private gapTime = 1;//每1秒 轮一次
    private newDaTime: number = 0;
    private gameState: number = 0;
    private callback: Function;
    /**
     * 游戏开始倒计时 初始化
     * @param startTime 开始走倒计时 时间
     * @param countdownTime 倒计时毫秒数
     * @param callback 结束回调
     */
    public init(startTime: number, countdownTime: number, callback?: Function) {
        this._startTime = startTime;
        this._countdownTime = startTime + countdownTime;
        this.callback = callback;
        this.updateFun(0);
        FrameMgr.Add(this.updateFun, this);
    }

    public updateFun(dt: number) {
        let serverTime: number = CDManage.Instance.serverTime();
        if (this._start == false) {
            if (serverTime >= this._startTime) {
                this._start = true;
                let time = Math.round((this._countdownTime - serverTime) / 1000);
                this.gameState = GameState.ready;
                console.error("游戏开始倒计时***** ", time);
                //这里加时间改变 UI绑定方法
                UiDataManager.changeFunctionData(BindKeyName.startTimeCD, { gameState: this.gameState, time });
            }
        }

        if (this._start) {
            //需要开始
            this.newDaTime += dt;
            if (this.newDaTime >= this.gapTime) {
                this.newDaTime = 0;
                let time = Math.round((this._countdownTime - serverTime) / 1000);
                this.gameState = GameState.ready;
                console.error("游戏开始倒计时 ", time);
                //这里加时间改变 UI绑定方法
                // UiDataManager.changeFunctionData(BindKeyName.startTimeCD, { gameState: this.gameState, time });
                if (time <= 3) {
                    UiDataManager.changeFunctionData(BindKeyName.readyTimeCD, { gameState: this.gameState, time });
                } else {
                    UiDataManager.changeFunctionData(BindKeyName.startTimeCD, { gameState: this.gameState, time });
                }
                if (time <= 0) {
                    //开始游戏进行的倒计时
                    EventMgr.dispatchEvent("game_state", {
                        data: {
                            gameState: GameState.match,
                        },
                    });
                    // 时间到, 走回调
                    if (this.callback) {
                        this.callback();
                        this.callback = null;
                    }
                    this.stop();
                }
            }
        }
    }

    public stop() {
        if (this._start) {
            this._start = false;
            FrameMgr.Remove(this.updateFun, this);
            this.newDaTime = 0;
        }
    }
}