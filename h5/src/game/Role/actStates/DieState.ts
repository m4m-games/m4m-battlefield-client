import { RoleActInput } from "../../GameEnum";
import { Role } from "../Role";
import { GameDiePerformanceEnum } from "../RoleAttrInfo";
import { IRoleActState } from "./RoleActState";

export class DieState implements IRoleActState {
    public timeOut: number = 0;
    public state: number = RoleActInput.Die;
    //死亡状态  可切换    站立
    private static stateArr: RoleActInput[] = [];
    constructor() {
        DieState.stateArr = [RoleActInput.Revive];
    }
    public enter(_role: Role) {
        if (!_role) { return; }
        console.error("切换死亡状态");
        if (_role.roleData.defDiePerformance == GameDiePerformanceEnum.Die) {
            _role.roleDoll.playAnim("Die");
        } else if (_role.roleData.defDiePerformance == GameDiePerformanceEnum.DropOutDie) {
            _role.roleDoll.playAnim("TugOfWarFall3");
        } else if (_role.roleData.defDiePerformance == GameDiePerformanceEnum.Back) {
            _role.roleDoll.playAnim("Die2");
        }
    }

    // public handleInput(_role: Role, _input: RoleActInput): IRoleActState {
    //     return null;
    // }

    public canChange(_input: RoleActInput): boolean {
        return DieState.stateArr.indexOf(_input) != -1;
    }

    public update(_role: Role, dt: number) {

    }
}