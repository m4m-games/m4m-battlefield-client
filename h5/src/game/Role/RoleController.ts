import { cMap } from "Data/Map";
import { newUiBase } from "PSDUI/newUiBase";
import { TimeUtil } from "Time/TimeUtil";
import { IDispose } from "Tools/engineParallel/spInterface";
import { gameMathUtil } from "Tools/gameMathUtil";
import { AudioEnum } from "../Audio/AudioEnum";
import { AudioPlayer } from "../Audio/AudioPlayer";
import { GamePlayType, RoleActInput } from "../GameEnum";
import { GamePlayMgr } from "../gamePlays/GamePlayMgr";
import { AttackState } from "./actStates/AttackState";
import { DieState } from "./actStates/DieState";
import { DropOutState } from "./actStates/DropOutState";
import { JumpState } from "./actStates/JumpState";
import { PickingStates } from "./actStates/PickingStates";
import { PreparePullState } from "./actStates/PreparePullState";
import { PulltheRopeState } from "./actStates/PulltheRopeState";
import { ReviveState } from "./actStates/ReviveState";
import { RightPreparePullState } from "./actStates/RightPreparePullState";
import { RightPullTheRopeState } from "./actStates/RightPullTheRopeState";
import { IRoleActState } from "./actStates/RoleActState";
import { RunState } from "./actStates/RunState";
import { StandState } from "./actStates/StandState";
import { StrikeToFlyState } from "./actStates/StrikeToFlyState";
import { TransferState } from "./actStates/TransferState";
import { WaitForDeathState } from "./actStates/WaitForDeathState";
import { WalkState } from "./actStates/WalkState";
import { Role } from "./Role";

/**
 * 角色控制器
 * 基于优先状态机 ，行走 ，跳跃 ，攻击 
 */
export class RoleController implements IDispose {

    /** 当前状态 */
    public get state() { return this._state; }
    public set state(val) { this._state = val; }
    constructor(role: Role) {
        this._role = role;
        this._state = this.getState(RoleActInput.Direction_Release);
    }

    private stateDic: cMap<IRoleActState> = new cMap();
    private _role: Role;
    private _state: IRoleActState;
    public dispose() {
        this._role = null;
        this.stateDic.clear();
    }

    /** 输入 */
    // tslint:disable-next-line: cyclomatic-complexity
    public handleInput(_input: RoleActInput, data?: any) {
        // let state = this.getState(_input);
        // if (state) {
        //     this.changeState(state);
        // }
        let canChangeState: boolean = this._state.canChange(_input, this._role);
        // let st = "";
        // // tslint:disable-next-line: switch-default
        // switch (_input) {
        //     case RoleActInput.Attack:
        //         st = "攻击";
        //         break;
        //     case RoleActInput.Jump:
        //         st = "跳";
        //         break;
        //     case RoleActInput.SpeedUp:
        //         st = "跑";
        //         break;
        //     case RoleActInput.DropOut:
        //         st = "掉落";
        //         break;
        //     case RoleActInput.Direction:
        //         st = "走";
        //         // tslint:disable-next-line: switch-final-break
        //         break;
        // }
        if (this._role.roleData.isMainPlayer()) {
            // console.log("当前状态", this._state.state, "是否需要切换状态", canChangeState, "切换的状态", _input);
        }
        //是否需要切换状态
        if (canChangeState) {
            if (this._role.roleData.isMainPlayer()) {
                // tslint:disable-next-line: switch-default
                switch (_input) {
                    case RoleActInput.Attack:
                    case RoleActInput.Jump:
                    case RoleActInput.SpeedUp:
                    case RoleActInput.Direction:
                        if (newUiBase.signArr.length > 0) {
                            // console.error("当前的UI列表会影响场景中的玩家操作 ", newUiBase.signArr);
                            return;
                        }
                        // tslint:disable-next-line: switch-final-break
                        break;
                }
                if (this._state.state == RoleActInput.Direction) {
                    if (GamePlayMgr.currGameType == GamePlayType.woodenPeople) {
                        AudioPlayer.stop(AudioEnum.WoodWalkSand);
                    } else {
                        AudioPlayer.stop(AudioEnum.WoodWalkNormal);
                    }
                } else if (this._state.state == RoleActInput.SpeedUp) {
                    if (GamePlayMgr.currGameType == GamePlayType.woodenPeople) {
                        AudioPlayer.stop(AudioEnum.WoodRunSand);
                    } else {
                        AudioPlayer.stop(AudioEnum.WoodRunNormal);
                    }
                } else if (this._state.state == RoleActInput.Attack) {
                    //停止攻击
                    this._role.isAttacking = false;
                }
            }

            // let state: IRoleActState;
            // // tslint:disable-next-line: switch-default
            // switch (_input) {
            //     case RoleActInput.Attack:
            //         state = AttackState.Instance;
            //         break;
            //     case RoleActInput.Jump:
            //         state = JumpState.Instance;
            //         break;
            //     case RoleActInput.Die:
            //         state = DieState.Instance;
            //         break;
            //     case RoleActInput.Revive:
            //         state = ReviveState.Instance;
            //         break;
            //     case RoleActInput.SpeedUp:
            //         state = RunState.Instance;
            //         break;
            //     case RoleActInput.Direction_Release:
            //         state = StandState.Instance;
            //         break;
            //     case RoleActInput.SpeedUp_Release:
            //         //是否 还有 移动输入
            //         let hasDirMove = false;
            //         if (this._role) {
            //             hasDirMove = gameMathUtil.vec2SqrLength(this._role.moveVelocity) >= 0;
            //         }
            //         if (hasDirMove) {
            //             state = WalkState.Instance;
            //         } else {
            //             state = StandState.Instance;
            //         }
            //         break;
            //     case RoleActInput.Direction:
            //     case RoleActInput.Walk:
            //         state = WalkState.Instance;
            //         // tslint:disable-next-line: switch-final-break
            //         break;
            // }
            let state: IRoleActState = this.getState(_input);
            if (state) {
                if (_input == RoleActInput.WaitForDeath) {
                    state.timeOut = this._state.timeOut;
                }
                this.changeState(state, data);
            } else {
                console.error("当前新增状态未设置！");
            }
        }
    }

