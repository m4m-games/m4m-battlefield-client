import { gameMathUtil } from "Tools/gameMathUtil";

type vector2 = m4m.math.vector2;

/**
 * 场景2d 多边形障碍
 */
export class PolygonObstacle {
    constructor(data: number[]) {
        this._points = [];
        let len = data.length;
        if (len % 2 == 1) {
            console.error(`数据长度为 奇数！`);
            return;
        }

        let minX = Number.POSITIVE_INFINITY;
        let minY = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < len; i += 2) {
            let v2 = new m4m.math.vector2(data[i], data[i + 1]);
            this._points.push(v2);
            minX = v2.x < minX ? v2.x : minX;
            minY = v2.y < minY ? v2.y : minY;
            maxX = v2.x > maxX ? v2.x : maxX;
            maxY = v2.y > maxY ? v2.y : maxY;
        }
        this._aabb = new m4m.math.rect(minX, minY, maxX - minX, maxY - minY);
    }

    private static readonly helpV2 = new m4m.math.vector2();
    private static readonly helpV2v1 = new m4m.math.vector2();
    private static readonly helpV2v2 = new m4m.math.vector2();
    private static readonly helpV2v3 = new m4m.math.vector2();
    private static readonly helpV2v4 = new m4m.math.vector2();
    private static readonly helpV2v5 = new m4m.math.vector2();

    private _active: boolean = true;
    private _points: vector2[];
    private _aabb: m4m.math.rect;

    /** 获取点s */
    public get points() { return this._points; }
    /** aabb*/
    public get aabb() { return this._aabb; }
    /** 激活中*/
    public get active() { return this._active; }
    public set active(val: boolean) { this._active = val; }

    //通过点
    public hitTestPoint(point: vector2) {

    }

    /**
     * 通过线段 碰撞测试
     * @param p0 线段 开始点
     * @param p1 线段 结束点
     * @param outHitPoint   返回的碰撞点
     * @param outHitNormal  返回的碰撞点法线
     * @param outHitP2  返回的相交边上的点
     */
    public hitTestLine(p0: vector2, p1: vector2, outHitPoint?: vector2, outHitNormal?: vector2, outHitP2?: vector2): boolean {
        let result = false;
        if (!p0 || !p1) { return false; }
        let len = this._points.length;
        if (len <= 1) { return false; }
        let hitPoint = PolygonObstacle.helpV2;
        let tempV2 = PolygonObstacle.helpV2v1;
        let _hitP2 = PolygonObstacle.helpV2v2;
        let _hitP3 = PolygonObstacle.helpV2v3;
        for (let i = 0; i < len; i++) {
            //检测每条边 
            // tslint:disable-next-line: one-variable-per-declaration
            let p2: vector2, p3: vector2;
            p2 = this._points[i];
            p3 = this._points[(i + 1) % len];
            let b = this.lineIntersection(p0, p1, p2, p3, tempV2);
            if (!b) { continue; }
            if (!outHitPoint) { return true; }
            //获取最近碰撞点
            if (result && gameMathUtil.vec2DisSqr(p0, hitPoint) <= gameMathUtil.vec2DisSqr(p0, tempV2)) {
                continue;
            }
            result = true;
            m4m.math.vec2Clone(tempV2, hitPoint);
            m4m.math.vec2Clone(p2, _hitP2);
            m4m.math.vec2Clone(p3, _hitP3);
        }

        if (!result) { return false; }

        m4m.math.vec2Clone(hitPoint, outHitPoint);
        //计算法线 
        if (outHitNormal) {
            let _v2P23 = PolygonObstacle.helpV2v4;
            let _v2hitP0 = PolygonObstacle.helpV2v5;
            m4m.math.vec2Subtract(p0, outHitPoint, _v2hitP0);
            m4m.math.vec2Subtract(_hitP3, _hitP2, _v2P23);
            m4m.math.vec2Normalize(_v2P23, _v2P23);
            let angle = gameMathUtil.calcAngleByVec(_v2P23.x, _v2P23.y, true);
            m4m.math.vec2Set(outHitNormal, Math.sin(angle), Math.cos(angle));
            if (m4m.math.vec2Dot(_v2hitP0, outHitNormal) < 0) {
                m4m.math.vec2ScaleByNum(outHitNormal, -1, outHitNormal);
            }
        }
        if (outHitP2) {
            m4m.math.vec2Clone(_hitP2, outHitP2);
        }
        return result;
    }

    /**
     * 是否与 选段相交
     * @param p0 线段 开始点
     * @param p1 线段 结束点
     * @returns 
     */
    public hasLineIntersection(p0: vector2, p1: vector2): boolean {
        if (!p0 || !p1) { return false; }
        let len = this._points.length;
        if (len <= 1) { return false; }
        for (let i = 0; i < len; i++) {
            //检测每条边 
            // tslint:disable-next-line: one-variable-per-declaration
            let p2: vector2, p3: vector2;
            p2 = this._points[i];
            p3 = this._points[(i + 1) % len];
            let b = this.lineIntersection(p0, p1, p2, p3);
            if (b) { return true; }
        }
        return false;
    }

    /**
     * 线段相交检测
     * @param p1 线段一 开始点
     * @param p2 线段一 结束点
     * @param p3 线段二 开始点
     * @param p4 线段二 结束点
     * @param interPoint 线段相交点
     */
    private lineIntersection(p0: vector2, p1: vector2, p2: vector2, p3: vector2, interPoint?: vector2): boolean {
        // tslint:disable-next-line: one-variable-per-declaration
        let s1x: number, s1y: number, s2x: number, s2y: number;
        s1x = p1.x - p0.x; s1y = p1.y - p0.y;
        s2x = p3.x - p2.x; s2y = p3.y - p2.y;

        // tslint:disable-next-line: one-variable-per-declaration
        let s: number, t: number;
        s = (-s1y * (p0.x - p2.x) + s1x * (p0.y - p2.y)) / (-s2x * s1y + s1x * s2y);
        t = (s2x * (p0.y - p2.y) - s2y * (p0.x - p2.x)) / (-s2x * s1y + s1x * s2y);

        if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
            // Collision detected
            if (interPoint) {
                interPoint.x = p0.x + (t * s1x);
                interPoint.y = p0.y + (t * s1y);
            }
            return true;
        }

        return false; // No collision
    }

}