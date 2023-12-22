import { EventGeneric, EventMgr } from "eventMgr";
import { UiManager } from "PSDUI/UiManager";
import { StageMgr } from "../Core/StageMgr";
import { GamePlayType } from "../GameEnum";
import { UiNames } from "../Manager/UIData/UiNames";
import { AIType } from "../Role/AI/AiInterface";
import { IGamePlay } from "./IGamePlay";
/**
 * 游戏大厅
 */
export class Hall implements IGamePlay {
    private _evMakeRole: EventGeneric<{ roleId: number, GUID: string }> = new EventGeneric({ roleId: -1, GUID: "'" });
    private _evRoleSetAI: EventGeneric<{ GUID: string, aiType: number }> = new EventGeneric({ GUID: "", aiType: -1 });
    private _evRoleSetPos: EventGeneric<{ GUID: string, pos: m4m.math.vector3 }> = new EventGeneric({ GUID: "", pos: new m4m.math.vector3() });
    public startArea(): m4m.math.vector3[] {
        return null;
    }
    public endArea(): m4m.math.vector3[] {
        return null;
    }
    public getGameType(): GamePlayType {
        return GamePlayType.hall;
    }
    public runGame() {
        console.log(`进入了 大厅！`);
        //玩家角色 摇杆

        //开启摇杆
        UiManager.showUi(UiNames.rocker);

        //事件
        //网络玩家 同步监听
        //xxx
        //测试添加一个玩家
        // this.testOne();
    }

    public exitGame() {

    }

    // private async testOne() {
        // //测试添加一个玩家
        // let testGUID = `G:0001`;
        // this._evMakeRole.data.roleId = 10004;
        // this._evMakeRole.data.GUID = testGUID;
        // EventMgr.dispatchEvent("role_make", this._evMakeRole);
        // await StageMgr.waitRoleMakeSuc(testGUID);
        // //移动到一个位置
        // this._evRoleSetPos.data.GUID = testGUID;
        // m4m.math.vec3Set(this._evRoleSetPos.data.pos, 3, 0, 0);
        // EventMgr.dispatchEvent("role_setPos", this._evRoleSetPos);

        // //添加一个AI
        // this._evRoleSetAI.data.GUID = testGUID;
        // this._evRoleSetAI.data.aiType = AIType.Ramble;
        // EventMgr.dispatchEvent("role_setAI", this._evRoleSetAI);
    // }
    /** 添加其他 网络玩家  */
    private addGuest() {

    }

}