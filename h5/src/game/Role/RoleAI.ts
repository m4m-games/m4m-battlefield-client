import { IDispose } from "Tools/engineParallel/spInterface";
import { AIType, IRoleAI } from "./AI/AiInterface";
import { RambleAI } from "./AI/RambleAI";
import { WoodenPeopleAI } from "./AI/WoodenPeopleAI";
import { Role } from "./Role";

/**
 * 角色AI
 */
export class RoleAI implements IDispose {
    private static getAIByType(_type: AIType) {
        switch (_type) {
            case AIType.Ramble: return RambleAI.Instance;
            case AIType.WoodenPeople: return WoodenPeopleAI.Instance;
            default:
        }
    }

    /** AI 类型 */
    public get aiType() { return this._type; }

    constructor(role: Role, _type: AIType) {
        this._role = role;
        this._type = _type;
        this._AI = RoleAI.getAIByType(_type);
        this._AI.enter(role);
    }

    private _role: Role;
    private _type: AIType;
    private _AI: IRoleAI;
    public dispose() {
        if (this._AI) { this._AI.exit(this._role); }
        this._AI = null;
    }

    public update(dt: number) {
        this._AI.update(this._role, dt);
    }
}