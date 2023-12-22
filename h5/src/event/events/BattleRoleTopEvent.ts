import { EventBase } from "../eventMgr";
/**
 * * 角色 头顶 UI同步坐标 事件
 */
export class BattleRoleTopPosEvent extends EventBase {
    /** 角色 头顶 UI同步坐标 */
    public topPosMap: { [slotID: number]: { active: boolean, pos: m4m.math.vector2 } };
}