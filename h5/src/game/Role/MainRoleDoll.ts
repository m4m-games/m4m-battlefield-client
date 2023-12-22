import { UiDataManager } from "PSDUI/UiDataManager";
import { TimeUtil } from "Time/TimeUtil";
import { gameMathUtil } from "Tools/gameMathUtil";
import { BindKeyName } from "../Data/BindKeyName";
import { GamePlayType, InGameStatus, PlayerMoveType, PlayerStatus, RoleActInput } from "../GameEnum";
import { GamePlayMgr } from "../gamePlays/GamePlayMgr";
import { PingTimeManager } from "../Net/PingTimeManager";
import { WebsocketTool } from "../Net/WebsocketTool";
import { SceneObstacleMgr } from "../Scene/SceneObstacleMgr";
import { RoleDoll } from "./RoleDoll";
import { RoleMgr } from "./RoleMgr";

/**
 * 角色玩偶对象 
 * 负责 显示相关功能，模型渲染、动画播放、特效播放
 */
export class MainRoleDoll extends RoleDoll {
    public static canJump: boolean = false;
    private static readonly _helpV2: m4m.math.vector2 = new m4m.math.vector2();
    private static readonly _helpV2v1: m4m.math.vector2 = new m4m.math.vector2();
    private static readonly _helpV3: m4m.math.vector3 = new m4m.math.vector3();
    private static readonly _helpV3v1: m4m.math.vector3 = new m4m.math.vector3();
    private static readonly _helpV3v2: m4m.math.vector3 = new m4m.math.vector3();
    private static readonly _helpV3v3: m4m.math.vector3 = new m4m.math.vector3();

    private static readonly _helpV3v4: m4m.math.vector3 = new m4m.math.vector3();
    private static readonly _helpV3v5: m4m.math.vector3 = new m4m.math.vector3();
    // tslint:disable-next-line: member-ordering
    private testTime: number = 0;
    // tslint:disable-next-line: member-ordering
    private posInfo = {};
    // private nextPoint: m4m.math.vector3[] = [];

