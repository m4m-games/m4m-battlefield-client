import { Role } from "../Role";
import { IRoleAI } from "./AiInterface";

/**
 * 玩家闲逛
 */
export class RambleAI implements IRoleAI {
    public static get Instance() {
        if (!this._instance) {
            this._instance = new RambleAI();
        }
        return this._instance;
    }
    private static _instance: RambleAI;
    private static _keyTimeCount: "TimeCount";
    private static _keyChangeTime: "ChangeTime";

    public enter(role: Role) {
        let d = role.AICalcData = {};
        d[RambleAI._keyTimeCount] = 0;
        d[RambleAI._keyChangeTime] = 5;
    }

    public exit(role: Role) {
        let d = role.AICalcData;
        delete d[RambleAI._keyTimeCount];
        delete d[RambleAI._keyChangeTime];
    }

    public update(role: Role, dt: number) {
        if (!role || !role.roleDoll) { return; }
        //随意走来走去
        let d = role.AICalcData;
        d[RambleAI._keyTimeCount] -= dt;
        let minTime = 2;
        if (d[RambleAI._keyTimeCount] <= 0) {
            d[RambleAI._keyTimeCount] = Math.random() * d[RambleAI._keyChangeTime];
            if (d[RambleAI._keyTimeCount] < minTime) { d[RambleAI._keyTimeCount] = minTime; }
            let v2 = role.moveVelocity;
            m4m.math.vec2Set(v2, Math.random() * 2 - 1, Math.random() * 2 - 1);
            m4m.math.vec2Normalize(v2, v2);
        }

        //
        role.walk(dt);
    }

}