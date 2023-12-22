import { Role } from "../Role";
import { IRoleAI } from "./AiInterface";

/**
 * 玩家 木头人AI
 */
export class WoodenPeopleAI implements IRoleAI {
    public static get Instance() {
        if (!this._instance) {
            this._instance = new WoodenPeopleAI();
        }
        return this._instance;
    }
    private static _instance: WoodenPeopleAI;
    public exit(role: Role) {
        throw new Error("Method not implemented.");
    }

    public enter(role: Role) {

    }
    public update(role: Role, dt: number) {

    }

}