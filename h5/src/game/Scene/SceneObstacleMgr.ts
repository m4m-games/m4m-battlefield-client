import { ReuseArray } from "Data/ReuseArray";
import { commTool } from "Tools/commTool";
import { DebugLineTool2d } from "Tools/DebugLineTool2d";
import { FrameMgr } from "Tools/FrameMgr";
import { gameMathUtil } from "Tools/gameMathUtil";
import { metaUIManager } from "UIBase/metaUIManager";
import { AppMain } from "../appMain";
import { GameMgr } from "../GameMgr";
import { Grid2D } from "./Obstacle/Grid2D";
import { PolygonObstacle } from "./Obstacle/PolygonObstacle";

/** 场景障碍 */
export class SceneObstacleMgr {
    public static readonly helpV2: m4m.math.vector2 = new m4m.math.vector2();
    public static readonly helpV2v1: m4m.math.vector2 = new m4m.math.vector2();
    public static readonly helpV2v2: m4m.math.vector2 = new m4m.math.vector2();
    public static readonly helpV2v3: m4m.math.vector2 = new m4m.math.vector2();
    public static readonly helpV2v4: m4m.math.vector2 = new m4m.math.vector2();
    public static readonly helpV2v5: m4m.math.vector2 = new m4m.math.vector2();
    public static readonly helpV3: m4m.math.vector3 = new m4m.math.vector3();
    public static readonly helpV3v1: m4m.math.vector3 = new m4m.math.vector3();
    public static readonly helpNumReuseArr: ReuseArray<number> = new ReuseArray<number>();
    public static readonly hitMixGap = 0.02;

    private static _ObsGridMap: { [obsName: string]: Grid2D } = {};
    private static _ObsPolygonsMap: { [obsName: string]: PolygonObstacle[] } = {};
    private static _currObsName: string = null;
    private static _debugVelP0 = new m4m.math.vector3();   //debug绘制 碰撞速度向量P0
    private static _debugVelP1 = new m4m.math.vector3();   //debug绘制 碰撞速度向量P1
    private static _debugVelPoints: m4m.math.vector3[] = [];
    private static _debugHitNormal: m4m.math.vector2 = new m4m.math.vector2();   //debug绘制 碰撞点 法线
    private static _debugHitPoints: m4m.math.vector3[] = [];   //debug绘制 碰撞点 list
    private static _debugMoveLines: m4m.math.vector3[] = [];   //debug绘制 轨迹线
    private static _GridUintSize: number = 20;

    public static init() {
        //update
        FrameMgr.Add(this.update, this);
    }

    /** 当前是否激活 */
    public static get isEnable() { return this._currObsName != null; }

    /**
     * 加载处理 障碍
     * @param obsName 
     */
    public static async show(obsName: string) {
        //加载配置
        this._currObsName = obsName;
        await this.setSceneObstacle(obsName);
    }

    /**
     * 删除当前障碍
     */
    public static remove() {
        if (!this._currObsName) { return; }

        this._currObsName = null;
    }

