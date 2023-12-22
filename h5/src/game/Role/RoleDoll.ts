import { AnimationController, AnimStatePlayEvent } from "animation/AnimationController";
import { commTool } from "Tools/commTool";
import { engineParallelType, IDispose, ISpAnimPlayer, ISpAnimPlayerHandle, ISpTransform, spComponentType } from "Tools/engineParallel/spInterface";
import { gameMathUtil } from "Tools/gameMathUtil";
import { GameLogic } from "../Core/GameLogic";
import { PoolMgr } from "../Core/PoolMgr";
import { StageMgr } from "../Core/StageMgr";
import { PlayerMoveType, RoleActInput } from "../GameEnum";
import { GameMgr } from "../GameMgr";
import { SceneObstacleMgr } from "../Scene/SceneObstacleMgr";
import { GameTool } from "../Tool/gameTool";
import { Role } from "./Role";
import { RoleTypeEnum } from "./RoleAttrInfo";

// let configStr = `
// {
//     "states":{
//         "Idle":{"clipName":"Idle" , "speed":1 , "normalizeTime":1 , "mirror":false },
//         "Run":{"clipName":"Run" , "speed":1.3 , "normalizeTime":1 , "mirror":false },
//         "Turn1":{"clipName":"Turn1" , "speed":1 , "normalizeTime":1 , "mirror":false },
//         "Turn2":{"clipName":"Turn2" , "speed":1 , "normalizeTime":1 , "mirror":false },
//         "Jump1":{"clipName":"Jump1" , "speed":1 , "normalizeTime":1 , "mirror":false },
//         "Jump2":{"clipName":"Jump2" , "speed":1 , "normalizeTime":1 , "mirror":false },
//         "Jump3":{"clipName":"Jump3" , "speed":1 , "normalizeTime":1 , "mirror":false },
//         "Walk":{"clipName":"Walk" , "speed":1.3 , "normalizeTime":1 , "mirror":false },
//         "Die":{"clipName":"Die" , "speed":1 , "normalizeTime":1 , "mirror":false },
//         "Die2":{"clipName":"Die2" , "speed":1 , "normalizeTime":1 , "mirror":false },
//         "TugOfWarFall2":{"clipName":"TugOfWarFall2" , "speed":1 , "normalizeTime":1 , "mirror":false },
//         "TugOfWarFall3":{"clipName":"TugOfWarFall3" , "speed":1 , "normalizeTime":1 , "mirror":false },
//         "IdleWithAPistol":{"clipName":"IdleWithAPistol" , "speed":1 , "normalizeTime":1 , "mirror":false },
//         "Submachinegun":{"clipName":"Submachinegun" , "speed":1 , "normalizeTime":1 , "mirror":false },
//         "Pistol":{"clipName":"Pistol" , "speed":1 , "normalizeTime":1 , "mirror":false },
//         "IdleTakeTheGun":{"clipName":"IdleTakeTheGun" , "speed":1 , "normalizeTime":1 , "mirror":false },
//         "BuckleSugarCake":{"clipName":"BuckleSugarCake" , "speed":1 , "normalizeTime":1 , "mirror":false },
//         "TugOfWar":{"clipName":"TugOfWar" , "speed":1 , "normalizeTime":1 , "mirror":false },
//         "TugOfWarFallReverse1":{"clipName":"TugOfWarFallReverse1" , "speed":1 , "normalizeTime":1 , "mirror":false },
//         "TugOfWarIdle":{"clipName":"TugOfWarIdle" , "speed":1 , "normalizeTime":1 , "mirror":false },
//         "TugOfWarIdleReverse":{"clipName":"TugOfWarIdleReverse" , "speed":1 , "normalizeTime":1 , "mirror":false },
//         "TugOfWarReverse":{"clipName":"TugOfWarReverse" , "speed":1 , "normalizeTime":1 , "mirror":false }
//     },
//     "transitions":[
//         {"from":"__entry__","to":"Idle"},
//         {"from":"__anyState__","to":"Idle"},
//         {"from":"__anyState__","to":"Run"},
//         {"from":"__anyState__","to":"Turn1"},
//         {"from":"__anyState__","to":"Turn2"},
//         {"from":"__anyState__","to":"Jump1"},
//         {"from":"__anyState__","to":"Jump2"},
//         {"from":"__anyState__","to":"Jump3"},
//         {"from":"__anyState__","to":"Walk"},
//         {"from":"__anyState__","to":"Die"},
//         {"from":"__anyState__","to":"Die2"},
//         {"from":"__anyState__","to":"TugOfWarFall2"},
//         {"from":"__anyState__","to":"TugOfWarFall3"},
//         {"from":"__anyState__","to":"IdleTakeTheGun"},
//         {"from":"__anyState__","to":"IdleWithAPistol"},
//         {"from":"__anyState__","to":"Submachinegun"},
//         {"from":"__anyState__","to":"Pistol"},
//         {"from":"__anyState__","to":"BuckleSugarCake"},
//         {"from":"__anyState__","to":"TugOfWar"},
//         {"from":"__anyState__","to":"TugOfWarFallReverse1"},
//         {"from":"__anyState__","to":"TugOfWarIdle"},
//         {"from":"__anyState__","to":"TugOfWarIdleReverse"},
//         {"from":"__anyState__","to":"TugOfWarReverse"}
//     ]
// }
// `;
// let configObj = JSON.parse(configStr);

