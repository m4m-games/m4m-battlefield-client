import { IDispose } from "Tools/engineParallel/spInterface";
import { StageMgr } from "../Core/StageMgr";
import { InGameStatus, PlayerClientState, PlayerStatus } from "../GameEnum";
import { GamePlayMgr } from "../gamePlays/GamePlayMgr";
import { GameDiePerformanceEnum, RoleAttrInfo, RoleTypeEnum } from "./RoleAttrInfo";

/**
 * 角色的数据类
 */
export class RoleData implements IDispose {
    //是否可移动
    public get canMove() {
        return ((this.roleState == PlayerStatus.inGame ||
            this.roleState == PlayerStatus.inRoom ||
            this.roleState == PlayerStatus.inReady ||
            this.inGameState == InGameStatus.inGameWin ||
            this.inGameState == InGameStatus.inGame)
            || this.isSingle) && this.roleClientState == PlayerClientState.canMove;
        // return this.roleClientState == PlayerClientState.canMove;
    }
    public get roleState(): PlayerStatus {
        return this._roleState;
    }
    public set roleState(val) {
        this._roleState = val;
        //服务器通知游戏进行中 设置清掉准备状态
        if (this._roleState == PlayerStatus.inGame) {
            //暂时这样写 后续优化
            GamePlayMgr.gameReadyState = false;
        }
    }
    public name: string; // 展示名字 (编号)
    public guid: string;
    // public roleID = 0;
    public maxLifeNum = 1;
    //当前血量
    public CurHp = 0;
    //最大血量
    public MaxHp = 0;
    public topUIVisible = false;
    //默认直接播死亡
    public defDiePerformance: GameDiePerformanceEnum = GameDiePerformanceEnum.Die;
    public roleType: RoleTypeEnum;
    //初始位置信息
    public pos: m4m.math.vector3;
    //旋转角度
    public angle: number = 0;
    //单机状态 不同步信息
    public isSingle: boolean = false;

    //死亡时间
    public dieTime: number = 0;
    //玩家状态 (客户端)
    public roleClientState: PlayerClientState;
    //玩家游戏中状态(服务器)
    public inGameState: InGameStatus;
    //玩家状态(服务器)
    private _roleState: PlayerStatus;
    //setData
    public setData(roleInfo: RoleAttrInfo) {
        this.pos = roleInfo.pos;
        this.angle = roleInfo.angle;
        this.isSingle = roleInfo.isSingle;
        this.roleState = roleInfo.roleState;
        if (roleInfo.defDiePerformance != null) {
            this.defDiePerformance = roleInfo.defDiePerformance;
        }
        if (roleInfo.isInit)//如果是初始化
        {
            //
        }
    }
    //如果是主玩家
    public isMainPlayer() {
        return this.guid == StageMgr.PlayerGUID;
    }
    public getRoleID() {
        let roleId: number;
        // tslint:disable-next-line: switch-default
        switch (this.roleType) {
            case RoleTypeEnum.Player:
                roleId = 10004;
                break;
            case RoleTypeEnum.NPC:
                roleId = 10002;
        }
        return roleId;
    }

    public getHpNormal() {
        if (this.MaxHp == 0) {
            return 0;
        }
        return this.CurHp / this.MaxHp;
    }

    public dispose() {
        this.name = null;
    }
}
