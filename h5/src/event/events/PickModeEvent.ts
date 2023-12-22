import { CallBackData } from "Loader/otherPlan/Loader";

export enum PickMode {
    /** 点选 角色 Down*/
    pick_role_down,
    /** 点选 角色 UP */
    pick_role_up,
    /** 选角站位 拖拽角色 */
    prepare_Role_drag,
}
/** 拣选 模式事件 */
export class PickModeEvent {
    public mode: PickMode;
}