    public update(dt: number) {
        if (!this._state) { return; }
        this._state.update(this._role, dt);
    }

    /** 切换状态 */
    private changeState(state: IRoleActState, data?: any) {
        this.state = state;
        this._state.enter(this._role, data);
    }

    /** 取对应状态返回 */
    // tslint:disable-next-line: cyclomatic-complexity
    private getState(stateType: RoleActInput) {
        let state: IRoleActState;
        if (this.stateDic.has(stateType)) {
            state = this.stateDic.get(stateType);
        } else {
            switch (stateType) {
                case RoleActInput.DropOut: //掉落
                    state = new DropOutState();
                    break;
                case RoleActInput.Attack:
                    state = new AttackState();
                    break;
                case RoleActInput.Jump:
                    state = new JumpState();
                    break;
                case RoleActInput.Die:
                    state = new DieState();
                    break;
                case RoleActInput.WaitForDeath:
                    state = new WaitForDeathState();
                    break;
                case RoleActInput.TransferState:
                    state = new TransferState();
                    break;
                case RoleActInput.Revive:
                    state = new ReviveState();
                    break;
                case RoleActInput.SpeedUp:
                    state = new RunState();
                    break;
                case RoleActInput.Direction_Release:
                    state = new StandState();
                    break;
                case RoleActInput.SpeedUp_Release:
                    //是否 还有 移动输入
                    let hasDirMove = false;
                    if (this._role) {
                        hasDirMove = gameMathUtil.vec2SqrLength(this._role.moveVelocity) >= 0;
                    }
                    if (hasDirMove) {
                        state = new WalkState();
                    } else {
                        state = new StandState();
                    }
                    break;
                case RoleActInput.Direction:
                case RoleActInput.Walk:
                    state = new WalkState();
                    break;
                case RoleActInput.PreparePull:
                    state = new PreparePullState();
                    break;
                case RoleActInput.PulltheRope:
                    state = new PulltheRopeState();
                    break;
                case RoleActInput.RightPreparePull:
                    state = new RightPreparePullState();
                    break;
                case RoleActInput.RightPulltheRope:
                    state = new RightPullTheRopeState();
                    break;
                case RoleActInput.Picking:
                    state = new PickingStates();
                    break;
                case RoleActInput.StrikeToFly:
                    state = new StrikeToFlyState();
                    break;
                default:
            }
            this.stateDic.set(stateType, state);
        }
        return state;
    }
}