// interface IAnimNames {
//     "Idle": string;
//     "Run": string;
//     "Turn1": string;
//     "Turn2": string;
//     "Walk": string;
//     "Jump1": string;
//     "Jump2": string;
//     "Jump3": string;
//     "Die": string;
//     "Die2": string;
//     "TugOfWarFall2": string;
//     "TugOfWarFall3": string;
//     "IdleTakeTheGun": string;
//     "IdleWithAPistol": string;
//     "Submachinegun": string;
//     "Pistol": string;
//     "BuckleSugarCake": string;
//     "TugOfWar": string;
//     "TugOfWarFallReverse1": string;
//     "TugOfWarIdle": string;
//     "TugOfWarIdleReverse": string;
//     "TugOfWarReverse": string;
// }

/**
 * 角色玩偶对象 
 * 负责 显示相关功能，模型渲染、动画播放、特效播放
 */
export class RoleDoll implements IDispose {
    /** 角色场景对象 */
    public get model() { return this._model; }

    /** 动画 状态机 控制器 */
    public get animationCtr() { return this._animationCtr; }

    /** 获取 骨骼位置的名字 */
    private static getBoneNameMap(aplayer: m4m.framework.aniplayer) {
        let sm = aplayer.gameObject.getFirstComponentInChildren("skinnedMeshRenderer") as m4m.framework.skinnedMeshRenderer;
        let meshResID = sm.mesh.getGUID();
        let ctemp = this._isPlayerBoneNameMap[meshResID];
        if (!ctemp) {
            ctemp = this._isPlayerBoneNameMap[meshResID] = {} as any;
            aplayer.bones.forEach((val) => {
                ctemp[val.name] = true;
            });
        }
        return ctemp;
    }

    /** 初始化完毕？ */
    public get inited() { return this._inited; }

    protected _animationCtr: AnimationController;

    protected targetPoint: m4m.math.vector3;//目标点

    // tslint:disable-next-line: member-ordering
    protected moveSpeed: number = 0;

    // tslint:disable-next-line: member-ordering
    protected TargetPointArr: any[] = [];//目标点数组

    //是否可移动
    public get canMove() {
        return this.TargetPointArr.length == 0;
    }
    /** 蒙皮动画 根节点 名 */
    public static readonly BoonRoot = "__BoonRoot__";
    public ModelRadius = 0.5;
    public role: Role;

    //----- 暂时这么写
    //玩家脸数据
    public faceDatas: string[] = ["nan_face01", "nan_face02", "nan_face03", "nv_face01", "nv_face02", "nv_face03"];
    //玩家头发数据
    public hairDatas: string[] = ["nan_hair01", "nan_hair02", "nan_hair03", "nv_hair01", "nv_hair02", "nv_hair03"];
    public shadow: ISpTransform;

    /** 角色 上下动效关键帧数据 */
    private static readonly roleKFDatas: [number, number][] = [[0, 0], [0.166, -0.174], [0.666, 0]];
    // private _animPlayerHandle: ISpAnimPlayerHandle;
    private static readonly adBoneAddedTag = "__adBoneAdded__";