    /**
     * 计算 射线碰撞终点
     * @param _p0 射线开始点
     * @param _p1 射线结束点
     * @param outPoint 终点
     * @param outMidPoint？ 转折中间点
     * @returns 
     */
    public static calcLineCollisionPoint(_p0: m4m.math.vector2, _p1: m4m.math.vector2, outPoint: m4m.math.vector3, outMidPoint?: m4m.math.vector3): boolean {
        let result = false;
        let p0 = m4m.poolv2(_p0);
        let p1 = m4m.poolv2(_p1);
        let hitNormal = m4m.poolv2();
        let hitPoint = m4m.poolv3();
        let hitTanP = m4m.poolv2();
        let v2 = m4m.poolv2();

        //clear HitPoints
        if (GameMgr.Draw2dDebug) {
            this._debugHitPoints.forEach((val) => { m4m.poolv3_del(val); });
            this._debugHitPoints.length = 0;
            this._debugMoveLines.forEach((val) => { m4m.poolv3_del(val); });
            this._debugMoveLines.length = 0;
            //line 1
            this._debugMoveLines.push(m4m.math.pool.new_vector3(_p0.x, 0, _p0.y));
            this._debugMoveLines.push(m4m.math.pool.new_vector3(_p1.x, 0, _p1.y));
        }

        //hit point
        result = this.hitTestByLine(p0, p1, v2, SceneObstacleMgr.hitMixGap, hitNormal, hitTanP);
        if (result) {
            m4m.math.vec3Set(hitPoint, v2.x, 0, v2.y);
            m4m.math.vec3Set(outPoint, hitTanP.x, 0, hitTanP.y);
            if (outMidPoint) {
                m4m.math.vec3Clone(hitPoint, outMidPoint);
            }
            if (GameMgr.Draw2dDebug) {
                this._debugHitPoints.push(m4m.poolv3(hitPoint));
                this._debugHitPoints.push(m4m.poolv3(outPoint));
                m4m.math.vec2Clone(hitNormal, this._debugHitNormal);
                //line 2
                this._debugMoveLines.push(m4m.math.pool.new_vector3(v2.x, 0, v2.y));
                this._debugMoveLines.push(m4m.math.pool.new_vector3(hitTanP.x, 0, hitTanP.y));
            }

            //碰撞二次传递
            let hasHited = this.transmitCollision(hitPoint, hitTanP, v2);
            m4m.math.vec3Set(outPoint, v2.x, 0, v2.y);
            if (GameMgr.Draw2dDebug) {
                this._debugHitPoints.push(m4m.poolv3(outPoint));
                //line 3
                this._debugMoveLines.push(m4m.math.pool.new_vector3(hitTanP.x, 0, hitTanP.y));
                this._debugMoveLines.push(m4m.math.pool.new_vector3(v2.x, 0, v2.y));
            }
            // if (hasHited) {
            // }
        }

        //检查 是否穿越到多边形里面，避免穿墙
        if (this.hasHitByline(_p0, v2)) {
            m4m.math.vec3Set(outPoint, _p0.x, 0, _p0.y);
        }

        //clear
        m4m.poolv2_del(p0);
        m4m.poolv2_del(p1);
        m4m.poolv2_del(hitNormal);
        m4m.poolv3_del(hitPoint);
        m4m.poolv2_del(hitTanP);
        m4m.poolv2_del(v2);

        return result;
    }

    //获取 当前场景
    private static async getObstacle(obsName: string): Promise<number[][]> {
        let url = `${GameMgr.sceneObstaclePath}${obsName}.json`;
        //加载读取配置
        let text = await commTool.syncloadText(url);
        let arr = JSON.parse(text);
        return arr;

        // //test
        // return [
        //     [0, 10, 10, 10, 10, 9, 0, 9],
        //     [8, 10, 9, 10, 26, 0, 25, 0],
        // ];
    }

    /** 设置场景障碍 */
    private static async setSceneObstacle(obsName: string) {
        let _map = this._ObsGridMap;
        let _grid = _map[obsName] as Grid2D;
        this._currObsName = obsName;
        if (_grid) { return; }
        _grid = _map[obsName] = new Grid2D(this._GridUintSize);
        let _pMap = this._ObsPolygonsMap;
        let arr = _pMap[obsName] = [];
        let datas = await this.getObstacle(obsName);
        let len = datas.length;
        for (let i = 0; i < len; i++) {
            let data = datas[i];
            //构建AABB
            let p = new PolygonObstacle(data);
            arr.push(p);
            //装入网格
            _grid.addRect(p.aabb, i);
        }
    }

