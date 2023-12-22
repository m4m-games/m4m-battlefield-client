import { RoleActInput } from "../../GameEnum";
import { Role } from "../Role";
import { IRoleActState } from "./RoleActState";

export class PulltheRopeState implements IRoleActState {
    public timeOut: number = 0;
    public state: number = RoleActInput.PulltheRope;
    //发力拔绳子 状态  可切换    拔绳子预备状态
    private static stateArr: RoleActInput[] = [];
    constructor() {
        PulltheRopeState.stateArr = [RoleActInput.PreparePull, RoleActInput.Direction_Release, RoleActInput.DropOut];
    }

    public enter(_role: Role) {
        if (!_role) { return; }
        // tslint:disable-next-line: newline-per-chained-call
        _role.roleDoll.playAnim("TugOfWar", true).then(() => {
            _role.roleCtr.handleInput(RoleActInput.PreparePull);
        });

    }
    public canChange(_input: RoleActInput): boolean {
        let index = PulltheRopeState.stateArr.indexOf(_input);
        return index != -1;
    }
    public update(_role: Role, dt: number) {
    }
}