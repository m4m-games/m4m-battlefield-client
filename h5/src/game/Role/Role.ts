import { UiDataManager } from "PSDUI/UiDataManager";
import { RoleBase } from "RoleBase";
import { commTool } from "Tools/commTool";
import { DebugLineTool2d } from "Tools/DebugLineTool2d";
import { IDispose, ISpTransform } from "Tools/engineParallel/spInterface";
import { gameMathUtil } from "Tools/gameMathUtil";
import { metaUIManager } from "UIBase/metaUIManager";
import { EffectMgr } from "../Core/EffectMgr";
import { PoolMgr } from "../Core/PoolMgr";
import { StageMgr } from "../Core/StageMgr";
import { HitType, InGameStatus, PlayerMoveType, PlayerStatus, RoleActInput, Weapons } from "../GameEnum";
import { GameMgr } from "../GameMgr";
import { UserDataManager } from "../Manager/UserDataManager";
import { WebsocketTool } from "../Net/WebsocketTool";
import { AttackState } from "./actStates/AttackState";
import { IRoleActState } from "./actStates/RoleActState";
import { AIType } from "./AI/AiInterface";
import { MainRoleDoll } from "./MainRoleDoll";
import { RoleAI } from "./RoleAI";
import { GameDiePerformanceEnum, RoleServerInfo, RoleTypeEnum } from "./RoleAttrInfo";
import { RoleController } from "./RoleController";
import { RoleData } from "./RoleData";
import { RoleDoll } from "./RoleDoll";
import { RoleMgr } from "./RoleMgr";

/**
 * 角色 对象
 * [数据,网络,渲染模型]
 */
export class Role implements IDispose {
    /** 角色场景对象 */
    public roleDoll: RoleDoll;
    /** 角色数据 */
    public roleData: RoleData = new RoleData();
    /** 角色控制器 */
    public roleCtr: RoleController;
    /** 角色AI */
    public roleAi: RoleAI;
    // public skillMgr: ActorSkillMgr;
    // public buffMgr: ActorBuffMgr;
    public roleID: number;
    /**跳跃 移速缩放 */
    public jumpMoveSpeedScale = 0.5;
    /**奔跑 移速缩放 */
    public runMoveSpeed = 4.5;
    /** 移动速度 */
    public moveSpeed: number = 3;
    /** 跳跃加速度 */
    public jumpVelocity: number;
    /** 当前武器 */
    public currWeapons: Weapons = Weapons.none;
    /** 当前武器模型 */
    public currWeaponsDoll: ISpTransform = null;
    /** 攻击 等待时间(s) */
    public attackStateWaitTime: number = 0;
    /** 攻击间隔时间(s) */
    public attactIntervalTime: number = 0;
    public hasDestroy = false;
    public AICalcData: {};

    private static readonly helpV2 = new m4m.math.vector2();
    private static readonly helpV2v1 = new m4m.math.vector2();
    private static readonly helpV2V2 = new m4m.math.vector2();
    private static readonly helpV3 = new m4m.math.vector3();
    private static readonly helpV3UP = new m4m.math.vector3(0, 1, 0);
    private _forwarddRotate: m4m.math.quaternion = new m4m.math.quaternion();
    private config: RoleBase;
    private _moveVelocity: m4m.math.vector2 = new m4m.math.vector2();
    private _isAttacking = false;
    //这一次攻击是否已经造成伤害
    private _isDamage: boolean = false;
    /** 当前速度 */
    private _nowSpeed: number = 0;

    /** 是否跑步速度 */
    public get isRunSpeed() {
        return this._nowSpeed == this.runMoveSpeed;
    }

    //根据给出目标点 进行移动模式
    private _isTarPointMove: boolean = true;

    public get isTarPointMove() { return this._isTarPointMove; }

    public get roleConfigBase(): RoleBase { return this.config; }

    /** 是否攻击中 */
    public get isAttacking() { return this._isAttacking; }
    public set isAttacking(value: boolean) { this._isAttacking = value; }
    /**
     * 前方旋转
     */
    public get forwarddRotate() { return this._forwarddRotate; }
    /**
     * 移动 速度向量
     */
    public get moveVelocity() { return this._moveVelocity; }
    public set moveVelocity(val) { m4m.math.vec2Clone(val, this._moveVelocity); }

