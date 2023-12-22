import { TransformData } from "eventData/TransformData";
import { EventBase, EventGeneric, EventMgr } from "eventMgr";
import { BattleRoleTopPosEvent } from "events/BattleRoleTopEvent";
import { key } from "Loader/otherPlan/dataType/key";
import { UiDataManager } from "PSDUI/UiDataManager";
import { UiManager } from "PSDUI/UiManager";
import { TimeUtil } from "Time/TimeUtil";
import { commTool } from "Tools/commTool";
import { FrameMgr } from "Tools/FrameMgr";
import { gameMathUtil } from "Tools/gameMathUtil";
import { LateUpdateMgr } from "Tools/LateUpdateMgr";
import { PoolMgr } from "../Core/PoolMgr";
import { StageMgr } from "../Core/StageMgr";
import { BindKeyName } from "../Data/BindKeyName";
import { PlayerClientState, RoleActInput, Weapons } from "../GameEnum";
import { GameMgr } from "../GameMgr";
import { WebsocketTool } from "../Net/WebsocketTool";
import { SceneCamAvoidObsCtr } from "../Scene/SceneCamAvoidObsCtr";
import { CameraViewInfo } from "./CameraViewInfo";
import { Role } from "./Role";
import { RoleAttrInfo, RoleServerInfo, RoleTypeEnum } from "./RoleAttrInfo";

/**
 * 角色对象管理器
 */
export class RoleMgr {

    private static readonly helpV2 = new m4m.math.vector2();
    private static readonly helpV2v1 = new m4m.math.vector2();
    private static readonly helpV3 = new m4m.math.vector3();
    private static readonly helpV3UP = new m4m.math.vector3(0, 1, 0);
    private static readonly helpV3v1 = new m4m.math.vector3();
    private static readonly helpQuat = new m4m.math.quaternion();

    private static _player: Role;
    private static _roleMap: { [guid: string]: Role } = {};
    private static _lastaCamTAngle: number = 0;
    private static _lastaCamPAngle: number = 0;

    private static _upKey: m4m.event.KeyCode = m4m.event.KeyCode.KeyW;
    private static _downKey: m4m.event.KeyCode = m4m.event.KeyCode.KeyS;
    private static _leftKey: m4m.event.KeyCode = m4m.event.KeyCode.KeyA;
    private static _rightKey: m4m.event.KeyCode = m4m.event.KeyCode.KeyD;
    private static _jumpKey: m4m.event.KeyCode = m4m.event.KeyCode.Space;
    private static _attackKey: m4m.event.KeyCode = m4m.event.KeyCode.KeyF;
    private static _runKey: m4m.event.KeyCode = m4m.event.KeyCode.ShiftLeft;
    private static _hasDirKeyDown = false;

    /** 战斗场景 头顶UI 坐标事件 */
    private static _topPosMap: TopPosMap = {};
    //是否更新头顶ui
    private static isUpdateBattleRoleTop: boolean = true;
    // tslint:disable-next-line: member-ordering
    public static showpos: any;
    /** 玩家 角色 */
    public static get player() { return this._player; }

    private static roleRotateYFunBind: any;
    public static get roleMap() {
        return this._roleMap;
    }

    public static get topPosMap() {
        return this._topPosMap;
    }
    public static set topPosMap(value: TopPosMap) {
        this._topPosMap = value;
    }
    public static setUpdateBattleRoleTop(v: boolean) {
        this.isUpdateBattleRoleTop = v;
    }