    /**
     * 通过线段碰撞 检测
     * @param p0 线段开始点
     * @param p1 线段结束点
     * @param outHitPoint 返回的碰撞点 
     * @param outNormal 返回的碰撞点法向量
     * @param outTangentP 返回的碰撞点切线方向延展后终点
     * @param minGap 离多边形的 保留间距（默认不保留）
     */
    // tslint:disable-next-line: cyclomatic-complexity
    public static hitTestByLine(p0: m4m.math.vector2, p1: m4m.math.vector2, outHitPoint: m4m.math.vector2, _minGap = 0, outNormal?: m4m.math.vector2, outTangentP?: m4m.math.vector2): boolean {
        let result = false;
        let _map = this._ObsGridMap;
        let _grid = _map[this._currObsName] as Grid2D;
        if (!_grid) { return false; }
        let minGap = _minGap == null || isNaN(_minGap) ? 0 : _minGap;
        let _pmap = this._ObsPolygonsMap;
        let _arr = _pmap[this._currObsName];
        let uintArr = this.helpNumReuseArr;
        _grid.getByLine(p0, p1, uintArr);
        let len = uintArr.length;
        let nearPID: number = null;
        let hitPoint = m4m.poolv2();
        let tempHitPoint = m4m.poolv2();
        let tempNormal = outNormal || minGap > 0 ? m4m.poolv2() : null;
        let tempHitP2 = outTangentP ? m4m.poolv2() : null;
        //碰 区域内的多边形
        for (let i = 0; i < len; i++) {
            let id = uintArr.get(i);
            let p = _arr[id];
            if (!p || !p.active) { continue; }
            let isHited = false;
            isHited = p.hitTestLine(p0, p1, tempHitPoint, tempNormal, tempHitP2);
            if (!isHited) { continue; }
            //判读是否是离开始点最近的
            if (nearPID != null && gameMathUtil.vec2DisSqr(p0, hitPoint) <= gameMathUtil.vec2DisSqr(p0, tempHitPoint)) {
                continue;
            }
            nearPID = id;
            m4m.math.vec2Clone(tempHitPoint, hitPoint);
            if (tempNormal && outNormal) { m4m.math.vec2Clone(tempNormal, outNormal); }
            if (tempHitP2) { m4m.math.vec2Clone(tempHitP2, outTangentP); }
        }

        if (GameMgr.Draw2dDebug) {
            let v30 = m4m.poolv3();
            m4m.math.vec3Set(v30, p0.x, 0, p0.y);
            this._debugVelPoints.push(v30);

            let v31 = m4m.poolv3();
            m4m.math.vec3Set(v31, p1.x, 0, p1.y);
            this._debugVelPoints.push(v31);
        }
        result = nearPID != null;
        if (result) {
            if (minGap > 0) {
                m4m.math.vec2Set(hitPoint, hitPoint.x + tempNormal.x * minGap, hitPoint.y + tempNormal.y * minGap);
            }
            m4m.math.vec2Clone(hitPoint, outHitPoint);
            if (outTangentP) {
                let dirTan = m4m.poolv2();
                let lineHitP1 = m4m.poolv2();
                m4m.math.vec2Subtract(outTangentP, tempHitPoint, dirTan);
                //方向 和 射线方向一致？
                m4m.math.vec2Subtract(outHitPoint, p1, lineHitP1);
                m4m.math.vec2Normalize(dirTan, dirTan);
                let tanLne = m4m.math.vec2Dot(dirTan, lineHitP1);
                m4m.math.vec2ScaleByNum(dirTan, -tanLne, dirTan);
                m4m.math.vec2Add(dirTan, hitPoint, outTangentP);

                m4m.poolv2_del(dirTan);
                m4m.poolv2_del(lineHitP1);
            }
        }

        m4m.poolv2_del(hitPoint);
        m4m.poolv2_del(tempHitPoint);
        if (tempNormal) { m4m.poolv2_del(tempNormal); }
        if (tempHitP2) { m4m.poolv2_del(tempHitP2); }

        return result;
    }

    private static hasHitByline(p0: m4m.math.vector2, p1: m4m.math.vector2) {
        let _map = this._ObsGridMap;
        let _grid = _map[this._currObsName] as Grid2D;
        if (!_grid) { return false; }
        let _pmap = this._ObsPolygonsMap;
        let _arr = _pmap[this._currObsName];
        let uintArr = this.helpNumReuseArr;
        _grid.getByLine(p0, p1, uintArr);
        let len = uintArr.length;
        for (let i = 0; i < len; i++) {
            let id = uintArr.get(i);
            let p = _arr[id];
            if (!p || !p.active) { continue; }
            let isHited = false;
            isHited = p.hasLineIntersection(p0, p1);
            if (isHited) { return true; }
        }
    }

    /**
     * 碰撞 传播检测
     * @param p0 
     * @param p1 
     * @param outPoint 输出点
     */
    private static transmitCollision(p0: m4m.math.vector3, p1: m4m.math.vector2, outPoint: m4m.math.vector2): boolean {
        let result = false;
        let _p0 = m4m.poolv2(p0);
        m4m.math.vec2Set(_p0, p0.x, p0.z);
        let _p1 = m4m.poolv2(p1);
        result = this.hitTestByLine(_p0, _p1, outPoint, SceneObstacleMgr.hitMixGap);
        if (!result) {
            m4m.math.vec2Clone(_p1, outPoint);
        }

        //clear
        m4m.poolv2_del(_p0);
        m4m.poolv2_del(_p1);
        return result;
    }

