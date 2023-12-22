import {  EventGeneric, EventMgr } from "eventMgr";
import { PickMode, PickModeEvent } from "events/PickModeEvent";
import { commTool } from "Tools/commTool";
import { gdSkinnedMeshRenderer } from "Tools/engineParallel/m4m/gdSkinnedMeshRenderer";
import { engineParallelType, ISpTransform, spComponentType } from "Tools/engineParallel/spInterface";
import { StageMgr } from "./StageMgr";
/** 场景中拣选 3D 模型管理器 */
export class Pick3DModelsMgr {
    private static readonly helpV2 = new m4m.math.vector2();
    private static readonly helpV3 = new m4m.math.vector3();
    private static readonly helpInfo = new m4m.framework.pickinfo();
    private static readonly helpAABB = new m4m.framework.aabb(m4m.poolv3(), m4m.poolv3());
    private static readonly preparePlaneNormal = new m4m.math.vector3(0, -1, 0);
    private static readonly preparePlaneCPoint = new m4m.math.vector3(0, 209.2, 0);
    private static _lastPickMode = -1;
    private static testCube: m4m.framework.transform;
    private static _evPickedRole: EventGeneric<{ pos: m4m.math.vector2, GoId: number }> = new EventGeneric();
    private static _evMove: EventGeneric<m4m.math.vector3> = new EventGeneric();
    /** 初始化 */
    public static init() {
        //
        EventMgr.addListener("pick_mode_enable", this.onEnablePickMode, this);
        EventMgr.addListener("pick_mode_disable", this.onDisablePickMode, this);
    }

    /** 启用 拣选模式 */
    private static onEnablePickMode(ev: PickModeEvent) {
        if (ev.mode == null) { return; }
        // this.disablePickMode();
        let _scene = m4m.framework.sceneMgr.scene;
        let ipt = _scene.app.getInputMgr();
        let pEv = m4m.event.PointEventEnum;
        switch (ev.mode) {
            case PickMode.pick_role_down:
                ipt.addPointListener(pEv.PointDown, this.onPointDown, this);
                break;
            case PickMode.pick_role_up:
                ipt.addPointListener(pEv.PointUp, this.onPointUp, this);
                break;
            case PickMode.prepare_Role_drag:
                ipt.addPointListener(pEv.PointMove, this.onPointMove, this);
                break;
            default: let temp = null;
        }
        this._lastPickMode = ev.mode;
    }

    private static onDisablePickMode() {
        this.disablePickMode();
    }

    private static disablePickMode() {
        let _scene = m4m.framework.sceneMgr.scene;
        let ipt = _scene.app.getInputMgr();
        let pEv = m4m.event.PointEventEnum;
        ipt.removePointListener(pEv.PointDown, this.onPointDown, this);
        ipt.removePointListener(pEv.PointMove, this.onPointMove, this);
        ipt.removePointListener(pEv.PointUp, this.onPointUp, this);
        this._lastPickMode = -1;
    }

    private static onPointDown([x, y]) {
        let v2 = this.helpV2;
        m4m.math.vec2Set(v2, x, y);
        // console.log(`x : ${x} , y :${y}`);
        this.tryPickRole(v2, true);
    }

    private static onPointUp([x, y]) {
        let v2 = this.helpV2;
        m4m.math.vec2Set(v2, x, y);
        // console.log(`x : ${x} , y :${y}`);
        this.tryPickRole(v2, false);
    }

    private static onPointMove([x, y]) {
        let v2 = this.helpV2;
        m4m.math.vec2Set(v2, x, y);
        this.pickPlane(v2);
    }

    private static tryPickRole(spos: m4m.math.vector2, isdown: boolean) {
        let _scene = m4m.framework.sceneMgr.scene;
        let cam = _scene.mainCamera;
        let ray = cam.creatRayByScreen(spos, _scene.app);
        let root = StageMgr.roleRoot;
        let len = root.childrenCount;
        let hitTrans: ISpTransform;
        let currAABB = this.helpAABB;
        let needHighPrecision = false;  //是否需要高精度检测（检测mesh）
        for (let i = 0; i < len; i++) {
            let _c = root.getChildByIdx(i);
            commTool.cloneAABB(_c, currAABB);
            let isH = ray.intersectAABB(currAABB);
            if (isH) {
                if (needHighPrecision) {
                    if (_c.engineType == engineParallelType.none) {
                        let mr = _c.gameObject.getFirstComponent(spComponentType.skinMeshRenderer) as gdSkinnedMeshRenderer;
                        let isHMesh = mr.rawHandle.mesh.intersects(ray, mr.gameObject.transform.getWorldMatrix(), this.helpInfo);
                        if (!isHMesh) { continue; }
                    }
                }
                hitTrans = _c;
                break;
            }
        }

        if (hitTrans) {
            this._evPickedRole.data.GoId = hitTrans.gameObject.getID();
            m4m.math.vec2Clone(spos, this._evPickedRole.data.pos);
            if (isdown) {
                EventMgr.dispatchEvent("picked_role_Down", this._evPickedRole);
            } else {
                EventMgr.dispatchEvent("picked_role_Up", this._evPickedRole);
            }

            // let aabb: m4m.framework.aabb = currAABB;
            // console.log(`is picked :  ${hitTrans.name} , aabb range : ${m4m.math.vec3Distance(aabb.minimum, aabb.maximum)}`);
            //调试显示
            // {
            //     let min = m4m.framework.TransformUtil.CreatePrimitive(m4m.framework.PrimitiveType.Cube, _scene.app);
            //     m4m.math.vec3SetAll(min.localScale, 0.2);
            //     m4m.math.vec3Clone(aabb.minimum, min.localPosition);
            //     _scene.addChild(min);

            //     let max = m4m.framework.TransformUtil.CreatePrimitive(m4m.framework.PrimitiveType.Cube, _scene.app);
            //     m4m.math.vec3SetAll(max.localScale, 0.2);
            //     m4m.math.vec3Clone(aabb.maximum, max.localPosition);
            //     _scene.addChild(max);
            // }
        }
    }

    private static pickPlane(spos: m4m.math.vector2) {
        let _scene = m4m.framework.sceneMgr.scene;
        let cam = _scene.mainCamera;
        let ray = cam.creatRayByScreen(spos, _scene.app);
        let v3 = this.helpV3;
        let ishit = ray.intersectPlane(this.preparePlaneCPoint, this.preparePlaneNormal, v3);
        if (ishit) {
            m4m.math.vec3Clone(v3, this._evMove.data);
            EventMgr.dispatchEvent("pick_Plane_move", this._evMove);
        }
    }
}