    // /** test */
    public static init() {
        let _app = m4m.framework.sceneMgr.app;
        // this.battleRoleReadyEv = new EventBase();

        //update
        LateUpdateMgr.Add(this.lateUpdate, this);
        FrameMgr.Add(this.update, this);

        //事件reg

        // EventMgr.addListener("player_make", this.onPlayerMake, this);

        //player input 事件
        EventMgr.addListener("rocker_Direction", this.onPlayerMove, this);
        EventMgr.addListener("rocker_Release", this.onPlayerRocRelease, this);
        EventMgr.addListener("rocker_JumpBtn_click", this.onJumpBtnClick, this);
        EventMgr.addListener("rocker_AttackBtn_click", this.onAttackBtnClick, this);
        EventMgr.addListener("rocker_RunBtn_Down", this.onRunDown, this);
        EventMgr.addListener("rocker_RunBtn_Up", this.onRunUp, this);
        EventMgr.addListener("rocker_View_move", this.onViewMove, this);
        EventMgr.addListener("rocker_View_down", this.onViewDown, this);
        // role Input
        EventMgr.addListener("role_make", this.onMake, this);
        EventMgr.addListener("role_remove", this.onRemove, this);
        EventMgr.addListener("role_Direction", this.onInputDir, this);
        EventMgr.addListener("role_DirRelease", this.onInputDirRelease, this);
        EventMgr.addListener("role_speedUp", this.onInputSpeedUp, this);
        EventMgr.addListener("role_speedUpRel", this.onInputSpeedUpRel, this);
        EventMgr.addListener("role_jump", this.onInputJump, this);
        EventMgr.addListener("role_attack", this.onInputAttack, this);
        EventMgr.addListener("role_setPos", this.onSetPos, this);
        EventMgr.addListener("role_setYRotate", this.onSetYRotate, this);
        EventMgr.addListener("role_setAI", this.onSetAI, this);

        //同步其他玩家信息
        EventMgr.addListener("role_Data_upDate", this.onRoleDataUpDate, this);
        EventMgr.addListener("role_view", this.setMainRoleCamInfo, this);
        //清理其他角色
        EventMgr.addListener("role_clear_Other", this.clearOtherRole, this);

        this.roleRotateYFunBind = this.roleRotateYFun.bind(this);
        //role_setYRotate
        UiDataManager.bindFunctionData(BindKeyName.RoleRotateState, this.roleRotateYFunBind);
    }
    public static getRoleByGUID(id: string) {
        return this._roleMap[id];
    }

    public static getRoleByNum(num: string) {
        for (let k in this._roleMap) {
            let role = this._roleMap[k];
            if (role.roleData.name == num) {
                return role;
            }
        }
        return null;
    }

    //获取角色有效的transform
    private static getRoleValidTrans(_role: Role) {
        if (!_role || !_role.roleDoll) { return; }
        return _role.roleDoll.model;
    }

    //---------------------------Player --------------------------
    private static onRunDown() {
        if (!this._player) { return; }
        this._player.roleCtr.handleInput(RoleActInput.SpeedUp);
    }

    public static onRunUp() {
        if (!this._player) { return; }
        this._player.roleCtr.handleInput(RoleActInput.SpeedUp_Release);
    }

    private static onViewDown() {
        this._lastaCamPAngle = StageMgr.camCtr.panAngle;
        this._lastaCamTAngle = StageMgr.camCtr.tiltAngle;
    }

    private static onViewMove(ev: EventGeneric<m4m.math.vector2>) {
        if (!this._player || !this._player.roleDoll) { return; }
        let speed = 0.1;
        StageMgr.camCtr.panAngle = this._lastaCamPAngle + ev.data.x * speed;
        StageMgr.camCtr.tiltAngle = this._lastaCamTAngle + ev.data.y * speed;
        this.adjustOrientation2Forward(this._player);
    }

    private static onJumpBtnClick() {
        if (!this._player || !this._player.roleDoll) { return; }
        this.roleIptJump(this._player);
    }

    private static onAttackBtnClick() {
        if (!this._player || !this._player.roleDoll) { return; }
        this.roleIptAttack(this._player);
    }

    private static onPlayerMove(ev: EventGeneric<m4m.math.vector2>) {
        if (!this._player || !this._player.roleDoll) { return; }
        this.mainRoleIptMove(ev.data, this._player);
    }

    private static onPlayerRocRelease() {
        this.roleIptMoveReleas(this._player);
    }

    // // 创建 player 玩家
    // private static async onPlayerMake(ev: EventGeneric<{ roleInfo: RoleAttrInfo }>) {
    //     let setPos = ev.data.roleInfo.pos;
    //     if (this._player && this._player.roleDoll) {
    //         // tslint:disable-next-line: no-shadowed-variable
    //         let pos = this._player.roleDoll.model.localPosition;
    //         //处理更新
    //         if (setPos) {
    //             console.error("玩家已存在  同步位置 ", setPos);
    //             m4m.math.vec3Set(pos, setPos.x, setPos.y, setPos.z);

    //             //暂时这样写
    //             this._player.roleDoll.model.localPosition = pos;
    //             // tslint:disable-next-line: no-shadowed-variable
    //             let m = this._player.roleDoll.model;
    //             // tslint:disable-next-line: no-shadowed-variable
    //             let rot = m.localRotate;
    //             // tslint:disable-next-line: no-shadowed-variable
    //             let angle = ev.data.roleInfo.angle;
    //             m4m.math.quatFromAxisAngle(RoleMgr.helpV3UP, angle, rot);
    //             m.localRotate = rot;

