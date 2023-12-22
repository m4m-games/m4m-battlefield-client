import { ReuseArray } from "Data/ReuseArray";

/**
 * 网格 容器
 * （用于2d空间网格分割）
 */
export class Grid2D {
    constructor(unitSize: number) {
        this._unitSize = unitSize;
    }
    private static readonly helpStrArr: ReuseArray<string> = new ReuseArray<string>();

    /** 去重map */
    private _filterRepeatMap: { [id: number]: number } = {};
    private _puCount = 0;
    /** 单元尺寸 */
    private _unitSize: number;
    /** 单元存 id列表 */
    private _unitIDsMap: { [key: string]: number[] } = {};
    /**
     * 添加 矩形
     * @param rect 矩形 
     * @param id 矩形ID
     */
    public addRect(rect: m4m.math.rect, id: number) {
        let _arr = Grid2D.helpStrArr;
        _arr.length = 0;
        this.getUnitByRect(rect, _arr);

        for (let i = 0; i < _arr.length; i++) {
            let unitKey = _arr.get(i);
            let arr = this._unitIDsMap[unitKey];
            if (!arr) {
                arr = this._unitIDsMap[unitKey] = [];
            }
            arr.push(id);
        }
    }

    public getPolygon(unitList: ReuseArray<number>) {

    }

    /**
     * 获取 通过位置坐标
     * @param pos 平面点 坐标
     * @param outData 多边形（id） 列表
     * @returns boolean : 是否有获取到数据
     */
    public getByPos(pos: m4m.math.vector2, outData: ReuseArray<number>): boolean {
        let result = false;
        this.getUnitByPoint(pos);

        return result;
    }

    public getByLine(p0: m4m.math.vector2, p1: m4m.math.vector2, outData: ReuseArray<number>) {
        let _arr = Grid2D.helpStrArr;
        this.getUnitByLine(p0, p1, _arr);
        this.getPolygonByUints(_arr, outData);
    }

    private getPolygonByUints(uints: ReuseArray<string>, outData: ReuseArray<number>) {
        outData.length = 0;
        this._puCount++;
        let len = uints.length;
        let _map = this._unitIDsMap;
        let _fMap = this._filterRepeatMap;
        for (let i = 0; i < len; i++) {
            let key = uints.get(i);
            let arr = _map[key];
            if (!arr) { continue; }
            let len1 = arr.length;
            for (let j = 0; j < len1; j++) {
                let id = arr[j];
                //map 去重
                if (_fMap[id] && _fMap[id] == this._puCount) { continue; }
                _fMap[id] = this._puCount;
                outData.push(id);
            }
        }
    }

    /**
     * 获取 unitPos 通过 线段
     * @param p0 线段开始点
     * @param p1 线段结束点 
     * @param outData 格子的单元坐标Key 列表
     */
    private getUnitByLine(p0: m4m.math.vector2, p1: m4m.math.vector2, outData: ReuseArray<string>) {
        let minX = Math.min(p0.x, p1.x);
        let minY = Math.min(p0.y, p1.y);
        let maxX = Math.max(p0.x, p1.x);
        let maxY = Math.max(p0.y, p1.y);
        this.getUintByRange(minX, minY, maxX, maxY, outData);
    }

    /**
     * 获取 unitPos 通过 Rect
     * @param rect 矩形
     * @param outData 输出 数据
     */
    private getUnitByRect(rect: m4m.math.rect, outData: ReuseArray<string>) {
        this.getUintByRange(rect.x, rect.y, rect.x + rect.w, rect.y + rect.h, outData);
    }

    private getUintByRange(minX: number, minY: number, maxX: number, maxY: number, outData: ReuseArray<string>) {
        outData.length = 0;
        let _s = this._unitSize;
        let gridMinX = Math.floor(minX / _s);
        let gridMinY = Math.floor(minY / _s);
        let gridMaxX = Math.floor(maxX / _s);
        let gridMaxY = Math.floor(maxY / _s);

        let xCount = gridMaxX - gridMinX + 1;
        let yCount = gridMaxY - gridMinY + 1;
        for (let y = 0; y < yCount; y++) {
            for (let x = 0; x < xCount; x++) {
                outData.push(`${gridMinX + x}_${gridMinY + y}`);
            }
        }
    }

    /**
     * 获取 unitPos 通过 Rect
     * @param point 
     */
    private getUnitByPoint(point: m4m.math.vector2): string {
        let _s = this._unitSize;
        return `${Math.floor(point.x / _s)}_${Math.floor(point.y / _s)}`;
    }
}