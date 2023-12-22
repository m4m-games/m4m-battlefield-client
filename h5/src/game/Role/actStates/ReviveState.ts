import { RoleActInput } from "../../GameEnum";
import { Role } from "../Role";
import { IRoleActState } from "./RoleActState";

export class ReviveState implements IRoleActState {
    public timeOut: number=0;
    public state: number = RoleActInput.Revive;
    //复活状态  可切换    站立
    private static stateArr: RoleActInput[] = [];
    constructor(){
         ReviveState.stateArr = [RoleActInput.Direction_Release];
    }
    public enter(_role: Role) {
        if (!_role) { return; }
        // console.error("复活状态");
        //检查播放 idle 动画 
        _role.roleDoll.playAnim("Idle");
    }

    // public handleInput(_role: Role, _input: RoleActInput): IRoleActState {
    //     return null;
    // }

    public canChange(_input: RoleActInput): boolean {
        return ReviveState.stateArr.indexOf(_input) != -1;
    }
    public update(_role: Role, dt: number) {

    }
}