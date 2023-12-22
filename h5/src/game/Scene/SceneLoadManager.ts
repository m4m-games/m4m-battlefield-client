import { EventGeneric, EventMgr } from "eventMgr";
import { SceneHideEvent } from "events/sceneHideEvent";
import { SceneShowEvent } from "events/sceneShowEvent";
import { UiDataManager } from "PSDUI/UiDataManager";
import { SceneBase } from "SceneBase";
import { AudioPlayer } from "../Audio/AudioPlayer";
import { BindKeyName } from "../Data/BindKeyName";
import { UIOpenOrHideManager } from "../Manager/UIOpenOrHideManager";
import { CameraViewInfo } from "../Role/CameraViewInfo";
import { RoleMgr } from "../Role/RoleMgr";

/**
 *场景ID常量
 */
export enum SceneidEnum {
    /** 单人游戏大厅 */
    BgTugOfWar = 1002,
    Hall = 1003,
    WoodenPeople = 1004,
    SugarCake = 1005,
    GlassBridge = 1006,//玻璃桥
    Hoodle = 1007,//弹珠
    squidGame = 1008,//鱿鱼游戏
}

export class SceneLoadManager {
    public static get Instance(): SceneLoadManager {
        if (this._instance == null) {
            this._instance = new SceneLoadManager();
        }
        return this._instance;
    }
    public constructor() {
        //
        EventMgr.addListener("camera_View_Success", this.setCameraViewInfoCom, this);
    }
    private static _instance: SceneLoadManager;

    //上一个场景ID
    private _lastSceneID: number;
    //当前场景配置文件
    private _sceneConfig: SceneBase = null;

    // 获取上一个场景id
    public get lastSceneID() {
        return this._lastSceneID;
    }
    //获取场景配置文件
    public async getSceneConfig() {
        if (this._sceneConfig == null) {
            this._sceneConfig = await SceneBase.getDataByID(this._lastSceneID) as SceneBase;
        }
        return this._sceneConfig;
    }

    public loadScene(sceneid: number) {
        //开始切换场景
        //停止声音
        AudioPlayer.stopAll();
        //让 摇杆 复位
        UiDataManager.changeFunctionData(BindKeyName.joyReset, null);
        //跳到新的场景 禁止移动
        RoleMgr.canMove(false, true);
        //显示loading
        // UIOpenOrHideManager.Instance.OpenLoadingView();
        UIOpenOrHideManager.Instance.OpenTloadingView();
        //清理其他角色
        EventMgr.dispatchEvent("role_clear_Other", { data: "" });
        //因常规状态场景都单独存在 加下一个场景前 释放上一个场景资源
        if (this._lastSceneID) {
            let _sceneHideEvent = new SceneHideEvent();
            _sceneHideEvent.sceneID = this._lastSceneID;
            _sceneHideEvent.dispose = true;
            console.error("释放 场景资源*****", this._lastSceneID);
            EventMgr.dispatchEvent("scene_hide", _sceneHideEvent);
        }

        // console.error("显示 场景资源", sceneid);
        let ev = new SceneShowEvent();
        ev.sceneID = sceneid;
        EventMgr.dispatchEvent("scene_show", ev);
        this._lastSceneID = sceneid;
        this._sceneConfig = null;
    }

    /**
     * 设置相机看向目标参数
     * */
    public async upDateCameraViewInfo() {
        let sceneID = this._lastSceneID;
        let conf = await this.getSceneConfig();
        let info: CameraViewInfo;
        if (conf) {
            info = new CameraViewInfo();
            info.camViewOffset = conf.camViewOffset;
            info.distance = conf.camDistance;
            info.tiltAngle = conf.tiltAngle;
            info.panAngle = conf.panAngle;
        } else {
            console.error("取场景配置出错！！！" + sceneID);
        }
        EventMgr.dispatchEvent("role_view", new EventGeneric<{ info: CameraViewInfo }>({ info }));
    }

    //设置相机看向目标参数完成
    private setCameraViewInfoCom() {
        console.error("设置相机看向目标参数完成");
        //隐藏loading
        // UIOpenOrHideManager.Instance.HideLoadingView();
        UIOpenOrHideManager.Instance.HideTloadingView();
        RoleMgr.canMove(true);
    }
}