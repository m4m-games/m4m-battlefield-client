import { RoleActInput } from "../../GameEnum";
import { Role } from "../Role";
import { IRoleActState } from "./RoleActState";

export class RightPreparePullState implements IRoleActState {
    public timeOut: number=0;
    public state: number = RoleActInput.RightPreparePull;
    // 拔绳子预备状态  可切换 发力拔绳子 状态   
    private static stateArr: RoleActInput[] = [ RoleActInput.Direction_Release, RoleActInput.DropOut, RoleActInput.RightPulltheRope];
    public enter(_role: Role) {
        if (!_role) { return; }
        _role.roleDoll.playAnim("TugOfWarIdleReverse");
    }

    public canChange(_input: RoleActInput): boolean {
        let index = RightPreparePullState.stateArr.indexOf(_input);
        return index != -1;
    }

    public update(_role: Role, dt: number) {
    }
}