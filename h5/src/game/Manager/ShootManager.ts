import { FrameMgr } from "Tools/FrameMgr";
import { gameMathUtil } from "Tools/gameMathUtil";
import { AudioEnum } from "../Audio/AudioEnum";
import { AudioPlayer } from "../Audio/AudioPlayer";

//播开播声音
export class ShootManager {
    public static get Instance(): ShootManager {
        if (this._instance == null) {
            this._instance = new ShootManager();
        }
        return this._instance;
    }
    public constructor() {
        //
        FrameMgr.Add(this.update, this);
    }
    private static _instance: ShootManager;
    private shootCount: number = 0;
    private gapTime = 0;//每XX秒 轮一次
    private newDaTime: number = 0;
    private max: number = 0.28;
    private min: number = 0.06;
    //开枪 
    public playShootFun(num: number) {
        this.shootCount = num;
        this.gapTime = gameMathUtil.RandRange(this.min, this.max);
    }

    private update(dt: number) {
        if (this.shootCount <= 0) { return; }
        this.newDaTime += dt;
        if (this.newDaTime >= this.gapTime) {
            this.newDaTime = 0;
            this.gapTime = gameMathUtil.RandRange(this.min, this.max);
            this.shootCount--;
            AudioPlayer.play(AudioEnum.WoodenGunshoot);
        }
    }
}