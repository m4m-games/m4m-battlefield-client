import { RoleActInput } from "../../GameEnum";
import { Role } from "../Role";
import { IRoleActState } from "./RoleActState";

/**
 * 攻击 状态
 */
export class AttackState implements IRoleActState {
    public timeOut: number = 0;
    public state: number = RoleActInput.Attack;
    private static stateArr: RoleActInput[] = [];

    public constructor() {
        AttackState.stateArr = [RoleActInput.Direction_Release, RoleActInput.Direction, RoleActInput.SpeedUp, RoleActInput.StrikeToFly];
    }

    public enter(_role: Role, prevState: IRoleActState) {
        if (!_role) { return; }
        _role.attack(prevState);
    }

    // public handleInput(_role: Role, _input: RoleActInput): IRoleActState {
    //     return null;
    // }

    public canChange(_input: RoleActInput, _role: Role): boolean {
        return _input == RoleActInput.StrikeToFly || (!_role.isAttacking && AttackState.stateArr.indexOf(_input) != -1);
    }

    public update(_role: Role, dt: number) {
        if (_role) {
            _role.walk(dt);
        }
    }
}