    //             StageMgr.camCtr.setTarget(this._player.roleDoll.model);
    //             StageMgr.camCtr.distance = 15;
    //             StageMgr.camCtr.setTargetOffset(0, 1.5, 0);
    //             StageMgr.camCtr.tiltAngle = 7;
    //             StageMgr.camCtr.panAngle = 0;
    //             StageMgr.camCtr.maxTileAngle = 60;
    //             StageMgr.camCtr.minTileAngle = 5;
    //             StageMgr.mainCam.fov = commTool.toRadian * 32;
    //         }
    //         return;
    //     }
    //     let _player = new Role();
    //     await _player.init(ev.data.roleInfo.roleId, ev.data.roleInfo.GUID);
    //     this._roleMap[StageMgr.PlayerGUID] = _player;
    //     this._player = _player;
    //     let pos = _player.roleDoll.model.localPosition;
    //     if (setPos) {
    //         m4m.math.vec3Set(pos, setPos.x, setPos.y, setPos.z);
    //     } else {
    //         m4m.math.vec3Set(pos, 0, 0, 0);
    //     }
    //     // console.error("玩家位置", pos);
    //     _player.roleDoll.model.localPosition = pos;
    //     let m = _player.roleDoll.model;
    //     let rot = m.localRotate;
    //     let angle = ev.data.roleInfo.angle;
    //     m4m.math.quatFromAxisAngle(RoleMgr.helpV3UP, angle, rot);
    //     m.localRotate = rot;

    //     StageMgr.camCtr.setTarget(_player.roleDoll.model);
    //     StageMgr.camCtr.distance = 15;
    //     StageMgr.camCtr.setTargetOffset(0, 1.5, 0);
    //     StageMgr.camCtr.tiltAngle = 7;
    //     StageMgr.camCtr.panAngle = 0;
    //     StageMgr.camCtr.maxTileAngle = 60;
    //     StageMgr.camCtr.minTileAngle = 5;
    //     StageMgr.mainCam.fov = commTool.toRadian * 32;
    //     this.adjustOrientation2Forward(_player);
    //     this._evMakeSuccess.data = StageMgr.PlayerGUID;
    //     //抛 make 完毕事件
    //     EventMgr.dispatchEvent("role_makeSuccess", this._evMakeSuccess);

    //     let topMap = this.battleRoleTopEv.topPosMap;
    //     topMap[StageMgr.PlayerGUID] = { active: false, pos: new m4m.math.vector2() };
    // }

    //设置看向目标参数 (主玩家视角)
    private static setMainRoleCamInfo(ev: EventGeneric<{ info: CameraViewInfo }>) {
        // console.error("设置看向目标参数 (主玩家视角) ", this._player.roleData.guid);
        StageMgr.camCtr.setTarget(this._player.roleDoll.model);
        let info = ev.data.info;
        let dis = info.distance;
        StageMgr.camCtr.distance = dis;
        let offset = info.camViewOffset;
        StageMgr.camCtr.setTargetOffset(offset.x, offset.y, offset.z);
        StageMgr.camCtr.tiltAngle = info.tiltAngle;//7;
        StageMgr.camCtr.panAngle = info.panAngle;//0;//-180
        StageMgr.camCtr.maxTileAngle = 60;
        StageMgr.camCtr.minTileAngle = 5;
        StageMgr.mainCam.fov = commTool.toRadian * 32;
        this.adjustOrientation2Forward(this._player);
        //相机 阻挡控制器
        SceneCamAvoidObsCtr.active = true;
        SceneCamAvoidObsCtr.baseDistance = dis;

        //( 特殊处理 )调整完成后 设置 旋转
        this.player.initRotate();
        //设置相机看向目标参数完成
        EventMgr.dispatchEvent("camera_View_Success", null);
    }

    /** 调整 角色的前方朝向 ，屏幕上方 */
    private static adjustOrientation2Forward(role: Role) {
        if (!role || !role.roleDoll) { return; }
        let _m = role.roleDoll.model;
        let camForward = RoleMgr.helpV3;
        StageMgr.camCtr.gameObject.transform.getForwardInWorld(camForward);
        camForward.y = 0;
        m4m.math.vec3Normalize(camForward, camForward);
        let angle = gameMathUtil.calcAngleByVec(camForward.x, camForward.z) + 90;
        let rot = RoleMgr.helpQuat;
        m4m.math.quatFromAxisAngle(RoleMgr.helpV3UP, angle, rot);
        // _m.localRotate = rot;    //人物转向 前方
        m4m.math.quatClone(rot, role.forwarddRotate);
    }

