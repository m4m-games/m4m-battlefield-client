//---------------------------------接口--------------------------------------------

import { cMap } from "Data/Map";
import { commTool } from "Tools/commTool";
import { engineParallelType, ISpPrefab, ISpTransform } from "Tools/engineParallel/spInterface";
import { GameMgr } from "../GameMgr";
export interface IDataClass {
    /** 重置 */
    reset();
}

//对象 池 接口
interface IPool<T> {
    /** 从池 获取一个新对象 */
    newObj(...parameter): T;
    /** 释放一个新对象到池 */
    deleteObj(obj: T);
}

//异步对象 池 接口
interface IPoolPromise<T> {
    /** 从池 获取一个新对象 ， 异步 返回 Promise */
    newObj(...parameter): Promise<T>;
    /** 释放一个新对象到池 */
    deleteObj(obj: T);
}

function typeParallel(engineType: engineParallelType) {
    let eType: engineParallelType = engineType != null ? engineType : GameMgr.engineParallel;
    return eType;
}

function urlParallel(prefabName: string, path: string, eType: engineParallelType) {
    let url: string;
    switch (eType) {
        case engineParallelType.none: url = `${path}${prefabName}/${prefabName}.assetbundle.json`; break;
        case engineParallelType.wxEngine:
            let isShell = GameMgr.wxResHasShell(path);
            url = isShell ? `${path}${prefabName}/resources/${prefabName}.prefab` : `${path}${prefabName}.prefab`;
            break;
        default: url = "";
    }
    return url;
}

//---------------------------------各 池处理类--------------------------------------------

/** 3d 预制体 对象池 */
class Prefab3dPool implements IPoolPromise<ISpTransform>{
    protected static readonly InPool = "_InPool_";
    private static readonly tagP3dPoolURL = "_tagP3dPool_URL_";
    private poolArrMap: cMap<ISpTransform[]> = new cMap();

    public newObj(prefabURL: string): Promise<ISpTransform> {
        return this.getObj(prefabURL);
    }

    public deleteObj(obj: ISpTransform) {
        if (!obj) { return false; }
        if (obj[Prefab3dPool.InPool]) { return false; }  //已经在 池 中了 ， 避免重复入池

        obj.gameObject.visible = true;
        //还原处理
        if (obj.getParent()) {
            obj.getParent()
                .removeChild(obj);
        }
        //入池
        let url = obj[Prefab3dPool.tagP3dPoolURL];
        if (!url) {
            console.error(` 这个对象不是从池里取出来的 ，不能放入池中 ，因为 URL 未知  `);
            return false;
        }
        let poolArr = this.getPoolArr(url);
        poolArr.push(obj);

        obj[Prefab3dPool.InPool] = true;
        return true;
    }

    /** 清理池中所有的对象 */
    public clearAll() {
        // this.poolArrMap.forEach((val)=>{
        //     if(val) val.length = 0;
        // });
        this.poolArrMap.clear();
    }

    protected getObj(prefabURL: string, engineType?: engineParallelType) {
        return new Promise<ISpTransform>((resolve, reject) => {
            let eType: engineParallelType = engineType != null ? engineType : GameMgr.engineParallel;
            let poolArr = this.getPoolArr(prefabURL);
            if (poolArr.length > 0) {
                let _t = poolArr.pop() as ISpTransform;
                _t[Prefab3dPool.InPool] = false;
                resolve(_t);
            } else {
                //选择加载方法
                let loadFun: (prefabURL: string) => Promise<ISpPrefab>;
                switch (eType) {
                    case engineParallelType.none: loadFun = commTool.loadPrefebURL.bind(commTool); break;
                    case engineParallelType.wxEngine: loadFun = commTool.loadPrefebURLWXEngin.bind(commTool); break;
                    default: loadFun = commTool.loadPrefebURL.bind(commTool);
                }

                //加载
                loadFun(prefabURL)
                    .then((pfb) => {
                        if (!pfb) {
                            console.error(`loadPrefeb fial : ${prefabURL} `);
                            reject();
                            return;
                        }
                        let tran = pfb.getCloneTrans();
                        //保存prefabName
                        tran[Prefab3dPool.tagP3dPoolURL] = prefabURL;
                        tran[Prefab3dPool.InPool] = false;
                        resolve(tran);
                    });
            }
        });
    }

