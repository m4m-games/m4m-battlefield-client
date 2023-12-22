import { RoleActInput } from "../../GameEnum";
import { Role } from "../Role";
import { IRoleActState } from "./RoleActState";

export class RightPullTheRopeState implements IRoleActState {
    public timeOut: number = 0;
    public state: number = RoleActInput.RightPulltheRope;
    // 拔绳子预备状态  可切换 发力拔绳子 状态   
    private static stateArr: RoleActInput[] = [RoleActInput.Direction_Release, RoleActInput.DropOut, RoleActInput.RightPreparePull];

    public enter(_role: Role) {
        if (!_role) { return; }
        _role.roleDoll.playAnim("TugOfWarReverse", true)
            .then(() => {
                _role.roleCtr.handleInput(RoleActInput.RightPreparePull);
            });
    }

    public canChange(_input: RoleActInput): boolean {
        let index = RightPullTheRopeState.stateArr.indexOf(_input);
        return index != -1;
    }
    public update(_role: Role, dt: number) {
    }
}