    private static _isPlayerBoneNameMap: { [meshID: string]: { boneName: boolean } } = {};
    private static readonly helpQua: m4m.math.quaternion = new m4m.math.quaternion();
    private static readonly helpV2: m4m.math.vector2 = new m4m.math.vector2();
    private static readonly helpV2v1: m4m.math.vector2 = new m4m.math.vector2();
    private static readonly helpV2v2: m4m.math.vector2 = new m4m.math.vector2();
    private static readonly helpV2v3: m4m.math.vector2 = new m4m.math.vector2();
    private static readonly helpV3: m4m.math.vector3 = new m4m.math.vector3();
    // private static readonly helpV3: m4m.math.vector3 = new Proxy(new m4m.math.vector3(), {
    //     set(target, p, v) {
    //         if (isNaN(v)) {
    //             console.error("调试:102901:helpV3设置属性为NAN!!!!", p, v);
    //         }
    //         target[p] = v;
    //         return true;
    //     },
    // });
    private static readonly helpV3v1: m4m.math.vector3 = new m4m.math.vector3();
    private static readonly helpV3v2: m4m.math.vector3 = new m4m.math.vector3();
    private static readonly helpV3v3: m4m.math.vector3 = new m4m.math.vector3();
    private static readonly helpV3v4: m4m.math.vector3 = new m4m.math.vector3();
    private static readonly shadowResName = "roleShadow";
    private _model: ISpTransform;
    private _inited: boolean = false;
    private _initedWaits: Function[] = [];
    private _top: ISpTransform;
    private _roleShadow: ISpTransform;
    private num: string = "0";

    /**
     * 初始化
     * @param resName 显示模型的资源名 
     */
    public async init(resName: string) {
        this._model = await PoolMgr.baseModlePool.newObj(resName, GameMgr.rolePath_Policy(resName), GameMgr.engineParallel);
        // if (role == null) {
        //     // console.error("拿到的人物对象出错！！！");
        //     return;
        // }

        // debug
        // this._model = new Proxy(this._model, {
        //     set(target, p, v) {
        //         if (p == "localPosition") {
        //             if (isNaN(v.x) || isNaN(v.y) || isNaN(v.z)) {
        //                 console.error("调试:102901:设置位置出现NAN!!!!", v);
        //             }
        //             target.localPosition = v;
        //         }
        //         return true;
        //     },
        // });

        //获取 角色位置点
        this.setHole(this._model);
        //set layer
        this._model.gameObject.layer = GameLogic.layerIndexActor;
        //添加到场景
        StageMgr.roleRoot.addChild(this._model);

        //动画 
        let _animPlayerHd: ISpAnimPlayerHandle;
        let _aniplayer = this._model.gameObject.getFirstComponent(spComponentType.animPlayer) as ISpAnimPlayer;
        if (_aniplayer) {
            let etype = _aniplayer.gameObject.transform.engineType;
            if (etype == engineParallelType.none) {
                let _ap: m4m.framework.aniplayer = _aniplayer.rawHandle;
                // //处理 asbone------------
                // this.tryAddAsBone(_ap);
                // //-----------------------
                // //boonroot 处理
                // let skinMr = _ap.gameObject.getFirstComponentInChildren("skinnedMeshRenderer") as m4m.framework.skinnedMeshRenderer;
                // if (skinMr.rootBone) {
                //     skinMr.rootBone.gameObject.addComponent("asbone");
                //     this._boenNodeMap.set(RoleDoll.BoonRoot, getSpTransform(skinMr.rootBone));
                // }
            }
            _animPlayerHd = await GameTool.getAnimPlayerHandle(_aniplayer, GameMgr.rolePath);
        }
        //anmationCtr 
        this._animationCtr = new AnimationController();
        this._animationCtr.init(_animPlayerHd, StageMgr.actionBaseConfigObj);    //configObj可以从配置中取出
        //播放idle 
        this.playAnim("Idle");

        //
        this._inited = true;

        //脚底阴影
        this.shadow = this._roleShadow = await PoolMgr.baseModlePool.newObj(RoleDoll.shadowResName, GameMgr.itemPath_Policy(RoleDoll.shadowResName), GameMgr.engineParallel);
        this.shadow.localPosition.y = 0.06;
        this.model.addChild(this.shadow);

        //init end list act
        this._initedWaits.forEach((v) => {
            v(null);
        });
        this._initedWaits.length = 0;
    }

