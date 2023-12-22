import { SceneBase } from "SceneBase";
import { ISpTransform } from "Tools/engineParallel/spInterface";
import { PoolMgr } from "../Core/PoolMgr";
import { StageMgr } from "../Core/StageMgr";
import { GameMgr } from "../GameMgr";
import { ISceneVisual } from "./SceneInterface";

/** 首页 主菜单场景 */
export class SceneHomeMap implements ISceneVisual {
    public get model() {
        return this._model;
    }
    constructor(config: SceneBase) {
        this._config = config;
    }
    private _config: SceneBase;
    private _model: ISpTransform;
    public async show() {
        let resName = this._config.name;
        // if(this._config.id==1006)
        // {
        //     resName="BgMarbles";
        // }
        if (!this._model) {
            this._model = await PoolMgr.baseModlePool.newObj(resName, GameMgr.scenePath_Policy(resName), GameMgr.engineParallel);
        }
        if (!this._model) {
            console.error(`场景资源 ${resName} 没有找到 `);
            return;
        }
        // gd3d.math.vec3Clone(this._config.sceneScale,this._model.localScale);
        // this._model.localScale = this._model.localScale;
        //放入场景root节点
        StageMgr.sceneRoot.addChild(this._model);
        return null;
    }
    public hied() {
        if (!this._model) { return; }
        let _p = this._model.getParent();
        _p.removeChild(_p);
        PoolMgr.baseModlePool.deleteObj(this._model);    //入池
        this._model = null;
    }

    public dispose() {
        this.hied();
        if (this._model) { this._model.dispose(); }   //节点 dispose
        //资源
        this._model = null;
    }

}