    private _nowSpeed: number = 0;
    private _moveType: PlayerMoveType;
    //开始移动
    // tslint:disable-next-line: member-ordering
    public startMove(moveVelocity: m4m.math.vector2, moveSpeed: number, forwarddRotate: m4m.math.quaternion, moveType: PlayerMoveType) {
        if (this.targetPoint) {
            //角色移动中  每次走一定的距离 没走到目标点前 不接受新的目标点
            return;
        }
        // console.error("开始移动 startMove");
        //获取方向 和 速度
        let vel = moveVelocity;
        //没有速度 
        if (gameMathUtil.vec2SqrLength(vel) <= 0.001) {
            // console.error("没有速度 ");
            if (moveType == PlayerMoveType.jump) {//如果是原地跳
                if (MainRoleDoll.canJump == false) {
                    MainRoleDoll.canJump = true;
                    if (RoleMgr.needSynchronous) {
                        // tslint:disable-next-line: no-shadowed-variable
                        let pos: m4m.math.vector3 = m4m.poolv3();
                        // tslint:disable-next-line: no-shadowed-variable
                        let _Mpos = this.model.localPosition;
                        m4m.math.vec3Clone(_Mpos, pos);
                        pos.y = 0;
                        this.posInfo["pos"] = pos;
                        this.posInfo["moveTime"] = 0;
                        this.posInfo["moveType"] = moveType;//1走路  2跳  3跑(冲刺)
                        this.posInfo["pingTime"] = Math.floor(PingTimeManager.Instance.timeQualityNum / 2);//PingTime
                        // console.error("主玩家通知服务器同步的点 ", pos);
                        WebsocketTool.Instance.GameManager_updataGame(this.posInfo);
                        //主角 移动去目标点
                        UiDataManager.changeFunctionData(BindKeyName.mainRoleToTargetPoint, this.posInfo);
                    }
                }
            }
            return;
        }
        // console.error("11111");
        let _m = this.model;
        let _Mpos = _m.localPosition;
        let realVel = MainRoleDoll._helpV3;
        m4m.math.vec3Set(realVel, vel.x, 0, vel.y);
        // realVel.x = vel.x;
        // realVel.z = vel.y;
        // realVel.y = 0;
        m4m.math.quatTransformVector(forwarddRotate, realVel, realVel);

        let pos: m4m.math.vector3 = m4m.poolv3();
        m4m.math.vec3Add(_Mpos, realVel, pos);
        this.TargetPointArr.length = 0;

        this.calcStartAndEnd(pos);
        this.TargetPointArr.push(pos);

        if (SceneObstacleMgr.isEnable) {
            //调整目标点,通过碰撞障碍
            let currPos = MainRoleDoll._helpV2;
            m4m.math.vec2Set(currPos, _Mpos.x, _Mpos.z);
            let tPos = MainRoleDoll._helpV2v1;
            m4m.math.vec2Set(tPos, pos.x, pos.z);
            let hitPoint = MainRoleDoll._helpV3v1;
            let tangPos = MainRoleDoll._helpV3v2;
            // let ishited = SceneObstacleMgr.hitTestByLine(currPos, tPos, hitPoint, SceneObstacleMgr.hitMixGap, null, tangPos);
            let ishited = SceneObstacleMgr.calcLineCollisionPoint(currPos, tPos, tangPos, hitPoint);
            if (ishited) {
                // let arr: m4m.math.vector3[] = [];
                // arr.push(m4m.poolv3(hitPoint));
                m4m.math.vec3Clone(hitPoint, pos);
                // arr.push(m4m.poolv3(tangPos));
                this.TargetPointArr.length = 0;
                this.TargetPointArr.push(pos);
                let nextPos = m4m.poolv3(tangPos);
                // this.nextPoint.push(nextPos);
                this.TargetPointArr.push(nextPos);
                // console.error("到边上碰撞的点 需要走另外的点", hitPoint, nextPos);
                //....

            }

        }
        this._nowSpeed = moveSpeed;
        this._moveType = moveType;
        //给目标点  
        this.toPointFun();
        // if (SceneObstacleMgr.isEnable) {
        //     //调整目标点,通过碰撞障碍
        //     let currPos = MainRoleDoll._helpV2;
        //     m4m.math.vec2Set(currPos, _Mpos.x, _Mpos.z);
        //     let tPos = MainRoleDoll._helpV2v1;
        //     m4m.math.vec2Set(tPos, pos.x, pos.z);
        //     let hitPoint = MainRoleDoll._helpV3v1;
        //     let tangPos = MainRoleDoll._helpV3v2;
        //     // let ishited = SceneObstacleMgr.hitTestByLine(currPos, tPos, hitPoint, SceneObstacleMgr.hitMixGap, null, tangPos);
        //     let ishited = SceneObstacleMgr.calcLineCollisionPoint(currPos, tPos, tangPos, hitPoint);
        //     if (ishited) {
        //         // let arr: m4m.math.vector3[] = [];
        //         // arr.push(m4m.poolv3(hitPoint));
        //         m4m.math.vec3Clone(hitPoint, pos);
        //         // arr.push(m4m.poolv3(tangPos));
        //         this.nextPoint.length = 0;
        //         let nextPos = m4m.poolv3(tangPos);
        //         this.nextPoint.push(nextPos);
        //         console.error("到边上碰撞的点 需要走另外的点", hitPoint, nextPos);
        //         //....

        //     }

        // }
        // pos.y = 0;//把高度拍扁
        // this.targetPoint = pos;
        // this.moveSpeed = moveSpeed;
        // // 当前玩家到目标点的距离
        // let mpos = MainRoleDoll._helpV3v3;
        // m4m.math.vec3Set(mpos, _Mpos.x, 0, _Mpos.y);
        // let distance = m4m.math.vec3Distance(mpos, this.targetPoint);
        // let time = distance / this.moveSpeed;//到达的时间

        // // console.error(time, "将要去的目标点 ", this.targetPoint, TimeUtil.realtimeSinceStartup - this.testTime);

        // this.testTime = TimeUtil.realtimeSinceStartup;

        // if (RoleMgr.needSynchronous) {
        //     this.posInfo["pos"] = pos;
        //     this.posInfo["moveTime"] = time;
        //     this.posInfo["moveType"] = moveType;//1走路  2跳  3跑(冲刺)
        //     // console.error("主玩家通知服务器同步的点 ",pos);
        //     WebsocketTool.Instance.GameManager_updataGame(this.posInfo);
        // }
    }

