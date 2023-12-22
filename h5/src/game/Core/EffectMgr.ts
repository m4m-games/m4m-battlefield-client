import { cMap } from "Data/Map";
import { f14EffectSystem } from "Loader/otherPlan/dataType/f14EffectSystem";
import { FrameTimer } from "Time/FrameTimer";
import { TimeUtil } from "Time/TimeUtil";
import { commTool } from "Tools/commTool";
import { ISpParticleSystem, ISpTransform, spComponentType } from "Tools/engineParallel/spInterface";
import { GameMgr } from "../GameMgr";
import { PoolMgr } from "./PoolMgr";
import { Nullable } from "./types";
type vector3 = m4m.math.vector3;
type adjustEffect = { offsetPos: Nullable<vector3>, offsetScale: Nullable<vector3>, offsetEuler: Nullable<vector3>, enableCulling: boolean };
/** 特效资源列表 */
class EffectTypes {
    public "fx_pp" = "";
    public "fx_cs" = "";
    public "fx_UI_lq" = "";
    public "Bullet_bingzhui" = "";
    public "Com_chongsheng" = "";
    public "Com_nenglianghudun" = "";
    public "Com_shengminghudunA" = "";
    public "Eff_baoqi1" = "";
}

/** 特效管理器 */
export class EffectMgr {
    public static effRoot: ISpTransform;
    private static readonly helpV3Zero = new m4m.math.vector3(0, 0, 0);
    private static readonly helpV3 = new m4m.math.vector3();
    private static readonly helpQuat = new m4m.math.quaternion();
    private static effMap: cMap<ISpTransform> = new cMap();
    private static guid = -1;
    // tslint:disable-next-line: max-line-length
    private static adjustMap: cMap<adjustEffect> = new cMap();
    /**
     * 游戏特效 管理器
     * @param effRoot 特效root 节点
     * @param resPath 资源路径
     */
    public static init(effRoot: ISpTransform) {
        this.effRoot = effRoot;
        let effects = new EffectTypes();
        for (let key in effects) {
            effects[key] = key;     //字段名 赋给 字段作为值
        }

        //设置各种特效的 初始偏移数据
        this.adjustMap.set(effects.fx_pp, { offsetPos: null, offsetScale: null, offsetEuler: null, enableCulling: true });
        this.adjustMap.set(effects.Eff_baoqi1, { offsetPos: new m4m.math.vector3(0, -0.5, 0), offsetScale: new m4m.math.vector3(1.5, 1.5, 1.5), offsetEuler: null, enableCulling: true });
        this.adjustMap.set(effects.fx_cs, { offsetPos: null, offsetScale: null, offsetEuler: null, enableCulling: true });
        this.adjustMap.set(effects.Com_shengminghudunA, { offsetPos: new m4m.math.vector3(0, 1.2, 0), offsetScale: new m4m.math.vector3(2.5, 2.5, 2.5), offsetEuler: null, enableCulling: true });
        this.adjustMap.set(effects.Com_nenglianghudun, { offsetPos: new m4m.math.vector3(0, 1.2, 0), offsetScale: new m4m.math.vector3(2.5, 2.5, 2.5), offsetEuler: null, enableCulling: true });
        // this.adjustMap.set("Bullet_bingzhui", { offsetPos: null, offsetScale: null, offsetEuler: new m4m.math.vector3(0, 90, 0), enableCulling: true });
    }
    /** 获取一个 特效对象 */
    public static async getEffBuyName(effectName: string) {
        let effTrans = await this.getEff(effectName);
        return effTrans;
    }
    /** 获取一个 特效对象 */
    private static async getEff(effectName: string) {
        //池中取出一个
        let effTrans = await PoolMgr.effectMPool.newObj(effectName, GameMgr.effectPath, GameMgr.engineParallel);

        // set adjust effset
        let offsetD = this.adjustMap.get(effectName);
        if (!offsetD) { return effTrans; }

        // if (offsetD.offsetPos) {
        //     m4m.math.vec3Clone(offsetD.offsetPos, effTrans.localPosition);
        //     effTrans.localPosition = effTrans.localPosition;
        // }
        // if (offsetD.offsetScale) {
        //     m4m.math.vec3Clone(offsetD.offsetScale, effTrans.localScale);
        //     effTrans.localScale = effTrans.localScale;
        // }
        // let _euler = offsetD.offsetEuler;
        // if (_euler) {
        //     m4m.math.quatFromEulerAngles(_euler.x, _euler.y, _euler.z, effTrans.localRotate);
        //     effTrans.localRotate = effTrans.localRotate;
        // }
        effTrans.enableCulling = offsetD.enableCulling;
        return effTrans;
    }
    /**
     * 修改颜色（待补完）
     * @param _guid 
     * @param color 
     * @param color2 
     */
    public static changeColor(_guid: number, color: m4m.math.color) {
        let effTrans = this.effMap.get(_guid);
        if (!effTrans) { return; }
        // eff.stop();
        let effs = this.getParticleSystems(effTrans);
        effs.forEach((v) => {
            // m4m.math.colorClone(color, v.main.startColor.color);
            v.setColor(color);
        });
    }
    /** 修改缩放 */
    public static changeScale(_guid: number, scale: number) {
        let effTrans = this.effMap.get(_guid);

        if (!effTrans) { return; }
        // eff.stop();
        m4m.math.vec3SetAll(effTrans.localScale, scale);
        effTrans.setWorldScale(effTrans.localScale);
    }
    /**
     * 播放 粒子 特效 （返回一个 唯一标记id）
     * @param effectName 特效名
     * @param pos 位置
     * @param beAttatchTrans 挂载到哪个transform
     * @param scale 缩放
     */
    public static async setPlay<K extends keyof EffectTypes>(effectName: K,
                                                             pos: vector3,
                                                             scale: number = 1,
                                                             _euler: vector3 = null,
                                                             beAttatchTrans: ISpTransform = null,
                                                             color: m4m.math.color = null,
                                                             loop: boolean = false): Promise<number> {
        let tempPos = m4m.poolv3(pos);
        let tempEuler: m4m.math.vector3 = null;
        if (_euler) { tempEuler = m4m.poolv3(_euler); }
        let effTrans = await this.getEff(effectName);

        //循环
        if (loop) {
            //console.error("特效effTrans", effTrans);
            let gameObject: m4m.framework.gameObject = effTrans.rawHandle.gameObject;
            let f = gameObject.getComponent("f14EffectSystem") as m4m.framework.f14EffectSystem;
            f.data.beloop = true;
        }

        //挂载到root
        let attatchRoot = beAttatchTrans != null ? beAttatchTrans : this.effRoot;
        attatchRoot.addChild(effTrans);

        // guid make
        let _currID = ++this.guid;
        this.effMap.set(_currID, effTrans);

        //playEnd reg
        let effs = this.getParticleSystems(effTrans);
        effs.forEach((v) => {
            v.play(() => {
                this.onPlayEnd(_currID);
            });
            if (color != null) {
                v.setColor(color);
                // m4m.math.colorClone(color, v.main.startColor.color);
            }
        });

        //set transform 
        //位置
        this.setPostion(_currID, tempPos);
        //缩放
        this.setScale(_currID, scale);
        //旋转
        let tempQ = EffectMgr.helpQuat;
        if (!tempEuler) {
            tempEuler = EffectMgr.helpV3Zero;
        }
        m4m.math.quatFromEulerAngles(tempEuler.x, tempEuler.y, tempEuler.z, tempQ);
        this.setRotate(_currID, tempQ);

        //v3 to pool
        m4m.poolv3_del(tempPos);
        if (tempEuler != EffectMgr.helpV3Zero) { m4m.poolv3_del(tempEuler); }

        return _currID;
    }

