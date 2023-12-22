import { ReuseArray } from "Data/ReuseArray";
import { EventMgr } from "eventMgr";
import { SceneHideEvent } from "events/sceneHideEvent";
import { SceneShowEvent } from "events/sceneShowEvent";
import { SceneType, SceneVisualEvent } from "events/sceneVisualEvent";
import { SceneBase } from "SceneBase";
import { commTool } from "Tools/commTool";
import { ISpCamera, ISpTransform, spComponentType } from "Tools/engineParallel/spInterface";
import { GameLogic } from "../Core/GameLogic";
import { StageMgr } from "../Core/StageMgr";
import { SceneBattle } from "./SceneBattle";
import { SceneCamAvoidObsCtr } from "./SceneCamAvoidObsCtr";
import { SceneHomeMap } from "./SceneHomeMap";
import { ISceneVisual } from "./SceneInterface";
import { SceneObstacleMgr } from "./SceneObstacleMgr";

/** 场景管理器 */
export class SceneMgr {
    public static readonly helpV2: m4m.math.vector2 = new m4m.math.vector2();
    public static readonly helpV2v1: m4m.math.vector2 = new m4m.math.vector2();
    public static readonly helpV2v2: m4m.math.vector2 = new m4m.math.vector2();
    public static readonly helpV2v3: m4m.math.vector2 = new m4m.math.vector2();
    public static readonly helpV2v4: m4m.math.vector2 = new m4m.math.vector2();
    public static readonly helpV2v5: m4m.math.vector2 = new m4m.math.vector2();
    public static readonly helpV3: m4m.math.vector3 = new m4m.math.vector3();
    public static readonly helpV3v1: m4m.math.vector3 = new m4m.math.vector3();
    public static readonly helpNumReuseArr: ReuseArray<number> = new ReuseArray<number>();

    public static sceneRoot: ISpTransform;
    public static roleRoot: ISpTransform;
    private static _sceneVEvent: SceneVisualEvent;
    private static _cacheMap: { [sceneID: number]: ISceneVisual } = {};

    public static init() {
        this._sceneVEvent = new SceneVisualEvent();
        //
        SceneObstacleMgr.init();
        SceneCamAvoidObsCtr.init();

        EventMgr.addListener("scene_show", this.show, this);
        EventMgr.addListener("scene_hide", this.hide, this);
    }

    public static getSceneByID(id: number) {
        return this._cacheMap[id];
    }

    private static tryGet(id: number) {
        return this._cacheMap[id];
    }

    private static async show(ev: SceneShowEvent) {
        let sId = ev.sceneID;
        let uiName = ev.uiName;
        let sType: SceneType;//取配置
        let resName = "";
        //test ------------
        // let resName = `Scene01`;
        // if (ev.sceneID == 1) { resName = `Scene01`; sType = 1; }
        // if (ev.sceneID == 2) { resName = `Scene02`; sType = 1; }
        // if (ev.sceneID == 3) { resName = `HeroSelect_02`; sType = 2; }
        // if (ev.sceneID == 4) { resName = `PoolManagerRoot`;sType = 3; }
        //-----------------
        let conf = await SceneBase.getDataByID(sId) as SceneBase;
        if (!conf) {
            console.error(`${SceneBase.name} 表格 中找不到 id：${sId}`);
            return;
        }
        //设置场景障碍
        // let obsName = "testObs";
        // let obsName = "testObsScene";
        let obsName = conf.obstacleRes;
        if (obsName) {  //不为空
            await SceneObstacleMgr.show(obsName);
        }
        //
        sType = conf.type;
        resName = conf.name;
        let _scene: ISceneVisual = this.tryGet(sId);

        if (!_scene) {
            switch (sType) {
                case SceneType.HomeMap:
                    _scene = new SceneHomeMap(conf);
                    break;
                case SceneType.Battle:
                    _scene = new SceneBattle(conf);
                    break;
                // case SceneType.Showroom:
                //     _scene = new SceneShowRoom(conf);
                //     break;
                default:
            }
        }
        //放入 map
        this._cacheMap[sId] = _scene;
        //show
        _scene.show()
            .then(() => {
                // console.error("显示 场景", sId);
                //cam 
                this.setSceneCam(_scene, conf);
                this.setFog(conf);
                this.trySetCamAvoidObsModel(conf);
                //场景显示切换 event
                this._sceneVEvent.isShow = true;
                this._sceneVEvent.sceneID = sId;
                this._sceneVEvent.sceneType = sType;
                this._sceneVEvent.uiName = uiName;
                EventMgr.dispatchEvent("scene_visual_change", this._sceneVEvent);
            });
    }

    //设置 相机躲避的场景模型
    private static trySetCamAvoidObsModel(conf: SceneBase) {
        if (!conf.camAvoidObs) { return; }
        let arr: string[];
        try {
            arr = JSON.parse(conf.camAvoidObs);
        } catch (error) {
            console.error(`配置 SceneBase  ID :${conf.id} ,  camAvoidObs 不正确，Json解析失败！ `);
        }
        if (!arr) { return; }
        for (let i = 0, len = arr.length; i < len; i++) {
            let node = commTool.get3DNodeByPath(arr[i]);
            if (!node) {
                console.error(`SceneBase ID:${conf.id} camAvoidObs 中的 第<${i + 1}>个对象 获取失败！`);
                continue;
            }
            //设置 相机检查的特定层级
            node.gameObject.layer = GameLogic.layerIndexBuilding;
        }
    }

    private static hide(ev: SceneHideEvent) {
        let sId = ev.sceneID;
        let _scene = this.tryGet(sId);
        if (!_scene) { return; }
        if (ev.dispose) {
            _scene.dispose();
            delete this._cacheMap[sId];
            // console.error("释放 场景资源", sId);
        } else {
            _scene.hied();
            // console.error("隐藏 场景资源", sId);
        }
        // ev.dispose;
        let sType = SceneType.Battle;   //取配置
        //try hide obs
        SceneObstacleMgr.remove();
        //event
        this._sceneVEvent.isShow = false;
        this._sceneVEvent.sceneID = sId;
        this._sceneVEvent.sceneType = sType;
        EventMgr.dispatchEvent("scene_visual_change", this._sceneVEvent);
    }

    /** 设置场景相机 */
    private static setSceneCam(_scene: ISceneVisual, config: SceneBase) {
        StageMgr.camCtr.enabled = true;    //关闭跟随
        //test cam set 之后读取配置--------
        //*读配置
        let activeCam = StageMgr.mainCam;
        //位置
        activeCam.gameObject.transform.setWorldPosition(config.camPos);
        //旋转
        let wR = activeCam.gameObject.transform.getWorldRotate();
        let euler = config.camEuler;
        m4m.math.quatFromEulerAngles(euler.x, euler.y, euler.z, wR);
        activeCam.gameObject.transform.setWorldRotate(wR);
        //参数
        activeCam.fov = commTool.toRadian * config.camFOV;
        activeCam.far = config.camFar;
        activeCam.near = config.camNear;
    }

    /** 设置雾效 */
    private static setFog(config: SceneBase) {
        if (!config.enableFog) {
            m4m.framework.sceneMgr.scene.fog = null;
        } else {
            m4m.framework.sceneMgr.scene.fog = new m4m.framework.Fog();
            let c = config.fogColor;
            m4m.framework.sceneMgr.scene.fog._Color = new m4m.math.vector4(c.x, c.y, c.z, 1);
            m4m.framework.sceneMgr.scene.fog._Start = config.fogStart;
            m4m.framework.sceneMgr.scene.fog._End = config.fogEnd;
        }
    }
}
