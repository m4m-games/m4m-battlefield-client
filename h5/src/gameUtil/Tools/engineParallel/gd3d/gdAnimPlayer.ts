import { gd3dGO } from "../spGameObject";
import { spComponentType, ISpAnimPlayer } from "../spInterface";

/** 简配 camera 组件  */
// tslint:disable-next-line: class-name
export class gdAnimPlayer implements ISpAnimPlayer {
    public id: string;
    public rawHandle: gd3d.framework.aniplayer;
    public gameObject: gd3dGO;
    public compType: spComponentType = spComponentType.animPlayer;
    constructor(raw: gd3d.framework.aniplayer, go: gd3dGO) {
        this.id = `${go.getID()}_${this.compType}`;
        this.rawHandle = raw;
        this.gameObject = go;
    }
    public stop() {
        this.rawHandle.stop();
    }

    public playAnimByName(clipName: string, onPlayend?: () => any, blendTime?: number, endframe?: number, speed?: number, beRevert?: boolean) {
        this.rawHandle.playCross(clipName, blendTime, onPlayend, speed, beRevert);
    }

    public dispose() {
        this.rawHandle = null;
        this.gameObject = null;
    }

}