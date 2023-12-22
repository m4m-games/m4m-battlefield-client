import { RoleActInput } from "../../GameEnum";
import { Role } from "../Role";
import { IRoleActState } from "./RoleActState";

/**
 * 传送 状态 
 */
export class TransferState implements IRoleActState {
    public timeOut: number = 0;
    public state: number = RoleActInput.TransferState;
    //
    private static stateArr: RoleActInput[] = []
    constructor() {
        TransferState.stateArr = [RoleActInput.PreparePull, RoleActInput.RightPreparePull, RoleActInput.Direction_Release];
    }
    public enter(_role: Role) {
        // console.error("切回站立");
    }

    public canChange(_input: RoleActInput): boolean {
        return TransferState.stateArr.indexOf(_input) != -1;
    }

    public update(_role: Role, dt: number) {

    }
}