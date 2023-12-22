
import { RoleActInput } from "../../GameEnum";
import { Role } from "../Role";
import { GameDiePerformanceEnum } from "../RoleAttrInfo";
import { JumpState } from "./JumpState";
import { IRoleActState } from "./RoleActState";
import { WalkState } from "./WalkState";

/**
 * 等死 状态   播放死亡动画前状态 可设置时间 延迟 再切到死亡状态
 */
export class WaitForDeathState implements IRoleActState {
    public timeOut: number = 0;
    public state: number = RoleActInput.WaitForDeath;
    //等死 状态  可切换  死亡状态
    private static stateArr: RoleActInput[] = [];
    private start: boolean = false;
    private timeNum: number = 0;
    constructor() {
        WaitForDeathState.stateArr = [RoleActInput.Die, RoleActInput.DropOut];
    }
    public enter(_role: Role) {
        // console.error("切回站立");
        this.start = true;
        this.timeNum = 0;
    }

    public canChange(_input: RoleActInput): boolean {
        return WaitForDeathState.stateArr.indexOf(_input) != -1;
    }

    public update(_role: Role, dt: number) {
        if (this.start) {
            let roleData = _role.roleData;
            if (roleData.defDiePerformance == GameDiePerformanceEnum.DropOutDie) {
                //
                //如果当前不是掉落状态机
                if (_role.roleCtr.state.state != RoleActInput.DropOut) {
                    this.timeNum += dt * 1000;
                    if (this.timeNum >= this.timeOut) {
                        this.start = false;
                        // console.error("有玩家是掉落死亡！");
                        _role.roleCtr.handleInput(RoleActInput.DropOut);
                    }
                }
            } else {
                //如果当前不是死亡状态机
                if (_role.roleCtr.state.state != RoleActInput.Die) {
                    this.timeNum += dt * 1000;
                    if (this.timeNum >= this.timeOut) {
                        this.start = false;
                        _role.roleCtr.handleInput(RoleActInput.Die);
                    }
                }
            }
        }
    }
}