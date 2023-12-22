import { UiDataManager } from "PSDUI/UiDataManager";
import { gameMathUtil } from "Tools/gameMathUtil";
import { BindKeyName } from "../../Data/BindKeyName";
import { RoleActInput } from "../../GameEnum";
import { Role } from "../Role";
import { JumpState } from "./JumpState";
import { IRoleActState } from "./RoleActState";

/**
 * 掉落 状态
 */
export class DropOutState implements IRoleActState {
    public timeOut: number = 0;
    public state: number = RoleActInput.DropOut;
    //掉落  状态  可切换    死亡
    private static stateArr: RoleActInput[] = [];
    // //退出当前状态
    // private outing: boolean = false;
    // private timeOut: number = 0;
    //上一帧y轴速度
    private _prevYSpeed: number = 0;
    constructor() {
        DropOutState.stateArr = [RoleActInput.Die];
    }

    public enter(_role: Role) {
        _role.jumpVelocity = 0;
        //检查播放动画 
        // _role.roleDoll.playAnim("tugofwarfall_2");
        _role.roleDoll.playAnim("TugOfWarFall2");
        // this.timeOut = _role.roleConfigBase.standOutDelay;
    }

    public canChange(_input: RoleActInput): boolean {
        return DropOutState.stateArr.indexOf(_input) != -1;
    }
    public update(_role: Role, dt: number) {
        if (!_role || !_role.roleDoll) { return; }
        //空中移动减速
        //检查播放 跳跃动画
        //跳到一定高度 
        let currYVel = _role.jumpVelocity;
        currYVel -= dt * gameMathUtil.G;
        _role.jumpVelocity = currYVel;
        let pos = _role.roleDoll.model.localPosition;
        pos.y += currYVel * dt;
        _role.roleDoll.model.localPosition = pos;
        // console.log(pos.y,(currYVel * dt));
        // let shadowy = -pos.y + 0.02;
        // if (shadowy > 0.02) {
        //     shadowy = 0.02;
        // }
        // _role.roleDoll.shadow.localPosition.y = shadowy;
        // _role.roleDoll.shadow.localPosition = _role.roleDoll.shadow.localPosition;
        // //播放下落动画
        // if (_role.jumpVelocity * this._prevYSpeed < 0) {
        //     //AudioPlayer.play(AudioEnum.WoodLandNormal);
        //     _role.roleDoll.playAnim("jump2");
        // }
        this._prevYSpeed = _role.jumpVelocity;
        // if (pos.y < 0) { pos.y = 0; }
        // let isOnGround = pos.y <= 0;
        //玩家掉落
        UiDataManager.changeFunctionData(BindKeyName.roleDropOut, { guid: _role.roleData.guid, y: pos.y });
    }
}