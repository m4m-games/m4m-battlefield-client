import { RoleActInput } from "../../GameEnum";
import { Role } from "../Role";

/**
 * 角色行为状态
 */
export interface IRoleActState {

    // /**
    //  * 输入
    //  * @param _role role对象
    //  * @param _input 输入类型
    //  */
    // handleInput(_role: Role, _input: RoleActInput): IRoleActState;

    //当前行为状态
    state: number;
    //退出当前状态时间
    timeOut: number;

    /**
     * 是否可以转状态
     */
    canChange(_input: RoleActInput, role: Role): boolean;

    /**
     * 进入状态
     * @param _role role对象
     */
    enter(_role: Role, data?: any);

    /**
     * 更新
     * @param _role role对象
     * @param dt 
     */
    update(_role: Role, dt: number);
}