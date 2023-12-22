import { AudioEnum } from "../../Audio/AudioEnum";
import { AudioPlayer } from "../../Audio/AudioPlayer";
import { GamePlayType, RoleActInput, Weapons } from "../../GameEnum";
import { GamePlayMgr } from "../../gamePlays/GamePlayMgr";
import { Role } from "../Role";
import { IRoleActState } from "./RoleActState";

export class RunState implements IRoleActState {
    public timeOut: number = 0;
    public state: number = RoleActInput.SpeedUp;
    //跑 状态  可切换    站立  攻击  跳    走或站立
    private static stateArr: RoleActInput[] = [];
    constructor() {
        RunState.stateArr = [RoleActInput.Picking, RoleActInput.TransferState, RoleActInput.WaitForDeath, RoleActInput.Walk, RoleActInput.Direction_Release,
        RoleActInput.Attack, RoleActInput.Jump, RoleActInput.SpeedUp_Release, RoleActInput.Die, RoleActInput.DropOut, RoleActInput.PreparePull, RoleActInput.RightPreparePull,
        RoleActInput.RightPulltheRope, RoleActInput.StrikeToFly];
    }
    public enter(_role: Role) {
        if (!_role) { return; }
        if (_role.roleData.isMainPlayer()) {
            if (GamePlayMgr.currGameType == GamePlayType.woodenPeople) {
                AudioPlayer.play(AudioEnum.WoodRunSand);
            } else {
                AudioPlayer.play(AudioEnum.WoodRunNormal);
            }
        }
        if (_role.currWeapons == Weapons.bat) {
            _role.roleDoll.playAnim("SwordRun");
        } else if (_role.currWeapons == Weapons.dao) {
            _role.roleDoll.playAnim("Run1");
        } else {
            _role.roleDoll.playAnim("Run1");
        }
        this.timeOut = _role.roleConfigBase.walkOutDelay;
        // this.timeOut = 50;
    }

    // public handleInput(_role: Role, _input: RoleActInput): IRoleActState {
    //     // tslint:disable-next-line: no-this-assignment
    //     let result: IRoleActState = null;
    //     if (_input == RoleActInput.Attack) {
    //         result = AttackState.Instance;
    //     } else if (_input == RoleActInput.Jump) {
    //         result = JumpState.Instance;
    //     } else if (_input == RoleActInput.Direction_Release) {
    //         result = StandState.Instance;
    //     } else if (_input == RoleActInput.SpeedUp_Release) {
    //         //是否 还有 移动输入
    //         let hasDirMove = false;
    //         if (_role) {
    //             hasDirMove = gameMathUtil.vec2SqrLength(_role.moveVelocity) >= 0;
    //         }
    //         if (hasDirMove) {
    //             result = WalkState.Instance;
    //         } else {
    //             result = StandState.Instance;
    //         }
    //     }

    //     return result;
    // }

    public canChange(_input: RoleActInput): boolean {
        return RunState.stateArr.indexOf(_input) != -1;
    }
    public update(_role: Role, dt: number) {
        if (!_role) { return; }
        _role.walk(dt);
    }
}