    //设置号码
    public setNum(num: string) {
        // this.num = num;
        // let guid = this.role.roleData.guid;
        // if (num.length == 1) {
        //     // tslint:disable-next-line: no-parameter-reassignment
        //     this.num = "0" + num;
        // }
        // if (this._model.engineType == engineParallelType.none) {
        //     if (this.role.roleData.roleType == RoleTypeEnum.Player) {
        //         let trans = this._model.rawHandle as m4m.framework.transform;
        //         let tempTran = trans.find("body_shuzi");
        //         let skinmr = tempTran.gameObject.getFirstComponentInChildren("skinnedMeshRenderer") as m4m.framework.skinnedMeshRenderer;
        //         // 下载贴图
        //         let src = GameMgr.TexPath + "roleNum/" + this.num + ".png";
        //         let newMat: m4m.framework.material;
        //         let mat: m4m.framework.material = skinmr.materials[0];
        //         newMat = mat.clone();//clone原皮肤参数  用于新的皮
        //         commTool.loaderTextureFun(src, (_tex) => {
        //             // console.error(skinmr.materials[0]);
        //             if (newMat && skinmr.materials && this.role.roleData) {
        //                 newMat.setTexture("_MainTex", _tex);
        //                 skinmr.materials[0] = newMat;
        //             }
        //         });
        //     }
        // }
    }

    public getNum() {
        return this.num;
    }

    /** 获取 一个 等待 init完成的回调 */
    public waitInited() {
        return new Promise((resolve, reject) => {
            if (this._inited) {
                resolve(null);
            } else {
                this._initedWaits.push(resolve);
            }
        });
    }

    public UpdateLogic(dt: number) {
        this.updateMoveToTargetPoint(dt);
    }

    public dispose() {
        this.moveSpeed = 0;
        if (this.targetPoint) {
            m4m.poolv3_del(this.targetPoint);
            this.targetPoint = null;
        }
        if (this._model) {
            this._model.removeChild(this.shadow);
            PoolMgr.baseModlePool.deleteObj(this._model);
            let _p = this._model.getParent();
            if (_p) {
                _p.removeChild(this._model);
            }
            this._model = null;
        }
        if (this._animationCtr) {
            this._animationCtr.dispose();
            this._animationCtr = null;
        }
    }

    /**
     * 播放动画 
     * @param animName      动画名
     * @param needPlayEnd   是否返回 （为true时等待播放结束的Promise）
     */
    public playAnim(animName: string, needPlayEnd = false): Promise<any> {
        // this._animPlayerHandle.playAnimByName(`${animName}.FBAni.aniclip.bin`);
        // console.error("播动作 ",animName);
        this._animationCtr.play(animName);
        if (!needPlayEnd) { return; }

        //等待播放 结束 
        let _p = new Promise((resolve) => {
            let obj = {
                onPlayEnd: (ev: AnimStatePlayEvent) => {
                    if (ev.stateName == animName) {
                        this._animationCtr.RemoveListener("onStatePlayEnd", obj.onPlayEnd, obj);
                        resolve(null);
                    }
                },
            };
            this._animationCtr.On("onStatePlayEnd", obj.onPlayEnd, obj);
        });

        return _p;
    }

    public playFX(fxName: string) {

    }

    /** 暂停动画播放 */
    public stopAnim() {
        this._animationCtr.stop();
    }

    /**
     * 行走一步
     * @param dt dt 时间
     * @param moveVelocity 移动速度 
     * @param forwarddRotate 角色转到前方旋转
     */
    public walkStep(dt: number, moveVelocity: m4m.math.vector2, forwarddRotate: m4m.math.quaternion) {
        let _m = this._model;
        //检查播放 行走动画
        //获取方向 和 速度
        let vel = moveVelocity;
        //没有速度 
        if (gameMathUtil.vec2SqrLength(vel) <= 0.001) { return; }
        // let pos = _m.localPosition;
        // let rot = _m.localRotate;
        // let addV3 = RoleDoll.helpV3;
        let realVel = RoleDoll.helpV3v1;
        realVel.x = vel.x;
        realVel.z = vel.y;
        realVel.y = 0;
        m4m.math.quatTransformVector(forwarddRotate, realVel, realVel);

        // // addV3.x = pos.x + vel.x * dt;
        // // addV3.z = pos.z + vel.y * dt;
        // addV3.x = pos.x + realVel.x * dt;
        // addV3.z = pos.z + realVel.z * dt;
        // addV3.y = pos.y;
        // m4m.math.quatLookat(pos, addV3, rot);
        // _m.localPosition = addV3;
        // _m.localRotate = rot;

        m4m.math.vec3ScaleByNum(realVel, dt, realVel);
        //
        this.moveByVelocity(realVel.x, realVel.z);
    }
    public getTopPos(pos: m4m.math.vector3) {
        m4m.math.vec3Clone(this._top.getWorldPosition(), pos);
        pos.y += 2.3;
    }

