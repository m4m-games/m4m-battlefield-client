import { UiDataManager } from "PSDUI/UiDataManager";
import { TimeUtil } from "Time/TimeUtil";
import { gameMathUtil } from "Tools/gameMathUtil";
import { AudioEnum } from "../../Audio/AudioEnum";
import { AudioPlayer } from "../../Audio/AudioPlayer";
import { BindKeyName } from "../../Data/BindKeyName";
import { InGameStatus, PlayerStatus, RoleActInput } from "../../GameEnum";
import { MainRoleDoll } from "../MainRoleDoll";
import { Role } from "../Role";
import { IRoleActState } from "./RoleActState";

export class JumpState implements IRoleActState {
    public timeOut: number = 0;
    public state: number = RoleActInput.Jump;
    private static jumpMaxVel = 5;
    //跳 状态  可切换 
    private static stateArr: RoleActInput[] = [];
    //跳 状态完成  可切换 
    private static stateArr2: RoleActInput[] = [];

    //上一帧y轴速度
    private _prevJumpSpeed: number = 0;
    private _droping: boolean = false;
    //跳跃中
    private _jumping: boolean = false;
    public enter(_role: Role) {
        _role.jumpVelocity = JumpState.jumpMaxVel;
        _role.roleDoll.playAnim("Jump1");
        this._droping = true;
        this._jumping = true;
    }
    constructor() {
        JumpState.stateArr = [RoleActInput.TransferState, RoleActInput.Die, RoleActInput.DropOut];
        JumpState.stateArr2 = [RoleActInput.Direction, RoleActInput.Direction_Release, RoleActInput.SpeedUp, RoleActInput.Jump, RoleActInput.DropOut, RoleActInput.PreparePull,
        RoleActInput.RightPreparePull, RoleActInput.RightPulltheRope];
    }

    // public handleInput(_role: Role, _input: RoleActInput): IRoleActState {
    //     return null;
    // }

    public canChange(_input: RoleActInput): boolean {
        if (this._jumping) {
            return JumpState.stateArr.indexOf(_input) != -1;
        }
        return JumpState.stateArr2.indexOf(_input) != -1;
    }

    //开始退出当前行为状态
    public out() {
    }

    public update(_role: Role, dt: number) {
        if (!_role || !_role.roleDoll || !this._droping) { return; }
        //空中移动减速
        //检查播放 跳跃动画
        //跳到一定高度 
        let currYVel = _role.jumpVelocity;
        currYVel -= dt * gameMathUtil.G;
        _role.jumpVelocity = currYVel;
        let pos = _role.roleDoll.model.localPosition;
        pos.y += currYVel * dt;
        _role.roleDoll.model.localPosition = pos;
        let shadowy = -pos.y + 0.06;
        if (shadowy > 0.06) {
            shadowy = 0.06;
        }
        _role.roleDoll.shadow.localPosition.y = shadowy;
        _role.roleDoll.shadow.localPosition = _role.roleDoll.shadow.localPosition;
        //播放下落动画
        if (_role.jumpVelocity * this._prevJumpSpeed < 0) {
            //AudioPlayer.play(AudioEnum.WoodLandNormal);
            _role.roleDoll.playAnim("Jump2");
        }
        this._prevJumpSpeed = _role.jumpVelocity;
        if (pos.y < 0) { pos.y = 0; }
        let isOnGround = pos.y <= 0;
        //移动 TODO
        _role.walk(dt, _role.jumpMoveSpeedScale);
        this._droping = true;
        //落地结束 切换状态 到 -> standState
        if (isOnGround && this._droping) {
            this._droping = false;
            this._prevJumpSpeed = 0;
            // console.error("落地结束 切换状态 到 -> standState");
            if (_role.roleData.isMainPlayer()) {
                // console.error("落地 -> 玩家落地接触地面时的有音效");
                AudioPlayer.play(AudioEnum.WoodLandNormal);
            }
            // this._jumping = false;
            //死亡
            if (_role.roleData.inGameState == InGameStatus.inGameDead) {
                //玩家 跳起后落地
                UiDataManager.changeFunctionData(BindKeyName.roleJumpGround, { guid: _role.roleData.guid, pos: _role.roleDoll.model.localPosition });
                //玩家已死亡 跳起落地处理
                console.error("玩家已死亡 跳起落地处理");
                UiDataManager.changeFunctionData(BindKeyName.dieStateRoleJumpGround, _role.roleData.guid);
            } else {
                //播放落地动画
                _role.roleDoll.playAnim("Jump3", true)
                    .then(() => {
                        this._jumping = false;
                        // console.error("播放落地动画 完毕切回站立");
                        if (_role.roleData.isMainPlayer()) {
                            MainRoleDoll.canJump = false;
                        }
                        //玩家 跳起后落地
                        UiDataManager.changeFunctionData(BindKeyName.roleJumpGround, { guid: _role.roleData.guid, pos: _role.roleDoll.model.localPosition });
                        // console.error("当前玩家速度 ", _role.isRunSpeed, gameMathUtil.vec2SqrLength(_role.moveVelocity));
                        if (gameMathUtil.vec2SqrLength(_role.moveVelocity) >= 0.1) {
                            if (_role.isRunSpeed) {
                                _role.roleCtr.handleInput(RoleActInput.SpeedUp);
                            } else {
                                _role.roleCtr.handleInput(RoleActInput.Direction);
                            }
                        } else {
                            //播放站立待机动画
                            _role.roleCtr.handleInput(RoleActInput.Direction_Release);
                        }
                        // //死亡
                        // if (_role.roleData.inGameState == InGameStatus.inGameDead) {
                        //     _role.roleCtr.handleInput(RoleActInput.Die);
                        // } else {
                        // //播放站立待机动画
                        // _role.roleCtr.handleInput(RoleActInput.Direction_Release);
                        // }
                        // _role.roleCtr.state = StandState.Instance;
                        // _role.roleCtr.state.enter(_role);
                    });
            }
        }
    }
}