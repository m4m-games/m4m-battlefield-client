import { EventBase } from "../eventMgr";

export enum SceneType {
    /** 主页菜单地图场景 */
    HomeMap,
    /** 战斗场景 */
    Battle,
    /** 角色陈列场景 */
    Showroom,
    /** 角色预备调整场景 */
    RolePrepare,
    /** UI之上 模型角色 */
    AboveUI,
}

/**
 * 场景 可视事件
 */
export class SceneVisualEvent extends EventBase {
    public isShow: boolean;
    public sceneID: number;
    public sceneType: SceneType;
    public uiName: string;
}