    // 暂时这么写, 玩家脸, 根据token
    public makePlayerFace() {
        // for (let s of this.faceDatas) {
        //     this.model.find(s).gameObject.visible = false;
        // }
        // for (let s of this.hairDatas) {
        //     this.model.find(s).gameObject.visible = false;
        // }
        // let guid = this.role.roleData.guid;
        // let i1 = guid.charCodeAt(0) % 6;
        // let i2 = guid.charCodeAt(1) % 6;

        // //let i1 = gameMathUtil.RandRange(0, this.faceDatas.length, true);
        // //let i2 = gameMathUtil.RandRange(0, this.hairDatas.length, true);
        // this.model.find(this.faceDatas[i1]).gameObject.visible = true;
        // this.model.find(this.hairDatas[i2]).gameObject.visible = true;
    }
    //开始移动
    // tslint:disable-next-line: member-ordering
    public moveToTarget(_pos: m4m.math.vector3, moveTime: number, moveType: PlayerMoveType) {
        // let a = { pos: _pos, moveTime, moveType };
        // this.TargetPointArr.push(a);
        // if (this.targetPoint) {
        //     return;
        // }
        // this.newFun();
        // let pointInfo = this.TargetPointArr.shift();
        // let moveTime = pointInfo.moveTime;
        // let moveType = pointInfo.moveType;
        // this.posInfo["moveType"] = PlayerMoveType.walk;//1走路  2跳  3跑(冲刺)
        // console.error("其他玩家同步移动的点 ", _pos, moveType);
        // tslint:disable-next-line: switch-default
        switch (moveType) {
            case PlayerMoveType.homing:
                this.role.roleCtr.handleInput(RoleActInput.Direction_Release);
                break;
            case PlayerMoveType.walk:
                this.role.roleCtr.handleInput(RoleActInput.Walk);
                break;
            case PlayerMoveType.jump:
                this.role.roleCtr.handleInput(RoleActInput.Jump);
                break;
            case PlayerMoveType.run:
                this.role.roleCtr.handleInput(RoleActInput.SpeedUp);
                // tslint:disable-next-line: switch-final-break
                break;
        }
        let apos = _pos;
        let pos: m4m.math.vector3 = m4m.poolv3(apos);
        pos.y = 0;
        this.targetPoint = pos;
        let _m = this.model;
        //实际移动到目标点的时间=原时间-网络同步的延迟时间
        let trueTime = moveTime;//- (PingTimeManager.Instance.timeQualityNum) / 1000;
        this.moveSpeed = 0;
        if (trueTime <= 0) {
            //直接瞬移到目标点
            this.targetPoint.y = _m.localPosition.y;
            m4m.math.vec3Clone(this.targetPoint, _m.localPosition);
            _m.localPosition = _m.localPosition;
            // console.error("直接瞬移到目标点");
            this.stop();
        } else {
            let _Mpos = _m.localPosition;
            let vePos = RoleDoll.helpV3v4;
            m4m.math.vec3Clone(_Mpos, vePos);
            vePos.y = 0;
            let distance = m4m.math.vec3Distance(vePos, this.targetPoint);
            this.moveSpeed = distance / trueTime;
            // console.error(vePos, this.targetPoint, "  ++++++  ", distance);
        }
        // console.error(trueTime, "算出来的速度值 ", this.moveSpeed, "    ", trueTime);
    }