    /**
     * 获取 指定role 的前方 朝向 角度（）
     * @param role 
     * @param isRadian 是否 是弧度制
     * @returns 
     */
    public static getRoleForwardAngle(role: Role, isRadian: boolean = true) {
        let rDoll = role.roleDoll;
        if (!rDoll) { return; }
        let v3 = m4m.poolv3();
        rDoll.model.getForwardInWorld(v3);
        v3.y = 0;
        m4m.math.vec3Normalize(v3, v3);
        let fixNum = (isRadian ? gameMathUtil.toRadian : 1) * 90;
        let angle = gameMathUtil.calcAngleByVec(v3.x, v3.z, true) + fixNum;
        return angle;
    }

    private static gapTime = 0.2;//每0.2秒 轮一次
    private static newDaTime: number = 0;
    private static lateUpdate(dt: number) {

    }

    //设置 是否可移动
    public static canMove(can: boolean, isTransfer: boolean = false) {
        console.error("主角玩家是否可移动", can);
        if (can) {
            // isSingle
            if (this._player && this._player.roleData.isSingle == false) {
                this.needSynchronous = true;
            }
            // if (this._player && this._player.roleDoll) {
            //     let pos = this._player.roleDoll.model.localPosition;
            //     m4m.math.vec3Clone(pos, this.lastPos);
            // } else {
            //     console.error("主角可移动状态设置时 玩家数据未初始化完成");
            // }
        } else {
            this.needSynchronous = false;
            // console.error("this._player", this._player);
            if (this._player) {
                //强行停止
                this._player.stop(true);
            }
            this.needSynchronous = false;
        }
        if (this._player) {
            this._player.roleData.roleClientState = can ? PlayerClientState.canMove : PlayerClientState.prohibitionMove;
            if (isTransfer) {
                this._player.roleCtr.handleInput(RoleActInput.TransferState);
            }
        }
    }
    // tslint:disable-next-line: member-ordering
    public static needSynchronous: boolean = false;
    // private static lastPos: m4m.math.vector3 = new m4m.math.vector3();
    // private static posInfo = {};
    // private static syncNet(dt: number) {
    //     if (!this.needSynchronous) {
    //         return;
    //     }
    //     //需要开始同步位置
    //     this.newDaTime += dt;
    //     if (this.newDaTime >= this.gapTime) {
    //         this.newDaTime = 0;

    //         //主角位置 网络同步处理
    //         if (!this._player || !this._player.roleDoll) { return; }
    //         let pos = this._player.roleDoll.model.localPosition;
    //         let currDist = m4m.math.vec3Distance(pos, this.lastPos);
    //         if (currDist > 0) {
    //             // let vel = RoleMgr.helpV2;
    //             // m4m.math.vec2Normalize(this._player.moveVelocity, vel);
    //             // let yAngle = gameMathUtil.calcAngleByVec(vel.x, vel.y);
    //             this.posInfo["pos"] = pos;
    //             // console.error("主角位置移动 " + currDist,"   ",pos);
    //             // posA["jump"] = true;//跳也可以通过这个同步
    //             WebsocketTool.Instance.GameManager_updataGame(this.posInfo);
    //             m4m.math.vec3Clone(pos, this.lastPos);
    //         }
    //     }

    // }

    private static update(dt: number) {
        this.keyUpdate(dt);
        //是否更新头顶文本
        if (this.isUpdateBattleRoleTop) {
            this.dispatchBattleRoleTop();
        }
        //
        let _map = this._roleMap;
        // tslint:disable-next-line: no-shadowed-variable
        for (let key in _map) {
            let _r = _map[key];
            if (!_r) { continue; }
            _r.UpdateLogic(dt);
            //debugDraw
            if (GameMgr.Draw2dDebug) {
                _r.UpdateDebugDraw(dt);
            }
        }
        //
        // this.syncNet(dt);
    }