    protected toPointFun() {
        let pos: m4m.math.vector3 = this.TargetPointArr.shift();
        let _m = this.model;
        let _Mpos = _m.localPosition;

        pos.y = 0;//把高度拍扁
        this.targetPoint = pos;

        // console.error("切换了速度？？？", this._nowSpeed);
        this.moveSpeed = this._nowSpeed;
        // 当前玩家到目标点的距离
        let mpos = MainRoleDoll._helpV3v3;
        m4m.math.vec3Set(mpos, _Mpos.x, 0, _Mpos.z);
        let distance = m4m.math.vec3Distance(mpos, this.targetPoint);
        let time = distance / this.moveSpeed;//到达的时间

        // console.error(time, "将要去的目标点 ", this.targetPoint, TimeUtil.realtimeSinceStartup - this.testTime);

        this.testTime = TimeUtil.realtimeSinceStartup;

        this.sendToServerFun(pos, time);
    }

    //同步位置给服务器
    // tslint:disable-next-line: member-ordering
    private sendToServerFun(pos, time) {
        if (RoleMgr.needSynchronous) {
            // console.error(time, "将要去的目标点 ", pos, TimeUtil.realtimeSinceStartup - this.testTime);
            this.posInfo["pos"] = pos;
            this.posInfo["moveTime"] = time;
            this.posInfo["moveType"] = this._moveType;//1走路  2跳  3跑(冲刺)
            this.posInfo["pingTime"] = Math.floor(PingTimeManager.Instance.timeQualityNum / 2);//PingTime
            // console.error("主玩家通知服务器同步的点 ", pos);
            WebsocketTool.Instance.GameManager_updataGame(this.posInfo);
            //主角 移动去目标点
            UiDataManager.changeFunctionData(BindKeyName.mainRoleToTargetPoint, this.posInfo);
        }
    }
    //停止移动
    // tslint:disable-next-line: member-ordering
    public stop(trueStop: boolean = false) {
        if (trueStop) {//强行停止 把当前位置同步给服务器
            let _m = this.model;
            let _Mpos = _m.localPosition;
            // console.error("主玩家通知服务器停止移动并同步当前点 ");
            this.sendToServerFun(_Mpos, 0);
        }

        this.moveSpeed = 0;
        m4m.poolv3_del(this.targetPoint);
        this.targetPoint = null;
        // console.error("停下来了？");
        setTimeout(() => {
            if (this.targetPoint == null && this._animationCtr) {
                if (this.role.roleCtr.state.state == RoleActInput.Direction || this.role.roleCtr.state.state == RoleActInput.SpeedUp) {
                    // this.playAnim("idle");
                    // console.error("停止");
                    this.role.roleCtr.handleInput(RoleActInput.Direction_Release);
                }
            }
        }, 50);
    }

