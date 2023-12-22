import { gameMathUtil } from "Tools/gameMathUtil";
import { AudioEnum } from "../../Audio/AudioEnum";
import { AudioPlayer } from "../../Audio/AudioPlayer";
import { RoleActInput } from "../../GameEnum";
import { Role } from "../Role";
import { GameDiePerformanceEnum } from "../RoleAttrInfo";
import { AttackState } from "./AttackState";
import { JumpState } from "./JumpState";
import { IRoleActState } from "./RoleActState";
import { WalkState } from "./WalkState";

/**
 * 被击飞状态, 需设置落点和飞行时间
 */
export class StrikeToFlyState implements IRoleActState {
    public timeOut: number = 0;
    public state: number = RoleActInput.StrikeToFly;
    //
    private static stateArr: RoleActInput[] = [];

    //是否已经落地
    private isDroping: boolean = false;
    //飞行时间
    private flyTime: number;
    private currFlyTime: number;
    //起点
    private startPoint: m4m.math.vector3 = new m4m.math.vector3();
    //落地点
    private endPoint: m4m.math.vector3 = new m4m.math.vector3();
    //向上加速度(需要更具时间计算出来)
    private upVelocity: number = 5;
    constructor() {
        StrikeToFlyState.stateArr = [RoleActInput.Direction_Release];
    }

    public enter(_role: Role, data) {
        console.error("切换到击飞状态");
        this.isDroping = false;
        _role.roleDoll.playAnim("Jump2");

        m4m.math.vec3Clone(_role.roleDoll.model.localPosition, this.startPoint);
        m4m.math.vec3Clone(data.dropPoint, this.endPoint);
        this.flyTime = data.flyTime;
        this.currFlyTime = 0;
        this.upVelocity = this.calcUpVelocity(this.flyTime);

        _role.jumpVelocity = this.upVelocity;
    }

    public canChange(_input: RoleActInput): boolean {
        return StrikeToFlyState.stateArr.indexOf(_input) != -1;
    }

    public update(_role: Role, dt: number) {
        if (!this.isDroping) { //还没落地
            let currYVel = _role.jumpVelocity;
            currYVel -= dt * gameMathUtil.G;
            _role.jumpVelocity = currYVel;
            let pos = _role.roleDoll.model.localPosition;
            pos.y += currYVel * dt;

            this.currFlyTime = Math.min(this.flyTime, this.currFlyTime + dt * 1000);
            let v = this.currFlyTime / this.flyTime;
            pos.x = this.startPoint.x + (this.endPoint.x - this.startPoint.x) * v;
            pos.z = this.startPoint.z + (this.endPoint.z - this.startPoint.z) * v;

            //落地判断
            if (pos.y <= 0 && _role.jumpVelocity <= 0) {
                pos.y = 0;
                this.isDroping = true;
                //播放落地动画
                _role.roleDoll.playAnim("Jump3", true)
                    .then(() => {
                        _role.roleCtr.handleInput(RoleActInput.Direction_Release);
                    });
            }
            //阴影
            let shadowy = -pos.y + 0.06;
            if (shadowy > 0.06) {
                shadowy = 0.06;
            }
            _role.roleDoll.shadow.localPosition.y = shadowy;
            _role.roleDoll.shadow.localPosition = _role.roleDoll.shadow.localPosition;
            _role.roleDoll.model.localPosition = pos;
        }
    }

    //更具飞行时间计算出上升的速度
    private calcUpVelocity(t: number) {
        return t / 1000 * gameMathUtil.G * 0.5;
    }
}