    // tslint:disable-next-line: cyclomatic-complexity
    private static keyUpdate(dt: number) {
        if (!this._player || !this._player.roleDoll) { return; }
        let _p = this._player;
        let iptMgr = m4m.framework.sceneMgr.app.getInputMgr();
        // console.error(this._hasDirKeyDown,"按键  ",iptMgr.KeyDownCount());
        let _WDown = iptMgr.GetKeyDown(RoleMgr._upKey);
        let _SDown = iptMgr.GetKeyDown(RoleMgr._downKey);
        let _ADown = iptMgr.GetKeyDown(RoleMgr._leftKey);
        let _DDown = iptMgr.GetKeyDown(RoleMgr._rightKey);
        let _KongDown = iptMgr.GetKeyDown(RoleMgr._jumpKey);
        let _FAttack = iptMgr.GetKeyDown(RoleMgr._attackKey);
        if (_WDown || _SDown || _ADown || _DDown || _KongDown || _FAttack) {
            //有方向键被按下
        } else {
            if (this._hasDirKeyDown) {
                this._hasDirKeyDown = false;
                this.roleIptMoveReleas(this._player);
            }
            return;
        }
        let vel = RoleMgr.helpV2;
        //方向向量归零
        vel.x = 0;
        vel.y = 0;
        if (_WDown || _SDown || _ADown || _DDown) {
            if (_p.roleCtr.state.state != RoleActInput.Attack) {
                if (_WDown) {
                    this._hasDirKeyDown = true;
                    vel.y += 1;
                }
                if (_SDown) {
                    this._hasDirKeyDown = true;
                    vel.y += -1;
                }
                if (_ADown) {
                    this._hasDirKeyDown = true;
                    vel.x += -1;
                }
                if (_DDown) {
                    this._hasDirKeyDown = true;
                    vel.x += 1;
                }
            }
        }
        if (this._hasDirKeyDown) {
            m4m.math.vec2Normalize(vel, vel);
            this.mainRoleIptMove(vel, this._player);
        }
        //
        if (_KongDown) {
            if (_p.roleCtr.state.state != RoleActInput.Attack) {
                this.roleIptJump(_p);
            }
        }
        if (_FAttack) {
            this.roleIptAttack(_p);
        }
        if (iptMgr.GetKeyDown(RoleMgr._runKey)) {
            this.roleIptSpeedUp(_p);
        } else if (iptMgr.GetKeyUP(RoleMgr._runKey)) {
            this.roleIptSpeedUpReleas(_p);
        }
    }

    /**
     * 主角色移动调用 同步服务器
     * @param dir 移动方向
     * @param role 角色
     */
    private static mainRoleIptMove(dir: m4m.math.vector2, role: Role) {
        if (!role || !role.roleDoll) { return; }
        // console.log("角色移动 输入", dir);
        // //计算移动朝向
        // m4m.math.vec2Clone(dir, role.moveVelocity);
        // m4m.math.vec2ScaleByNum(role.moveVelocity, role.moveSpeed, role.moveVelocity);
        this.roleIptMove(dir, role);
    }

    /** 同步其他玩家信息*/
    private static onRoleDataUpDate(ev: EventGeneric<{ data: RoleServerInfo }>) {
        let roleServerInfo = ev.data.data;
        let guid = roleServerInfo.GUID;
        let r = this._roleMap[guid];
        if (!r || !r.roleDoll) { return; }
        if (roleServerInfo.pos) {
            r.roleDoll.moveToTarget(roleServerInfo.pos, roleServerInfo.moveTime, roleServerInfo.moveType);
        }
        //血量
        if (roleServerInfo.hp != null) {
            r.setHp(roleServerInfo.hp);
        }
        //状态
        r.roleData.roleState = roleServerInfo.roleState;
        r.roleData.inGameState = roleServerInfo.inGameStatus;
        // if (r.roleData.isMainPlayer()) {
        //     console.error(roleServerInfo.pos, roleServerInfo.roleState + "主玩家游戏中状态更新 ", r.roleData.inGameState);
        // } else {
        //     // console.error(roleServerInfo.pos, roleServerInfo.roleState + "其他玩家游戏中状态更新 ", r.roleData.inGameState);
        // }
    }

    //--------------------------------------------------------------------------