    /**
     * 根据距离和到达时间计算出行走的速度
     * @param dt 
     * @returns 
     */
    // tslint:disable-next-line: member-ordering
    protected updateMoveToTargetPoint(dt: number): void {
        if (!this.targetPoint) { return; }
        let _m = this.model;
        let _mPos = _m.localPosition;
        let vePos = MainRoleDoll._helpV3v4;
        m4m.math.vec3Clone(_mPos, vePos);
        vePos.y = 0;
        let currDist = m4m.math.vec3Distance(vePos, this.targetPoint);
        let moveDist: number = dt * this.moveSpeed;//moveSpeed
        // console.error("当前速度 ", this.moveSpeed);
        //到达目标点
        if (moveDist > currDist) {
            this.targetPoint.y = _m.localPosition.y;
            m4m.math.vec3Clone(this.targetPoint, _m.localPosition);
            _m.localPosition = _m.localPosition;
            this.stop();
            if (this.TargetPointArr.length > 0) {
                this.toPointFun();
            }
            // console.error("停下来的点 ", this.model.localPosition);
        } else {
            let vel = MainRoleDoll._helpV3v5;
            m4m.math.vec3Subtract(this.targetPoint, vePos, vel);
            // m4m.math.vec3Normalize(vel, vel);
            m4m.math.vec3ScaleByNum(vel, moveDist / currDist, vel);
            this.moveByVelocity(vel.x, vel.z);

        }
        // console.error(moveDist , currDist,"根据距离和到达时间计算出行走的速度 ",this.model.localPosition);
    }

    // 计算各场景的起点终点, 不允许玩家越界
    // tslint:disable-next-line: cyclomatic-complexity
    private calcStartAndEnd(pos: m4m.math.vector3) {
        if (GamePlayMgr.curr == GamePlayType.woodenPeople) { //木头人起点线
            // let game = GamePlayMgr.currGame as WoodenPeople;
            // //如果在准备阶段
            // if (GamePlayMgr.gameReadyState && game.getMoveStage(pos.z) > 0) {
            //     pos.z = game.start;
            // } else if (this.role.roleData.inGameState == InGameStatus.inGameWin && game.getMoveStage(pos.z) < 2) {
            //     pos.z = game.finish;
            // }
        } else {
            //之后用这个通用处理方法
            let game = GamePlayMgr.currGame;
            if (game == null) {
                return;
            }
            let startArea = game.startArea();//起始区域
            let endArea = game.endArea();//终点区域
            if (startArea) {
                //
                let pooint1 = startArea[0];
                let pooint2 = startArea[1];
                let minX = Math.min(pooint1.x, pooint2.x);
                let minZ = Math.min(pooint1.z, pooint2.z);
                let maxX = Math.max(pooint1.x, pooint2.x);
                let maxZ = Math.max(pooint1.z, pooint2.z);
                // if (this.role.roleData.isMainPlayer()) {
                //     console.error("是否在准备阶段 ", this.role.roleData.clientReadyState);
                // }
                //如果在准备阶段
                if (GamePlayMgr.gameReadyState) {
                    //如果是在准备阶段
                    if (pos.x > maxX) {
                        pos.x = maxX;
                    }
                    if (pos.x < minX) {
                        pos.x = minX;
                    }
                    if (pos.z > maxZ) {
                        pos.z = maxZ;
                    }
                    if (pos.z < minZ) {
                        pos.z = minZ;
                    }
                }

                if (GamePlayMgr.curr == GamePlayType.glassBridge) { //玻离桥特殊处理
                    if (pos.z < minZ) {
                        pos.z = minZ;
                    }
                }
            }
            if (GamePlayMgr.gameSettlementState) {//胜利结算
                if (endArea) {
                    //
                    let pooint1 = endArea[0];
                    let pooint2 = endArea[1];
                    let minX = Math.min(pooint1.x, pooint2.x);
                    let minZ = Math.min(pooint1.z, pooint2.z);
                    let maxX = Math.max(pooint1.x, pooint2.x);
                    let maxZ = Math.max(pooint1.z, pooint2.z);

                    if (GamePlayMgr.curr == GamePlayType.glassBridge) { //玻离桥特殊处理
                        //如果已胜利 不让走出终点框区域
                        //如果是在准备阶段
                        if (pos.x > maxX) {
                            pos.x = maxX;
                        }
                        if (pos.x < minX) {
                            pos.x = minX;
                        }
                        if (pos.z > maxZ) {
                            pos.z = maxZ;
                        }
                        if (pos.z < minZ) {
                            pos.z = minZ;
                        }
                    }
                }
            }
        }
    }

    // tslint:disable-next-line: member-ordering
    public dispose() {
        super.dispose();
    }
}