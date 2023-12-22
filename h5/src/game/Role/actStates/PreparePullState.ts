import { RoleActInput } from "../../GameEnum";
import { Role } from "../Role";
import { IRoleActState } from "./RoleActState";

export class PreparePullState implements IRoleActState {
    public timeOut: number = 0;
    public state: number = RoleActInput.PreparePull;
    // 拔绳子预备状态  可切换 发力拔绳子 状态   
    private static stateArr: RoleActInput[] = [RoleActInput.PulltheRope, RoleActInput.Direction_Release, RoleActInput.DropOut];

    public enter(_role: Role) {
        if (!_role) { return; }
        _role.roleDoll.playAnim("TugOfWarIdle");
    }
    public canChange(_input: RoleActInput): boolean {
        let index = PreparePullState.stateArr.indexOf(_input);
        return index != -1;
    }

    public update(_role: Role, dt: number) {
    }
}