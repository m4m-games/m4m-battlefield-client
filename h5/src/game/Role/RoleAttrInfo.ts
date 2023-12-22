import { InGameStatus, PlayerMoveType, PlayerStatus } from "../GameEnum";

/**
 *当前游戏默认死亡表现
 */

export enum GameDiePerformanceEnum {
    Die,
    DropOutDie,
    Back,
}

/**
 *玩家类型
 */
export enum RoleTypeEnum {
    /** 玩家 */
    Player,
    NPC,
}

/**
 * RoleServerInfo
 */
export class RoleServerInfo {
    //玩家名字
    public name: string;
    public GUID: string;
    public pos: m4m.math.vector3;
    //服务器给的玩家账号状态
    public roleState: PlayerStatus;
    //玩家游戏中状态
    public inGameStatus: InGameStatus;
    //旋转
    public rot: number;

    //到目标点用的时间
    public moveTime: number;
    //移动类型  走  跑  跳 等
    public moveType: PlayerMoveType;
    //攻击类型
    public hitType: number;
    //剩余血量
    public hp: number;

    [key: string]: any;
}

/**
 * RoleAttrInfo
 */
export class RoleAttrInfo extends RoleServerInfo {
    //初始创建
    public isInit: boolean = false;
    public roleType: RoleTypeEnum;
    //角度信息
    public angle: number = 0;
    //单机状态
    public isSingle: boolean = false;
    public num: number = 0;
    //默认直接播死亡
    public defDiePerformance: GameDiePerformanceEnum = GameDiePerformanceEnum.Die;
}