    // private skillMgr: ActorSkillMgr;
    // private buffMgr: ActorBuffMgr;
    // private hitMgr: ActorHit;
    public async init(roleType: RoleTypeEnum, guid: string) {
        // this.roleDoll = new RoleDoll();
        // this.roleDoll.role = this;
        this.roleData.roleType = roleType;
        this.roleID = this.roleData.getRoleID();
        this.roleData.guid = guid;

        //后续如果玩家间有不同速度 这是改掉
        this.moveSpeed = UserDataManager.Instance.moveSpeed;
        this.runMoveSpeed = UserDataManager.Instance.runSpeed;

        //角色控制器
        this.roleCtr = new RoleController(this);

        // this.hitMgr.Init(this);
        let roleResName = "";
        let roleScale = 1;
        //获取role 表配置
        // this.config = await RoleBase.getDataByID(this.roleID);
        let data = await RoleBase.getAllData();
        this.config = data.get(this.roleID);
        roleResName = this.config.name;
        roleScale = this.config.bodyScale;

        //res 3d model
        let _rd;
        if (guid == StageMgr.PlayerGUID) {
            //主角玩家
            _rd = new MainRoleDoll();
        } else {
            _rd = new RoleDoll();
        }
        await _rd.init(roleResName);
        this.roleDoll = _rd;
        this.roleDoll.role = this;
        //设置玩家编号
        this.roleDoll.setNum(this.roleData.name);
        // this.initAnimTimeEvent();
        //缩放
        m4m.math.vec3SetAll(this.roleDoll.model.localScale, roleScale);
        this.roleDoll.model.localScale = this.roleDoll.model.localScale;
    }

    public UpdateDebugDraw(dt: number) {
        if (this.roleDoll) {
            let cam = m4m.framework.sceneMgr.scene.mainCamera;
            let canvas = metaUIManager.ActiveSelf.overlay.canvas;
            let pos = this.roleDoll.model.localPosition;
            let sP = Role.helpV2V2;
            commTool.calcuUIPosBy3DPos(cam, canvas, pos, sP);
            //绘制圆点
            DebugLineTool2d.drawCircle(sP, 5, 3, 6);

            //
            let eP = Role.helpV2v1;
            let epV3 = Role.helpV3;
            m4m.math.vec3Set(epV3, this._moveVelocity.x * dt, 0, this._moveVelocity.y * dt);
            m4m.math.quatTransformVector(this.forwarddRotate, epV3, epV3);
            m4m.math.vec3Add(epV3, pos, epV3);
            commTool.calcuUIPosBy3DPos(cam, canvas, epV3, eP);
            //绘制角色速度线
            // DebugLineTool2d.drawLine(sP, eP, 3, 4);
        }
    }

    // 更新
    public UpdateLogic(dt: number) {
        // if (this.skillMgr) {
        //     this.skillMgr.UpdateLogic(deltaTime);
        // }
        // if (this.buffMgr) {
        //     this.buffMgr.UpdateLogic(deltaTime);
        // }
        if (this.roleAi) {
            this.roleAi.update(dt);
        }

        this.attackUpdate(dt);

        if (this.roleCtr) {
            this.roleCtr.update(dt);
        }
        if (this.roleDoll) {
            this.roleDoll.UpdateLogic(dt);
        }
        //死亡动画播放判定
        this.dieStateOpinion(dt);
    }

    public dispose() {
        if (this.hasDestroy) {
            return;
        }

        this.hasDestroy = true;
        // if (this.skillMgr) { this.skillMgr.OnDestroy(); }
        // if (this.buffMgr) { this.buffMgr.OnDestroy(); }
        if (this.roleDoll) { this.roleDoll.dispose(); }
        if (this.roleAi) { this.roleAi.dispose(); }
        if (this.roleCtr) { this.roleCtr.dispose(); }
        // this.skillMgr = null;
        // this.buffMgr = null;
        this.roleDoll = null;
        this.roleCtr = null;
        this.roleAi = null;
        //父类回收
        //GameObjectManager.RecycleLuaObject(this)

        this.roleData.dispose();
        this.roleData = null;
    }

    public setAI(aiType: AIType) {
        this.roleAi = new RoleAI(this, aiType);
    }

    //初始化旋转
    public initRotate() {
        this.localRotate = this.roleData.angle;
    }
    //设置旋转
    public set localRotate(angle: number) {
        if (!this.roleDoll) { return; }
        let m = this.roleDoll.model;
        let rot = m.localRotate;
        m4m.math.quatFromAxisAngle(Role.helpV3UP, angle, rot);
        m.localRotate = rot;
    }

