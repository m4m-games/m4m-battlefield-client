import { Role } from "../Role";

/** AI 类型
 */
export enum AIType {
    /** 闲逛 */
    Ramble,
    /** 木头人 玩家AI */
    WoodenPeople,
}

/** 角色AI */
export interface IRoleAI {
    /**
     * 更新
     * @param role 角色
     * @param dt 
     */
    update(role: Role, dt: number);
    /**
     * 开始
     * @param role 角色
     */
    enter(role: Role);

    /**
     * 结束
     * @param role 
     */
    exit(role: Role);
}