    /** 调试测试 */
    private static debugTest() {
        if (!this._currObsName) { return; }
        let p0 = this.helpV2;
        let p1 = this.helpV2v1;
        let v3 = this.helpV3;
        m4m.math.vec2Set(p0, -1, 8);
        m4m.math.vec2Set(p1, -1 + 5, 8 + 6.2);
        this.calcLineCollisionPoint(p0, p1, v3);
    }

    /** 调试绘制 */
    private static debugDraw() {
        if (!this._currObsName) { return; }
        let _cam = m4m.framework.sceneMgr.scene.mainCamera;
        let _canvas = metaUIManager.ActiveSelf.overlay.canvas;
        //绘制 所有多边形障碍
        let _map = this._ObsPolygonsMap;
        let _arr = _map[this._currObsName];
        if (!_arr) { return; }
        let len = _arr.length;
        let uiPoints: m4m.math.vector2[] = [];
        let v3 = this.helpV3;
        for (let i = 0; i < len; i++) {
            let p = _arr[i];
            let pointsLen = p.points.length;
            for (let j = 0; j < pointsLen; j++) {
                let pPoint = p.points[j];
                let v2 = m4m.poolv2();
                m4m.math.vec3Set(v3, pPoint.x, 0, pPoint.y);
                commTool.calcuUIPosBy3DPos(_cam, _canvas, v3, v2);
                uiPoints.push(v2);
            }
            //draw
            DebugLineTool2d.drawPoints(uiPoints, 3, 1, 1, true);
            //clear
            uiPoints.forEach((val) => {
                m4m.poolv2_del(val);
            });
            uiPoints.length = 0;
        }

        //碰撞线段
        let uiP0 = this.helpV2;
        let uiP1 = this.helpV2v1;
        let _dvpLen = this._debugVelPoints.length;
        for (let i = 0; i < _dvpLen; i += 2) {
            let _velP0 = this._debugVelPoints[i];
            let _velP1 = this._debugVelPoints[i + 1];
            commTool.calcuUIPosBy3DPos(_cam, _canvas, _velP0, uiP0);
            commTool.calcuUIPosBy3DPos(_cam, _canvas, _velP1, uiP1);
            //绘制 当前的碰撞 line
            DebugLineTool2d.drawLine(uiP0, uiP1, 3, 4, 1);

            //clear
            m4m.poolv3_del(_velP0);
            m4m.poolv3_del(_velP1);
        }
        this._debugVelPoints.length = 0;

        let v2Hit = this.helpV2v2;
        let v2Nv = this.helpV2v3;
        let v3NVect = this.helpV3v1;
        //碰撞点
        let pointslen = this._debugHitPoints.length;
        for (let i = 0; i < pointslen; i++) {
            let t = this._debugHitPoints[i];
            commTool.calcuUIPosBy3DPos(_cam, _canvas, t, v2Hit);
            DebugLineTool2d.drawCircle(v2Hit, 4, 3, 0, 1, 6);
            if (i != 0) { continue; }
            //法线
            let n = this._debugHitNormal;
            m4m.math.vec3Set(v3NVect, n.x, 0, n.y);
            m4m.math.vec3ScaleByNum(v3NVect, 5, v3NVect);
            m4m.math.vec3Add(t, v3NVect, v3NVect);
            commTool.calcuUIPosBy3DPos(_cam, _canvas, v3NVect, v2Nv);
            DebugLineTool2d.drawLine(v2Hit, v2Nv, 3, 5, 1);
        }
        let lp0V2 = this.helpV2v4;
        let lp1V2 = this.helpV2v5;
        //运动线
        let lineLen = this._debugMoveLines.length;
        for (let i = 0; i < lineLen; i += 2) {
            let _LP0 = this._debugMoveLines[i];
            commTool.calcuUIPosBy3DPos(_cam, _canvas, _LP0, lp0V2);
            let _LP1 = this._debugMoveLines[i + 1];
            commTool.calcuUIPosBy3DPos(_cam, _canvas, _LP1, lp1V2);
            DebugLineTool2d.drawLine(lp0V2, lp1V2, 3, i % 5, 1);
        }
    }

    private static update(dt: number) {
        //test
        // this.debugTest();
        //--------

        if (GameMgr.Draw2dDebug) {
            this.debugDraw();
        }
    }
}