    //强行停止移动
    public stop(trueStop: boolean = false) {
        m4m.math.vec2SetAll(this.moveVelocity, 0);
        if (this.roleDoll) {
            this.roleDoll.stop(trueStop);
        }
    }
    /**
     * 角色行走
     * @param dt 
     * @param scale 速度缩放
     */
    public walk(dt: number, scale: number = 1) {
        if (!this.roleDoll) { return; }
        // console.error("0000 ",this._moveVelocity);
        if (this.roleDoll.canMove) {
            //暂时处理 后续改掉  TODO 余群枝
            let v2 = Role.helpV2;
            m4m.math.vec2ScaleByNum(this._moveVelocity, scale, v2);
            if (this._isTarPointMove) {
                //根据算出的目标点进行移动
                let mainRoledoll: MainRoleDoll = this.roleDoll as MainRoleDoll;
                if (mainRoledoll && mainRoledoll.startMove) {
                    let moveType = PlayerMoveType.walk;
                    // console.log("当前行为状态 ", this.roleCtr.state.state);
                    // tslint:disable-next-line: switch-default
                    switch (this.roleCtr.state.state) {
                        case RoleActInput.Direction:
                            moveType = PlayerMoveType.walk;
                            this._nowSpeed = this.moveSpeed;
                            break;
                        case RoleActInput.Jump:
                            moveType = PlayerMoveType.jump;
                            break;
                        case RoleActInput.SpeedUp:
                            moveType = PlayerMoveType.run;
                            this._nowSpeed = this.runMoveSpeed;
                            // tslint:disable-next-line: switch-final-break
                            break;
                    }
                    mainRoledoll.startMove(v2, this._nowSpeed, this._forwarddRotate, moveType);
                }
            } else {
                this.roleDoll.walkStep(dt, v2, this._forwarddRotate);
            }
        }
    }

    /** 是否能攻击 */
    public canAttack(): boolean {
        return this.currWeapons != Weapons.none && !this._isAttacking && this.attackStateWaitTime + this.attactIntervalTime <= 0;
    }

    /** 攻击 */
    public attack(prevState: IRoleActState) {
        this._isAttacking = true;
        this._isDamage = false;
        //根据上一个状态播放动画
        let anim: string = null;
        // if (prevState.state == RoleActInput.Direction_Release) {
        anim = "SwordAttack";
        // } else if (prevState.state == RoleActInput.Direction) {
        //     anim = "SwordAttackWalk";
        // } else if (prevState.state == RoleActInput.SpeedUp) {
        //     anim = "SwordAttackRun";
        // }
        if (anim) {
            this.roleDoll.playAnim(anim as any);
            this.attackStateWaitTime = this.roleDoll.animationCtr.getStateTimeLength(anim as any);
        }
    }

    public setHp(v: number) {
        if (this.roleData.CurHp > v) {
            this.hit(HitType.Bloom);
        }
        this.roleData.CurHp = v;
    }

    /** 角色受伤 */
    public hit(hitType: HitType) {
        let v3Pos = new m4m.math.vector3(0, 0, 0);
        EffectMgr.setPlay(hitType as any, v3Pos, 1, null, this.roleDoll.model, null, false);
    }

    public die() {
        this.roleCtr.handleInput(RoleActInput.Die);
    }

    public revive() {
        this.roleCtr.handleInput(RoleActInput.Revive);
    }

    //掉落
    public dropOut() {
        this.roleCtr.handleInput(RoleActInput.DropOut);
    }

    public jump() {
        //计算移动朝向
        m4m.math.vec2Clone(new m4m.math.vector2(1, 0), this.moveVelocity);
        //每次移动固定的距离
        let moveSpeed = 2;
        m4m.math.vec2ScaleByNum(this.moveVelocity, moveSpeed, this.moveVelocity);
        let mainRoledoll: MainRoleDoll = this.roleDoll as MainRoleDoll;
        // if (mainRoledoll && mainRoledoll.startMove) {
        //     mainRoledoll.startMove(this.moveVelocity, this.moveSpeed, this._forwarddRotate);
        // }

        this.roleCtr.handleInput(RoleActInput.Jump);
    }