    //--------------------------------- Role-------------------------------------
    /**
     * 创建角色
     * @param ev <{roleId: 角色配置ID ， GUID：唯一ID} >
     */
    private static async onMake(ev: EventGeneric<{ roleInfo: RoleAttrInfo }>) {
        let roleInfo = ev.data.roleInfo;
        let guid = roleInfo.GUID;
        let numStr = roleInfo.num.toString();
        // console.log(numStr);
        if (this._roleMap[guid]) {
            let role = this._roleMap[guid];
            role.roleData.setData(roleInfo);
            // console.error(role.roleData.angle, "设置位置****：", role.roleData.pos, "状态 ", role.roleData.roleState);
            if (role && role.roleDoll) {
                // tslint:disable-next-line: no-shadowed-variable
                let setPos = role.roleData.pos;
                // console.error("玩家已存在  同步位置 ", setPos);
                // tslint:disable-next-line: no-shadowed-variable
                let pos = m4m.poolv3();
                if (setPos) {
                    m4m.math.vec3Set(pos, setPos.x, setPos.y, setPos.z);
                    role.roleDoll.model.localPosition = pos;
                }
                // // tslint:disable-next-line: no-shadowed-variable
                // let m = role.roleDoll.model;
                // // tslint:disable-next-line: no-shadowed-variable
                // let rot = m.localRotate;
                // // tslint:disable-next-line: no-shadowed-variable
                // m4m.math.quatFromAxisAngle(RoleMgr.helpV3UP, role.roleData.angle, rot);
                // m.localRotate = rot;

                //设置旋转角度
                role.localRotate = role.roleData.angle;

                // tslint:disable-next-line: no-shadowed-variable
                let _evMakeSuccess = new EventGeneric<string>();
                _evMakeSuccess.data = guid;

                //不是npc
                if (!guid.startsWith("N")) {
                    let data = this._topPosMap[guid];
                    data.name = numStr;
                    role.roleData.name = numStr;
                    role.roleDoll.setNum(numStr);
                } else {
                    role.roleData.name = guid;
                }

                // console.error("调试:102901:抛make完毕事件, 已经存在: ", guid);
                //抛 make 完毕事件
                EventMgr.dispatchEvent("role_makeSuccess", _evMakeSuccess);
                UiDataManager.changeFunctionData(BindKeyName.roleMakeSuccess, guid);
                //切换为站立状态
                role.roleCtr.handleInput(RoleActInput.Direction_Release);
            }
            return;
        }

        let _r = new Role();
        _r.roleData.setData(roleInfo);
        // _r.roleData.pos = roleInfo.pos;
        // _r.roleData.angle = roleInfo.angle;
        // _r.roleData.isSingle = roleInfo.isSingle;
        // _r.roleData.roleState = roleInfo.roleState;
        _r.roleData.name = numStr;
        // if (roleInfo.defDiePerformance) {
        //     _r.roleData.defDiePerformance = roleInfo.defDiePerformance;
        // }

        // console.error("设置位置：", _r.roleData.pos, "状态 ", _r.roleData.roleState);
        //不是npc
        if (!guid.startsWith("N")) {
            this._topPosMap[guid] = { active: false, pos: new m4m.math.vector2(), name: numStr, hpNormal: 0 };
        }
        await _r.init(roleInfo.roleType, guid);
        this._roleMap[guid] = _r;
        //设置主玩家
        if (guid == StageMgr.PlayerGUID) {
            this._player = _r;
        }
        // setTimeout(async () => {

        let setPos = _r.roleData.pos;
        let m = _r.roleDoll.model;

        // let pos = m.localPosition;
        let pos = m4m.poolv3();
        if (setPos) {
            // console.error(_r.roleData.pos, _r.roleData.angle, " 玩家初始位置位置 ", roleInfo, setPos);
            m4m.math.vec3Set(pos, setPos.x, setPos.y, setPos.z);
            m.localPosition = pos;
            this.showpos = pos;
        }
        // let rot = m.localRotate;
        // m4m.math.quatFromAxisAngle(RoleMgr.helpV3UP, _r.roleData.angle, rot);
        // m.localRotate = rot;            
        //设置旋转角度
        _r.localRotate = _r.roleData.angle;

        //不是npc
        if (!guid.startsWith("N")) {
            this._topPosMap[guid] = { active: false, pos: new m4m.math.vector2(), name: numStr, hpNormal: 0 };
            //随机脸
            _r.roleDoll.makePlayerFace();
        } else {
            _r.roleData.name = guid;
        }

        let _evMakeSuccess = new EventGeneric<string>();
        _evMakeSuccess.data = guid;

        // console.error("调试:102901:抛make完毕事件, 新的: ", guid);
        //抛 make 完毕事件
        EventMgr.dispatchEvent("role_makeSuccess", _evMakeSuccess);
        // }, 5000);
        UiDataManager.changeFunctionData(BindKeyName.roleMakeSuccess, guid);
    }

    public static test(id: string) {
        EventMgr.dispatchEvent("role_remove", { data: id });
    }

