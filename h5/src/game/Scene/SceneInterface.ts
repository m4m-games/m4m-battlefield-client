import { IDispose } from "Tools/engineParallel/spInterface";

/** 可视化场景 */
export interface ISceneVisual extends IDispose {
    /**
     * 展示场景
     * @param resName 场景资源名
     */
    show(): Promise<void>;
    /** 隐藏场景 */
    hied();
}