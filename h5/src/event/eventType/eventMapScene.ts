import { EventBase, EventGeneric } from "../eventMgr";
import { BattleRoleTopPosEvent } from "../events/BattleRoleTopEvent";
import { JoyEvent } from "../events/joyEvent";
import { PickModeEvent } from "../events/PickModeEvent";
import { SceneHideEvent } from "../events/sceneHideEvent";
import { SceneShowEvent } from "../events/sceneShowEvent";
import { SceneVisualEvent } from "../events/sceneVisualEvent";

/** 游戏 scene 事件定义接口
 *
*/
export class EventMapScene {
    //-------------------场景战斗事件---------------------------
    //joy Event
    /** 摇杆摇晃 */
    public "joy_shake": JoyEvent = null;
    /** 释放摇杆 */
    public "joy_release": JoyEvent = null;

    //role Event

    //scene Event
    /** 初始资源加载完毕 */
    public "res_dependent_loaded": EventBase = null;
    /** 初始完毕 */
    public "stage_Inited": EventBase = null;

    /** 游戏暂停 */
    public "game_pause": EventBase = null;
    /** 游戏取消暂停 */
    public "game_unpause": EventBase = null;
    /** 场景显示 */
    public "scene_show": SceneShowEvent = null;
    /** 场景隐藏 */
    public "scene_hide": SceneHideEvent = null;
    /** 场景 可视化改变（显示 或 隐藏） */
    public "scene_visual_change": SceneVisualEvent = null;
    //
    /** 开启指定的 拣选模式 */
    public "pick_mode_enable": PickModeEvent = null;
    /** 关闭所有 拣选功能 */
    public "pick_mode_disable": EventBase = null;
    /** 拣选到了 角色 按下 */
    public "picked_role_Down": EventGeneric<{ pos: m4m.math.vector2, GoId: number }> = null;
    /** 拣选到了 角色 弹起*/
    public "picked_role_Up": EventGeneric<{ pos: m4m.math.vector2, GoId: number }> = null;
    /** 拣选到了 角色 ,指定平面滑动 */
    public "pick_Plane_move": EventGeneric<m4m.math.vector3> = null;

    //----------
    /** 创建 玩家角色  */
    // public "player_make": EventGeneric<{ roleInfo: any }> = null;
    /** 创建 角色  */
    public "role_make": EventGeneric<{ roleInfo: any }> = null;
    /** 移除 角色  */
    public "role_remove": EventGeneric<string> = null;
    /** 角色 创建完毕  */
    public "role_makeSuccess": EventGeneric<string> = null;
    /** 设置主角视角  */
    public "role_view": EventGeneric<{ info: any }> = null;
    /** 设置主角视角 完成  */
    public "camera_View_Success": EventGeneric<string> = null;

    /** 角色 输入 方向移动  */
    public "role_Direction": EventGeneric<{ GUID: string, /** 移动方向 */dir: m4m.math.vector2 }> = null;
    /** 角色 输入 方向移动释放  */
    public "role_DirRelease": EventGeneric<{ GUID: string }> = null;
    /** 角色 输入 加速  */
    public "role_speedUp": EventGeneric<{ GUID: string }> = null;
    /** 角色 输入 加速释放  */
    public "role_speedUpRel": EventGeneric<{ GUID: string }> = null;
    /** 角色 输入 跳跃  */
    public "role_jump": EventGeneric<{ GUID: string }> = null;
    /** 角色 输入 攻击  */
    public "role_attack": EventGeneric<{ GUID: string }> = null;
    /** 角色 设置 位置  */
    public "role_setPos": EventGeneric<{ GUID: string, pos: m4m.math.vector3 }> = null;
    /** 角色 设置 Y 轴的旋转角度  */
    public "role_setYRotate": EventGeneric<{ GUID: string, /**Y 旋转角度*/yAngle: number }> = null;
    /** 角色 设置 AI     */
    public "role_setAI": EventGeneric<{ GUID: string, aiType: number }> = null;

    /** 游戏玩家死亡 */
    public "game_Player_Dead": EventGeneric<{ GUIDS: string[] }> = null;
    /** 游戏中同步配置 */
    public "game_config": EventGeneric<{ config: any }> = null;
    /** 游戏结算 */
    public "game_result": EventGeneric<{ resultData: any }> = null;
    /** 木头人发出音效 */
    public "game_wooden_audioTime": EventGeneric<{ playSound: number, playSoundTime: number }> = null;
    /** 木头人停止音效 */
    public "game_wooden_audioStopTime": EventGeneric<{ stopSoundTime: number }> = null;

    /** 角色 信息更新 */
    public "role_Data_upDate": EventGeneric<{ data: any }> = null;
    /** 清除其他角色  */
    public "role_clear_Other": EventGeneric<string> = null;
    /** 游戏状态*/
    public "game_state": EventGeneric<{ gameState: any }> = null;

    /** 收集当前场景能 替换贴图的模型 */
    public "replaceTex_Collect_Care": EventGeneric<{ carekey: string }> = null;
    /** 指定屏幕位置的场景模型替换贴图 */
    public "replaceTex_By_Point": EventGeneric<{ x: number, y: number, textureURL: string }> = null;
    /** 指定节点名模型替换贴图 */
    public "replaceTex_By_Name": EventGeneric<{ nodeName: string, textureURL: string }> = null;
    /** 替换贴图的模型 清理 */
    public "replaceTex_Clear": EventBase = null;
    /** 替换贴图 成功回调 */
    public "replaceTex_success_cb": EventGeneric<string> = null;
    /** 替换贴图 点击 */
    public "replaceTex_Point_Down": EventGeneric<{ x: number; y: number; }> = null;
    /** 替换贴图 点中回调 */
    public "replaceTex_On_Down": EventGeneric<string> = null;

    /** 角色部件替换 目标角色 */
    public "role_parts_target": EventGeneric<string> = null;
    /** 角色部件替换*/
    public "role_parts_replace": EventGeneric<{ partKey: string, model: string, appointTargetRoleID: string}> = null;

    /** 拣选3D展示 加载模型 */
    public "pick_display_load": EventGeneric<{ modelName: string, scale: number, offset: m4m.math.vector3, rotate: m4m.math.vector3 }> = null;
    /** 拣选3D展示 移动模型到指定位置 2D 屏幕 */
    public "pick_display_move": EventGeneric<{ name: string, x: number, y: number }> = null;
    /** 拣选3D展示 删除模型 */
    public "pick_display_remove": EventGeneric<string> = null;
    /** 拣选3D展示 屏幕坐标点击拣选模型 */
    public "pick_display_tryPick": EventGeneric<{ x: number, y: number }> = null;
    /** 拣选3D展示 模型加载完毕 */
    public "pick_display_loaded": EventGeneric<string> = null;
    /** 拣选3D展示 模型点击拣选成功 */
    public "pick_display_picked": EventGeneric<string> = null;
    /** 拣选3D展示 移动模型到指定位置 回调 */
    public "pick_display_onMove": EventGeneric<{ name: string, x: number, y: number, z: number }> = null;
    /** 拣选3D展示 移动模型到指定位置 3D */
    public "pick_display_Position": EventGeneric<{ name: string, pos: m4m.math.vector3, rotate: m4m.math.vector3, scale: m4m.math.vector3}> = null;

    /** 角色doll替换*/
    public "role_Doll_replace": EventGeneric<{ roleguid: string, dollID: number }> = null;
    /** 角色doll替换 完成回调 */
    public "role_Doll_replace_cb": EventGeneric<string> = null;
}