    /**
     * 清理所有其他角色
     */
    private static clearOtherRole() {
        for (let guid in this._roleMap) {
            if (guid == StageMgr.PlayerGUID) {
                //主玩家不清理
            } else {
                this.removeRole(guid);
            }
        }
    }
    /**
     * 删除指定的其他角色
     * @param ev <唯一ID> 
     */
    private static onRemove(ev: EventGeneric<string>) {
        let guid = ev.data;
        this.removeRole(guid);
    }
    private static removeRole(guid: string) {
        let r = this._roleMap[guid];
        if (!r) {
            console.error("需要删除的角色不存在！", guid);
            return;
        }
        //恢复武器
        r.changeWeapons(Weapons.none);
        delete this._roleMap[guid];
        delete this._topPosMap[guid];
        //回收到池子。。
        r.dispose();
    }

    /** 设置 位置 */
    private static onSetPos(ev: EventGeneric<{ GUID: string, pos: m4m.math.vector3 }>) {
        let guid = ev.data.GUID;
        let r = this._roleMap[guid];
        if (!r || !r.roleDoll) { return; }
        let m = r.roleDoll.model;
        m.localPosition = ev.data.pos;
    }

    /** 设置 方向 */
    private static onSetYRotate(ev: EventGeneric<{ GUID: string, yAngle: number }>) {
        let guid = ev.data.GUID;
        let r = this._roleMap[guid];
        if (!r || !r.roleDoll) { return; }
        // let m = r.roleDoll.model;
        // let rot = m.localRotate;
        // let angle = ev.data.yAngle;
        // m4m.math.quatFromAxisAngle(RoleMgr.helpV3UP, angle, rot);
        // m.localRotate = rot;

        let angle = ev.data.yAngle;
        r.localRotate = angle;
    }

    //设置 方向
    private static roleRotateYFun(data) {
        console.error("侦听设置玩家方向", data.yAngle);
        let guid = data.GUID;
        let r = this._roleMap[guid];
        if (!r || !r.roleDoll) { return; }

        let angle = data.yAngle;
        r.localRotate = angle;
    }

    /** 输入方向 摇杆*/
    private static onInputDir(ev: EventGeneric<{ GUID: string, dir: m4m.math.vector2 }>) {
        let guid = ev.data.GUID;
        if (!this._roleMap[guid]) { return; }
        this.roleIptMove(ev.data.dir, this._roleMap[guid]);
    }

    /** 输入方向 摇杆释放*/
    private static onInputDirRelease(ev: EventGeneric<{ GUID: string }>) {
        let guid = ev.data.GUID;
        if (!this._roleMap[guid]) { return; }
        this.roleIptMoveReleas(this._roleMap[guid]);
    }
    /** 输入 加速*/
    private static onInputSpeedUp(ev: EventGeneric<{ GUID: string }>) {
        let guid = ev.data.GUID;
        if (!this._roleMap[guid]) { return; }
        this.roleIptSpeedUp(this._roleMap[guid]);
    }
    /** 输入 加速释放 */
    private static onInputSpeedUpRel(ev: EventGeneric<{ GUID: string }>) {
        let guid = ev.data.GUID;
        if (!this._roleMap[guid]) { return; }
        this.roleIptSpeedUpReleas(this._roleMap[guid]);
    }
    /** 输入 跳跃 */
    private static onInputJump(ev: EventGeneric<{ GUID: string }>) {
        let guid = ev.data.GUID;
        if (!this._roleMap[guid]) { return; }
        this.roleIptJump(this._roleMap[guid]);
    }
    /** 输入攻击 */
    private static onInputAttack(ev: EventGeneric<{ GUID: string }>) {
        let guid = ev.data.GUID;
        if (!this._roleMap[guid]) { return; }
        this.roleIptAttack(this._roleMap[guid]);
    }
    /** 设置AI */
    private static onSetAI(ev: EventGeneric<{ GUID: string, aiType: number }>) {
        let guid = ev.data.GUID;
        if (!this._roleMap[guid]) { return; }
        this._roleMap[guid].setAI(ev.data.aiType);
    }

    //---------------------------------------------------------------------------
    /**
     * 角色移动 输入
     * @param dir 移动方向
     * @param role 角色
     */
    private static roleIptMove(dir: m4m.math.vector2, role: Role) {
        if (!role || !role.roleDoll) { return; }
        // console.log("角色移动 输入", dir);
        if (role.roleData.canMove == false) {
            this.roleIptMoveReleas(role);
            return;
        }
        //计算移动朝向
        m4m.math.vec2Clone(dir, role.moveVelocity);
        // m4m.math.vec2Normalize(dir, dir);
        // console.log("角色移动 输入", dir);

        //每次移动固定的距离
        let moveDistance = role.moveSpeed;
        if (role.isTarPointMove) {
            moveDistance = RoleMgr.moveDistance;//1;// 不同游戏可能会需要设置不同参数
            // moveSpeed = 10;
        }
        m4m.math.vec2ScaleByNum(role.moveVelocity, moveDistance, role.moveVelocity);

        // m4m.math.vec3Add(this.position, moveVelocity, this.targetPoint);

        //控制输入
        role.roleCtr.handleInput(RoleActInput.Direction);
    }
    // tslint:disable-next-line: member-ordering
    public static moveDistance: number = 1;//每走一步的距离  后续在服务器配置中取得

