import { SceneBase } from "SceneBase";
import { ISpTransform } from "Tools/engineParallel/spInterface";
import { PoolMgr } from "../Core/PoolMgr";
import { StageMgr } from "../Core/StageMgr";
import { GameMgr } from "../GameMgr";
import { ISceneVisual } from "./SceneInterface";

/** 战斗场景 */
export class SceneBattle implements ISceneVisual {
    constructor(config : SceneBase){
        this.config = config;
    }
    private config : SceneBase;
    private model: ISpTransform;
    public async show() {
        let resName = this.config.name;
        if (!this.model) {
            this.model = await PoolMgr.baseModlePool.newObj(resName, GameMgr.scenePath_Policy(resName), GameMgr.engineParallel);
        }
        if (!this.model) {
            console.error(`场景资源 ${resName} 没有找到 `);
            return;
        }
        //放入场景root节点
        StageMgr.sceneRoot.addChild(this.model);
    }
    public hied() {
        if (!this.model) { return; }
        let _p = this.model.getParent();
        _p.removeChild(_p);
        PoolMgr.baseModlePool.deleteObj(this.model);    //入池
        this.model = null;
    }

    public dispose() {
        this.hied();
        if (this.model) { this.model.dispose(); }   //节点 dispose
        //资源
        this.model = null;
    }
}