    /** 切换武器 */
    public async changeWeapons(weapon: Weapons) {
        // if (this.currWeaponsDoll) {
        //     this.currWeaponsDoll.dispose();
        //     this.currWeaponsDoll = null;
        // }
        this.currWeapons = weapon;
        // if (weapon == Weapons.bat) {
        //     let m = this.roleDoll.model.find("Bip001 R Hand");
        //     if (m) {
        //         let model = await PoolMgr.baseModlePool.newObj("qiubang", GameMgr.itemPath_Policy("qiubang"), GameMgr.engineParallel);
        //         this.currWeaponsDoll = model;
        //         model.localPosition = new m4m.math.vector3(-0.167, 0, 0);
        //         model.localEulerAngles = new m4m.math.vector3(-90, 0, -90);
        //         model.localScale = new m4m.math.vector3(100, 100, 100);
        //         m.addChild(model);
        //     }
        // } else if (weapon == Weapons.dao) {
        //     let m = this.roleDoll.model.find("Bip001 R Hand");
        //     if (m) {
        //         let model = await PoolMgr.baseModlePool.newObj("dao", GameMgr.itemPath_Policy("dao"), GameMgr.engineParallel);
        //         this.currWeaponsDoll = model;
        //         model.localPosition = new m4m.math.vector3(-0.182, 0.068, 0.02);
        //         model.localEulerAngles = new m4m.math.vector3(-0.004, 180.02, -269.94);
        //         model.localScale = new m4m.math.vector3(3, 3, 3);
        //         m.addChild(model);
        //     }
        // }
        // this.roleCtr.handleInput(RoleActInput.Direction_Release);
    }

    // /** 根据当前手持武器获取对应状态需要播放的动画 */
    // public getWeaponsAnimByState(state: RoleActInput): string {
    //     switch (this.currWeapons) {
    //         case Weapons.none:
    //             if (state == RoleActInput.Direction_Release) {
    //                 return "Idle";
    //             } else if (state == RoleActInput.Direction) {
    //                 return "Walk";
    //             } else if (state == RoleActInput.SpeedUp) {
    //                 return "Run";
    //             }
    //             break;
    //         case Weapons.bat:
    //             if (state == RoleActInput.Direction_Release) {
    //                 return "";
    //             } else if (state == RoleActInput.Direction) {
    //                 return "";
    //             } else if (state == RoleActInput.SpeedUp) {
    //                 return "";
    //             }
    //             break;
    //         default:
    //     }
    //     return null;
    // }

    //死亡动画播放判定
    private dieStateOpinion(dt: number) {
        // 
        //如果当前玩家是死亡状态
        if (this.roleData.inGameState == InGameStatus.inGameDead) {
            //设置为等死状态
            this.roleCtr.handleInput(RoleActInput.WaitForDeath);

            // if (this.roleData.defDiePerformance == GameDiePerformanceEnum.DropOutDie) {
            //     //
            //     //如果当前不是掉落状态机
            //     if (this.roleCtr.state.state != RoleActInput.DropOut) {
            //         if (this.roleCtr.state.canSwitch) {
            //             this.roleCtr.handleInput(RoleActInput.DropOut);
            //         } else {
            //             this.roleCtr.state.out();
            //         }
            //     }
            // } else {
            //     //如果当前不是死亡状态机
            //     if (this.roleCtr.state.state != RoleActInput.Die) {
            //         if (this.roleCtr.state.canSwitch) {
            //             this.roleCtr.handleInput(RoleActInput.Die);
            //         } else {
            //             this.roleCtr.state.out();
            //         }
            //     }
            // }
        }
        if (this.roleCtr.state.state == RoleActInput.Die) {
            this.roleData.dieTime += dt;
        } else {
            this.roleData.dieTime = 0;
        }
    }

    private attackUpdate(dt: number) {
        this.attackStateWaitTime -= dt;
        if (this._isAttacking) {
            if (!this._isDamage && this.attackStateWaitTime <= 0.4 && this.roleData.isMainPlayer()) {
                this._isDamage = true;
                //console.log("攻击造成伤害...");
                //给服务器发送攻击消息
                let role = new RoleServerInfo();
                role.hitType = 1;
                role.pos = this.roleDoll.model.localPosition;
                role.rot = RoleMgr.getRoleForwardAngle(this);
                // console.log("你自己发起攻击:", role.hitType, role.pos.toString(), role.rot);
                WebsocketTool.Instance.GameManager_updataGame(role);
            }
            if (this.attackStateWaitTime <= 0) {
                this._isAttacking = false;
                this.roleCtr.handleInput(RoleActInput.Direction_Release);
                //console.log("攻击结束...");
            }
        }
    }
}