    /**
     * 停止播放
     * @param _guid 
     */
    public static setStop(_guid: number) {
        let effTrans = this.effMap.get(_guid);
        if (!effTrans) { return; }
        // eff.stop();
        let effs = this.getParticleSystems(effTrans);
        effs.forEach((v) => {
            v.stop();
        });
        // console.error("播放特效 " + effTrans.name + "   " + effTrans.getWorldPosition().toString() + "   ");
    }
    /**
     * 用真实时间播放特效
     * @param _guid 
     */
    public static realUpdata(_guid: number) {
        let effTrans = this.effMap.get(_guid);
        if (!effTrans) { return; }
        // eff.stop();
        let effs = this.getParticleSystems(effTrans);
        effs.forEach((v) => {
            let fs = (v.rawHandle as m4m.framework.effectSystem);
            fs.update(TimeUtil.realDeltaTime);
        });
        // console.error("播放特效 " + effTrans.name + "   " + effTrans.getWorldPosition().toString() + "   ");
    }

    /**
     * 特效layer 改变
     * @param _guid 
     * @param layer 
     */
    public static effectLayerChange(_guid: number, layer: number) {
        let effTrans = this.effMap.get(_guid);
        if (!effTrans) { return; }
        commTool.changeLayerGUI(effTrans, layer);
    }
    /**
     * 获取特效组件
     * @param effTrans 
     */
    private static getParticleSystems(effTrans: ISpTransform) {
        let eff = effTrans.gameObject.getComponents(spComponentType.particleSystem) as ISpParticleSystem[];
        return eff;
    }

