export class LoginLogBaseEvent{
    /** 初始化全部数据*/
    public static Init = "Init";
    /** 批量加载数据*/
    public static ChangeList = "ChangeList";
    /** 配置ID*/
    public static id = "id";
    /** token*/
    public static token = "token";
    /** 登陆时间*/
    public static loginTime = "loginTime";
    /** 状态*/
    public static status = "status";
}