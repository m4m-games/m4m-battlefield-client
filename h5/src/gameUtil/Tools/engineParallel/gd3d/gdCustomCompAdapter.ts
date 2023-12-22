import { ISpCustomCompAdapter, ISpCustomComp } from "../spInterface";
import { gd3dGO } from "../spGameObject";

/**
 * 自定义组件 连接
 */
@gd3d.reflect.nodeComponent
// tslint:disable-next-line: class-name
export class gdCustomCompAdapter extends gd3d.framework.behaviour implements ISpCustomCompAdapter {
    private spCustomComp: ISpCustomComp;
    private _enabled = true;

    public getComp() {
        return this.spCustomComp;
    }

    public setEnabled(enabled: boolean) {
        this._enabled = enabled;
        if (this.spCustomComp) { this.spCustomComp.enabled = enabled; }
    }

    public getEnabled(): boolean {
        return this._enabled;
    }

    public addCompToGO(_customComp: ISpCustomComp) {
        this.spCustomComp = _customComp;
        this.spCustomComp.gameObject = new gd3dGO(this.gameObject);
        this.enabled = this.enabled;
    }

    public start() {
        if (this.spCustomComp.start) {
            this.spCustomComp.start();
        }
    }

    /** 初始化使用 在start 之后 */
    public onPlay() {
        if (this.spCustomComp.onPlay) {
            this.spCustomComp.onPlay();
        }
    }

    /** 每帧调用一次 */
    public update(delta: number) {
        if (this.spCustomComp.update) {
            this.spCustomComp.update(delta);
        }
    }

    /** 组件被清理时调用 */
    public remove() {
        if (this.spCustomComp.remove) {
            this.spCustomComp.remove();
        }

        this.spCustomComp = null;
    }

}