import { EventBase, EventGeneric } from "../eventMgr";
import { UiEvent } from "../events/uiEvent";

/** 游戏 UI 相关事件定义接口
 *
*/
export class EventMapUI {
    //-------------------UI 事件---------------------------

    /** 摇杆方向 */
    public "rocker_Direction": EventGeneric<m4m.math.vector2> = null;
    /** 摇杆释放 */
    public "rocker_Release": EventGeneric<null> = null;
    /** 跳跃 按钮点击 */
    public "rocker_JumpBtn_click": EventGeneric<null> = null;
    /** 攻击 按钮点击 */
    public "rocker_AttackBtn_click": EventGeneric<null> = null;
    /** 奔跑 点下 */
    public "rocker_RunBtn_Down": EventGeneric<null> = null;
    /** 奔跑 松开 */
    public "rocker_RunBtn_Up": EventGeneric<null> = null;
    /** 视角转动触摸 */
    public "rocker_View_move": EventGeneric<m4m.math.vector2> = null;
    /** 视角触摸点下 */
    public "rocker_View_down": EventGeneric<null> = null;
    /** 触摸input UI 释放 */
    public "rocker_View_FocusResetState": EventGeneric<null> = null;
    /** 触摸input UI 是否开启  */
    public "rocker_View_TouchEnable": EventGeneric<boolean> = null;
}