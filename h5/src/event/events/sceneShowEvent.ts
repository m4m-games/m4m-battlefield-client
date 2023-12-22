import { EventBase } from "../eventMgr";
/**
 * 场景 可视事件
 */
export class SceneShowEvent extends EventBase {
    /** 场景ID */
    public sceneID: number;
    public uiName: string;
}