    //停止移动
    // tslint:disable-next-line: member-ordering
    public stop(trueStop: boolean = false) {
        this.moveSpeed = 0;
        m4m.poolv3_del(this.targetPoint);
        this.targetPoint = null;
        // if (this.TargetPointArr.length > 0) {
        //     this.newFun();
        // }
        setTimeout(() => {
            // tslint:disable-next-line: no-conditional-assignment
            // console.error("停止111111111");
            if (this.targetPoint == null && this._animationCtr) {
                if (this.role.roleCtr.state.state == RoleActInput.Direction || this.role.roleCtr.state.state == RoleActInput.SpeedUp) {
                    // this.playAnim("idle");
                    // console.error("停止");
                    this.role.roleCtr.handleInput(RoleActInput.Direction_Release);
                }
            }
        }, 50);
    }
    // //停止移动
    // public stopMoveTarget() {
    //     m4m.poolv3_del(this.targetPoint);
    //     this.targetPoint = null;
    // }
    // tslint:disable-next-line: member-ordering
    /**
     * 根据距离和到达时间计算出行走的速度
     * @param dt 
     * @returns 
     */
    protected updateMoveToTargetPoint(dt: number): void {
        if (!this.targetPoint) { return; }
        let _m = this.model;
        let _mPos = _m.localPosition;
        let vePos = RoleDoll.helpV3v3;
        m4m.math.vec3Clone(_mPos, vePos);
        vePos.y = 0;

        let currDist = m4m.math.vec3Distance(vePos, this.targetPoint);
        let moveDist: number = dt * this.moveSpeed;//moveSpeed
        //到达目标点
        if (moveDist >= currDist) {
            // this.setTargetPoint();
            // let rot: m4m.math.vector3 = m4m.math.pool.new_vector3();
            // rot.x = 0;
            // rot.y = this.targetAngle;
            // rot.z = 0;
            // this.currentRole.rotation = rot;
            this.targetPoint.y = _m.localPosition.y;
            m4m.math.vec3Clone(this.targetPoint, _m.localPosition);
            _m.localPosition = _m.localPosition;
            this.stop();
            // console.error("停下来的点 ", this.model.localPosition);

        } else {
            // this.currentRole.rotateTo(this.targetAngle);
            // let pos: m4m.math.vector3 = Vector3Util.Instance.MoveTo(currentRole.localPosition, this.targetPoint, distance);
            if (this._animationCtr.getCurrentStateName() == "Idle") {
                // this.playAnim("walk");
                this.role.roleCtr.handleInput(RoleActInput.Direction);
            }

            let vel = RoleDoll.helpV3;
            m4m.math.vec3Subtract(this.targetPoint, vePos, vel);
            // m4m.math.vec3Normalize(vel, vel);
            m4m.math.vec3ScaleByNum(vel, moveDist / currDist, vel);
            this.moveByVelocity(vel.x, vel.z);

            // m4m.math.vec3Add(_mPos, vel, _mPos);
            // _m.localPosition = _mPos;
            // m4m.math.pool.delete_vector3(pos);

            // let pos: m4m.math.vector3 = Vector3Util.Instance.MoveTo(currentRole.localPosition, this.targetPoint, distance);
            // m4m.math.vec3Clone(pos, currentRole.localPosition);
            // currentRole.localPosition = currentRole.localPosition;
            // m4m.math.pool.delete_vector3(pos);

            // let pos: m4m.math.vector3 = Vector3Util.Instance.MoveTo(_m.localPosition, this.targetPoint, moveDist);
            // m4m.math.vec3Clone(pos, _m.localPosition);
            // _m.localPosition = _m.localPosition;
            // m4m.math.pool.delete_vector3(pos);
        }
        // console.error(moveDist , currDist,"根据距离和到达时间计算出行走的速度 ",this.model.localPosition);
    }

    /**
     * 移动通过 速度向量
     * @param velX 速度向量X
     * @param velY 速度向量Y
     */
    protected moveByVelocity(velX: number, velY: number) {
        let _m = this._model;
        let pos = _m.localPosition;
        let rot = _m.localRotate;
        let addV3 = m4m.poolv3();
        addV3.x = pos.x + velX;
        addV3.z = pos.z + velY;
        addV3.y = pos.y;
        if (!this.role.isTarPointMove && SceneObstacleMgr.isEnable) {
            this.adjustByObs(pos, addV3, addV3);
        }
        if (gameMathUtil.vec3DisSqr(pos, addV3) > 0.0001) {
            m4m.math.quatLookat(pos, addV3, rot);
            _m.localRotate = rot;
        }
        _m.localPosition = addV3;
        m4m.poolv3_del(addV3);
    }

    //调整障碍碰撞后的 速度向量
    private adjustByObs(p0: m4m.math.vector3, p1: m4m.math.vector3, outPos: m4m.math.vector3) {
        if (!SceneObstacleMgr.isEnable) { return; }
        let _p0 = m4m.poolv2();
        m4m.math.vec2Set(_p0, p0.x, p0.z);
        let _p1 = m4m.poolv2();
        m4m.math.vec2Set(_p1, p1.x, p1.z);
        let tempV3 = m4m.poolv3();
        let ishited = SceneObstacleMgr.calcLineCollisionPoint(_p0, _p1, tempV3);
        if (ishited) {
            m4m.math.vec3Clone(tempV3, outPos);
            outPos.y = p0.y;
        }
        m4m.poolv3_del(tempV3);
        m4m.poolv2_del(_p1);
        m4m.poolv2_del(_p0);
    }

    /** 获取 角色挂在位置点 */
    private setHole(_modle: ISpTransform) {
        this._top = _modle;
    }
}
