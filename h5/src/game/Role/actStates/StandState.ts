import { AudioEnum } from "../../Audio/AudioEnum";
import { AudioPlayer } from "../../Audio/AudioPlayer";
import { RoleActInput, Weapons } from "../../GameEnum";
import { Role } from "../Role";
import { AttackState } from "./AttackState";
import { JumpState } from "./JumpState";
import { IRoleActState } from "./RoleActState";
import { WalkState } from "./WalkState";

/**
 * 站立 状态
 */
export class StandState implements IRoleActState {
    public timeOut: number = 0;
    public state: number = RoleActInput.Direction_Release;
    //站立 状态  可切换    走  攻击  跳
    private static stateArr: RoleActInput[] = []
    constructor() {
        StandState.stateArr = [RoleActInput.TransferState, RoleActInput.WaitForDeath, RoleActInput.Direction, RoleActInput.Attack, RoleActInput.Jump,
        RoleActInput.Die, RoleActInput.DropOut, RoleActInput.PreparePull, RoleActInput.PulltheRope, RoleActInput.RightPreparePull, RoleActInput.RightPulltheRope, RoleActInput.Picking,
        RoleActInput.StrikeToFly, RoleActInput.Direction_Release, RoleActInput.SpeedUp, RoleActInput.Walk];
    }
    public enter(_role: Role) {
        // console.error("切回站立");
        //检查播放 idle 动画 
        if (_role.currWeapons == Weapons.bat) {
            _role.roleDoll.playAnim("Idle");
        } else if (_role.currWeapons == Weapons.dao) {
            _role.roleDoll.playAnim("Idle");
        } else {
            _role.roleDoll.playAnim("Idle");
        }
        this.timeOut = _role.roleConfigBase.standOutDelay;

        // this.timeOut = 20;
    }

    // public handleInput(_role: Role, _input: RoleActInput): IRoleActState {
    //     // tslint:disable-next-line: no-this-assignment
    //     let result: IRoleActState = null;
    //     switch (_input) {
    //         case RoleActInput.Direction:
    //             result = WalkState.Instance;
    //             break;
    //         case RoleActInput.Attack:
    //             result = AttackState.Instance;
    //             break;
    //         case RoleActInput.Jump:
    //             result = JumpState.Instance;
    //             break;
    //         default:
    //     }

    //     return result;
    // }
    public canChange(_input: RoleActInput): boolean {
        return StandState.stateArr.indexOf(_input) != -1;
    }

    public update(_role: Role, dt: number) {

    }
}