    /**
     * 清除一个特效
     * @param _guid 
     */
    public static removeOne(_guid: number) {
        let effTrans = this.effMap.get(_guid);
        if (!effTrans) { return; }
        PoolMgr.effectMPool.deleteObj(effTrans);
        this.effMap.delete(_guid);

    }

    /**
     * 清除所有的特效
     */
    public static clearAll() {
        let arr: number[] = [];
        this.effMap.forEach((v, k) => {
            if (v) {
                v.gameObject.visible = false;
                arr.push(Number(k));
            }
        });

        let len = arr.length;
        for (let i = 0; i < len; i++) {
            //全释放
            this.removeOne(arr[i]);
        }
        this.effMap.clear();
        //
        let keys = Object.keys(this.playEndMap);
        keys.forEach((k) => {
            delete this.playEndMap[k];
        });
    }

    /**
     * 倒计时 删除
     * @param _guid id
     * @param life 时间
     */
    public static countDownRemove(_guid: number, life: number) {
        FrameTimer.Instance.once(life, (dt, isEnd) => {
            if (isEnd) {
                this.removeOne(_guid);
            }
        });
    }

    /**
     * 注册指定特效对象（guid） 播放完毕后回调删除
     * @param _guid id
     * @param callBack 结束后回调 
     */
    public static onPlayEndRemove(_guid: number, callBack: Nullable<Function> = null) {
        let tran = this.effMap.get(_guid);
        if (!tran) { return; }
        this.playEndMap[_guid] = callBack;
    }
    /**
     * 设置 特效朝向
     * @param _guid id
     * @param pos 
     */
    public static lookAt(_guid: number, lookPos: m4m.math.vector3) {
        let tran = this.effMap.get(_guid);
        if (!tran) { return; }
        let finalQuat = tran.localRotate;
        //offset 检查
        let hasOffset = false;
        let _euler: m4m.math.vector3;
        let offsetD = this.adjustMap.get(tran.name);
        if (offsetD && offsetD.offsetEuler) {
            _euler = offsetD.offsetEuler;
            hasOffset = true;
        }
        tran.lookatPoint(lookPos);
        if (hasOffset) {
            let tempQ = EffectMgr.helpQuat;
            m4m.math.quatFromEulerAngles(_euler.x, _euler.y, _euler.z, tempQ);
            m4m.math.quatMultiply(tempQ, finalQuat, finalQuat);
        }
        // else {
        // finalQuat = rotate;
        // m4m.math.quatClone(rotate,finalQuat);
        // }
        tran.localRotate = finalQuat;
    }
    public static getPostion(_guid: number, out: m4m.math.vector3) {
        let tran = this.effMap.get(_guid);
        if (!tran) { return; }
        m4m.math.vec3Clone(tran.localPosition, out);
    }
    public static getForward(_guid: number, out: m4m.math.vector3) {
        let tran = this.effMap.get(_guid);
        if (!tran) { return; }
        tran.getForwardInWorld(out);
    }
    public static getRight(_guid: number, out: m4m.math.vector3) {
        let tran = this.effMap.get(_guid);
        if (!tran) { return; }
        tran.getRightInWorld(out);
    }
    public static getUp(_guid: number, out: m4m.math.vector3) {
        let tran = this.effMap.get(_guid);
        if (!tran) { return; }
        tran.getUpInWorld(out);
    }
    /**
     * 设置 特效位置
     * @param _guid id
     * @param pos 
     */
    public static setPostion(_guid: number, pos: m4m.math.vector3) {
        let tran = this.effMap.get(_guid);
        if (!tran) { return; }
        let finalPos = tran.localPosition;
        //offset 检查
        let hasOffset = false;
        let _pos: m4m.math.vector3;
        let offsetD = this.adjustMap.get(tran.name);
        if (offsetD && offsetD.offsetPos) {
            _pos = offsetD.offsetPos;
            hasOffset = true;
        }

        if (hasOffset) {
            m4m.math.vec3Add(pos, _pos, finalPos);
        } else {
            // finalPos = pos;
            m4m.math.vec3Clone(pos, finalPos);
        }
        tran.localPosition = finalPos;
    }

