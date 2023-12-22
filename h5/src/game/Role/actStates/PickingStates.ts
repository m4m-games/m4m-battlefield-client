import { RoleActInput } from "../../GameEnum";
import { Role } from "../Role";
import { IRoleActState } from "./RoleActState";

/**
 * 抠糖饼 状态
 */
export class PickingStates implements IRoleActState {
    public timeOut: number = 0;
    public state: number = RoleActInput.Picking;
    //public canSwitch: boolean = true;
    private static stateArr: RoleActInput[] = [RoleActInput.Die, RoleActInput.Direction,RoleActInput.WaitForDeath,
    RoleActInput.Direction_Release, RoleActInput.Walk, RoleActInput.SpeedUp, RoleActInput.Jump];
    public enter(_role: Role) {
        if (!_role) { return; }
        _role.roleDoll.playAnim("BuckleSugarCake");
    }

    public canChange(_input: RoleActInput): boolean {
        return PickingStates.stateArr.indexOf(_input) != -1;
    }

    public update(_role: Role, dt: number) {

    }
}