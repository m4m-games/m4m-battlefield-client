import { GamePlayType } from "../GameEnum";

/**
 * 游戏玩法
 */
export interface IGamePlay {
    /** 起始区域 */
    startArea(): m4m.math.vector3[];
    /** 终点区域 */
    endArea(): m4m.math.vector3[];
    /** 获取 玩法的类型 */
    getGameType(): GamePlayType;

    /** 开始运行游戏 */
    runGame();

    /** 退出当前游戏*/
    exitGame();
}