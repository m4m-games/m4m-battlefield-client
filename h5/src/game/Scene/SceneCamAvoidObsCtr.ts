import { LateUpdateMgr } from "Tools/LateUpdateMgr";
import { GameLogic } from "../Core/GameLogic";
import { StageMgr } from "../Core/StageMgr";
import { SceneMgr } from "./SceneMgr";

/**
 * 场景相机 避开障碍阻挡 控制器
 */
export class SceneCamAvoidObsCtr {

    private static readonly helpV3 = new m4m.math.vector3();
    private static readonly helpV3v1 = new m4m.math.vector3();
    private static readonly helpV3v2 = new m4m.math.vector3();
    private static readonly helpRay = new m4m.framework.ray(new m4m.math.vector3(), new m4m.math.vector3());
    private static readonly helpPickInfo = new m4m.framework.pickinfo();

    private static _enableCkObs = true;
    private static _active = false;
    private static _minDistance = 5;
    private static _baseDistance = 10;
    private static _currDistance = 10;
    private static _ckObsTime = 0.15;
    private static _moveSpeed = 5;
    private static _ckObsTimeCounter = 0;

    /** 是否激活 */
    public static get active() { return this._active; }
    public static set active(val: boolean) { this._active = val; }

    /** 相机看向目标的基础距离 */
    public static get baseDistance() { return this._baseDistance; }
    public static set baseDistance(val: number) {
        if (isNaN(val)) { return; }
        let v = val < this._minDistance ? this._minDistance : val;
        if (v == this._baseDistance) { return; }
        this._baseDistance = v;
        this._currDistance = v;
    }

    /** 相机能拉近的最大距离 */
    public static get minDistance() { return this._minDistance; }
    public static set minDistance(val: number) {
        if (isNaN(val)) { return; }
        this._minDistance = val < 0 ? 0 : val;
        if (this._baseDistance < this._minDistance) { this.baseDistance = this._minDistance; }
    }

    public static init() {

        //update fun reg
        LateUpdateMgr.Add(this.lateUpdate, this);
    }

    private static lateUpdate(dt: number) {
        if (!this._active) { return; }
        let camCtr = StageMgr.camCtr;
        if (!camCtr) { return; }
        if (this._enableCkObs) {
            this.ckObs(dt);
        }
        if (camCtr.distance == this._currDistance) { return; }
        //渐进 相机距离调整
        camCtr.distance = m4m.math.numberLerp(camCtr.distance, this._currDistance, dt * this._moveSpeed);
        if (Math.abs(camCtr.distance - this._currDistance) < 0.01) {
            camCtr.distance = this._currDistance;
        }
    }

    // 检查障碍
    private static ckObs(dt: number) {
        this._ckObsTimeCounter -= dt;
        if (this._ckObsTimeCounter > 0) { return; }
        this._ckObsTimeCounter = this._ckObsTime;
        let _ray = SceneCamAvoidObsCtr.helpRay;
        let _pickInfo = SceneCamAvoidObsCtr.helpPickInfo;
        //检查是否 相机看角色被阻挡

        // let _layerMask = m4m.framework.CullingMask.everything; //仅碰特定层
        let _layerMask = GameLogic.layerBitBuilding; //仅碰特定层

        let scene = m4m.framework.sceneMgr.scene;
        let cam = scene.mainCamera;
        let camPos = cam.gameObject.transform.localPosition;
        StageMgr.camCtr.getRealLookPoint(_ray.origin);
        m4m.math.vec3Subtract(camPos, _ray.origin, _ray.direction);
        m4m.math.vec3Normalize(_ray.direction, _ray.direction);
        //打射线
        let ishited = scene.pick(_ray, _pickInfo, true, StageMgr.sceneRoot.rawHandle, _layerMask);
        // let rayLen = m4m.math.vec3Distance(_pickInfo.hitposition, camPos);
        let rayLen = m4m.math.vec3Distance(_ray.origin, _pickInfo.hitposition);
        if (ishited && rayLen <= this._baseDistance) {
            let dis = rayLen - 0.1;
            this._currDistance = dis < this._minDistance ? this._minDistance : dis > this._baseDistance ? this._baseDistance : dis;
        } else {
            this._currDistance = this._baseDistance;
        }
    }
}