    /** 角色移动 输入 释放 */
    private static roleIptMoveReleas(role: Role) {
        if (!role) { return; }
        // console.error("角色移动 输入 释放  速度设为 0");
        m4m.math.vec2SetAll(role.moveVelocity, 0);
        // //控制输入
        // role.roleCtr.handleInput(RoleActInput.Direction_Release);
    }

    /** 角色 输入 加度按键 */
    private static roleIptSpeedUp(role: Role) {
        if (!role) { return; }
        role.roleCtr.handleInput(RoleActInput.SpeedUp);
    }

    /** 角色 输入 加度按键释放 */
    private static roleIptSpeedUpReleas(role: Role) {
        if (!role) { return; }
        role.roleCtr.handleInput(RoleActInput.SpeedUp_Release);
    }

    /** 角色 输入 跳跃按键 */
    private static roleIptJump(role: Role) {
        if (!role || !role.roleData.canMove) { return; }
        // console.log("角色 输入 跳跃按键  跳跳跳！",TimeUtil.realtimeSinceStartup);
        role.roleCtr.handleInput(RoleActInput.Jump);
    }

    /** 角色 输入 攻击按键 */
    private static roleIptAttack(role: Role) {
        if (!role || !role.canAttack()) { return; }
        role.roleCtr.handleInput(RoleActInput.Attack, role.roleCtr.state);
    }

    /** 角色 头顶显示UI 坐标同步 */
    private static dispatchBattleRoleTop() {
        // tslint:disable-next-line: no-shadowed-variable
        for (let key in this._roleMap) {
            let role = this._roleMap[key];
            let data = this._topPosMap[key];
            if (data) {
                data.active = false;
                if (!role || !role.roleDoll || !role.roleDoll.model.gameObject.visible) { continue; }
                let posTop = this.helpV3;
                role.roleDoll.getTopPos(posTop);
                data.active = this.isInView(m4m.framework.sceneMgr.scene.mainCamera, posTop);
                //
                if (data.active) {
                    this.setTopUIPos(posTop, data.pos);
                    data.hpNormal = role.roleData.getHpNormal();
                }
                if (role.roleData.dieTime >= 3) {//3秒后隐藏名字
                    data.active = false;
                }
            }
        }
        UiDataManager.changeFunctionData(BindKeyName.battleRoleTopTos, this._topPosMap);
    }

    public static setTopUIPos(wPos: m4m.math.vector3, posUI: m4m.math.vector2, _yOffset = 0, UIoffset: m4m.math.vector2 = null) {
        if (!posUI) { return; }
        let clipP = this.helpV3;
        let realWpos = this.helpV3v1;
        m4m.math.vec3Set(realWpos, wPos.x, wPos.y + _yOffset, wPos.z);
        let _cam = m4m.framework.sceneMgr.scene.mainCamera;
        _cam.calcClipPosFromWorldPos(m4m.framework.sceneMgr.app, realWpos, clipP);
        let canvas = UiManager.overlay.canvas;
        canvas.clipPosToCanvasPos(clipP, posUI);

        if (UIoffset) {
            m4m.math.vec2Add(posUI, UIoffset, posUI);
        }
    }

    public static isInView(camera: m4m.framework.camera, worldPos: m4m.math.vector3): boolean {
        let camTransform = camera.gameObject.transform;

        let dir: m4m.math.vector3 = new m4m.math.vector3();
        m4m.math.vec3Subtract(worldPos, camTransform.localPosition, dir);
        m4m.math.vec3Normalize(dir, dir);

        let forward: m4m.math.vector3 = new m4m.math.vector3();
        camTransform.getForwardInWorld(forward);
        let dot: number = m4m.math.vec3Dot(forward, dir);
        //判断物体是否在相机前面
        if (dot > 0) {
            return true;
        }
        return false;
    }

}

export class TopPosMap {
    [key: string]: {
        active: boolean;
        pos: m4m.math.vector2;
        name: string;
        hpNormal: number;
        color?: m4m.math.color;
    }
}