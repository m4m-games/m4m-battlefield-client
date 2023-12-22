import { AudioEnum } from "../../Audio/AudioEnum";
import { AudioPlayer } from "../../Audio/AudioPlayer";
import { GamePlayType, RoleActInput, Weapons } from "../../GameEnum";
import { GamePlayMgr } from "../../gamePlays/GamePlayMgr";
import { Role } from "../Role";
import { IRoleActState } from "./RoleActState";

export class WalkState implements IRoleActState {
    public timeOut: number = 0;
    public state: number = RoleActInput.Direction;
    //行走 状态  可切换    站立  跑  攻击  跳
    private static stateArr: RoleActInput[] = []

    constructor() {
        WalkState.stateArr = [RoleActInput.TransferState, RoleActInput.WaitForDeath, RoleActInput.Direction_Release, RoleActInput.SpeedUp, RoleActInput.Attack,
        RoleActInput.Jump, RoleActInput.Die, RoleActInput.DropOut, RoleActInput.PreparePull, RoleActInput.RightPreparePull, RoleActInput.RightPulltheRope, RoleActInput.Picking,
        RoleActInput.StrikeToFly];
    }

    // private timeOut: number = 0;
    public enter(_role: Role) {
        if (!_role) { return; }
        // console.error("切回行走");
        if (_role.roleData.isMainPlayer()) {
            if (GamePlayMgr.currGameType == GamePlayType.woodenPeople) {
                AudioPlayer.play(AudioEnum.WoodWalkSand);
            } else {
                AudioPlayer.play(AudioEnum.WoodWalkNormal);
            }
        }
        if (_role.currWeapons == Weapons.bat) {
            _role.roleDoll.playAnim("Walk1");
        } else if (_role.currWeapons == Weapons.dao) {
            _role.roleDoll.playAnim("Walk1");
        } else {
            _role.roleDoll.playAnim("Walk1");
        }
        this.timeOut = _role.roleConfigBase.walkOutDelay;
        // this.timeOut = 50;
    }

    // public handleInput(_role: Role, _input: RoleActInput): IRoleActState {
    //     // tslint:disable-next-line: no-this-assignment
    //     let result: IRoleActState = null;
    //     if (_input == RoleActInput.Direction_Release) {
    //         result = StandState.Instance;
    //     } else if (_input == RoleActInput.SpeedUp) {
    //         result = RunState.Instance;
    //     } else if (_input == RoleActInput.Attack) {
    //         result = AttackState.Instance;
    //     } else if (_input == RoleActInput.Jump) {
    //         result = JumpState.Instance;
    //     }

    //     return result;
    // }
    public canChange(_input: RoleActInput): boolean {
        let index = WalkState.stateArr.indexOf(_input);
        return index != -1;
    }
    public update(_role: Role, dt: number) {
        if (!_role) { return; }
        _role.walk(dt);
    }
}