    private getPoolArr(prefabURL: string) {
        let poolArr = this.poolArrMap.get(prefabURL);
        if (!poolArr) {
            poolArr = [];
            this.poolArrMap.set(prefabURL, poolArr);
        }
        return poolArr;
    }

}
/** 特效 对象池 */
class EffectModlePool extends Prefab3dPool {
    public newObj(prefabName: string, path = `${GameMgr.effectPath}`, engineType?: engineParallelType): Promise<ISpTransform> {
        let _engineType = engineType as engineParallelType;
        let eType = typeParallel(_engineType);
        let url: string = urlParallel(prefabName, path, eType);

        // if (GameMgr.forceClearScene && !memoryClearMgr.PoolIgnores[prefabName]) {  //记录流过的资源
        //     memoryClearMgr.poolEffectResMap.set(url, true);
        // }
        // return super.new_Obj(url);
        return this.getObj(url, eType);
    }
    public deleteObj(obj: ISpTransform) {
        let result = super.deleteObj(obj);
        if (!result || obj == null) { return false; }
        m4m.math.vec3SetAll(obj.localScale, 1); //重置缩放 1
        obj.localScale = obj.localScale;
        return true;
    }
}

/** 普通模型 对象池 */
class BaseModlePool extends Prefab3dPool {
    public newObj(prefabName: string, path: string = `${GameMgr.rolePath}`, engineType?: engineParallelType): Promise<ISpTransform> {
        let _engineType = engineType as engineParallelType;
        let eType = typeParallel(_engineType);
        let url: string = urlParallel(prefabName, path, eType);

        // if (GameMgr.forceClearScene && !memoryClearMgr.PoolIgnores[prefabName]) {  //记录流过的资源
        //     memoryClearMgr.poolBaseResMap.set(url, true);
        // }
        // return super.new_Obj(url);
        return this.getObj(url, eType);
    }
    public deleteObj(obj: ISpTransform) {
        let result = super.deleteObj(obj);
        return (result && obj != null);
    }
}

//------------------------------------数据类池--------------------------------------------------------

// tslint:disable-next-line: max-classes-per-file
class DataClassPool implements IPool<IDataClass>{
    private poolArrMap: cMap<IDataClass[]> = new cMap();
    public newObj(classobj: any): IDataClass {
        let result;
        let objName = classobj.name;
        let poolArr = this.getPoolArr(objName);
        if (poolArr.length > 0) {
            result = poolArr.pop() as any;
            return result;
        }
        let pfb = new classobj();
        if (!pfb) {
            console.error(`_dataClassPool load fial ! `);
            return result;
        }
        return pfb;
    }

    public deleteObj(obj: IDataClass) {
        if (!obj) { return false; }
        let objName = Object.getPrototypeOf(obj).constructor.name;
        let poolArr = this.getPoolArr(objName);
        poolArr.push(obj);
        obj.reset();
    }
    private getPoolArr(objName: string) {
        let poolArr = this.poolArrMap.get(objName);
        if (!poolArr) {
            poolArr = [];
            this.poolArrMap.set(objName, poolArr);
        }
        return poolArr;
    }

}

//------------------------------------项目对象池管理类-------------------------------------------------

/**
 * 项目对象池管理类
 */
// tslint:disable-next-line: max-classes-per-file
export class PoolMgr {
    //对象池初始 

    /** 基本模型池 */
    public static readonly baseModlePool = new BaseModlePool();
    /** 特效的对象池 */
    public static readonly effectMPool = new EffectModlePool();
    /** 数据类池 */
    public static readonly dataClassPool = new DataClassPool();

    // static test() {
    //     let a = this.spawnedModlePool.new_Obj("");
    //     // this.fishPool.delete_Obj();
    // }

}