import { EventBase } from "../eventMgr";

/**
 * 场景 可视事件
 */
export class SceneHideEvent extends EventBase {
    /** 场景ID */
    public sceneID: number;
    /** 是否销毁（卸载场景资源） */
    public dispose: boolean;
}