    /**
     * 设置 特效旋转
     * @param _guid 
     * @param rotate 
     * @returns 
     */
    public static setRotate(_guid: number, rotate: m4m.math.quaternion) {
        let tran = this.effMap.get(_guid);
        if (!tran) { return; }
        let finalQuat = tran.localRotate;
        //offset 检查
        let hasOffset = false;
        let _euler: m4m.math.vector3;
        let offsetD = this.adjustMap.get(tran.name);
        if (offsetD && offsetD.offsetEuler) {
            _euler = offsetD.offsetEuler;
            hasOffset = true;
        }
        if (hasOffset) {
            let tempQ = EffectMgr.helpQuat;
            m4m.math.quatFromEulerAngles(_euler.x, _euler.y, _euler.z, tempQ);
            m4m.math.quatMultiply(tempQ, rotate, finalQuat);
        } else {
            // finalQuat = rotate;
            m4m.math.quatClone(rotate, finalQuat);
        }
        tran.localRotate = finalQuat;
    }
    /**
    * 设置 特效缩放
    * @param _guid 
    * @param rotate 
    * @returns 
    */
    public static setScale(_guid: number, scale: number) {
        let tran = this.effMap.get(_guid);
        if (!tran) { return; }
        let finalScale = tran.localScale;
        //offset 检查
        let hasOffset = false;
        let _scale: m4m.math.vector3;
        let offsetD = this.adjustMap.get(tran.name);
        if (offsetD && offsetD.offsetScale) {
            _scale = offsetD.offsetScale;
            hasOffset = true;
        }

        if (hasOffset) {
            m4m.math.vec3ScaleByNum(_scale, scale, finalScale);
        } else {
            m4m.math.vec3SetAll(finalScale, scale);
        }

        tran.localScale = finalScale;
    }

    private static playEndMap: { [guid: number]: Nullable<Function> } = {};

    private static onPlayEnd(_guid: number) {
        let fun = this.playEndMap[_guid];
        delete this.playEndMap[_guid];
        this.removeOne(_guid);
        if (fun) {
            fun();
        }
    }
}