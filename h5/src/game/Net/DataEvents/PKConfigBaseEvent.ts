export class PKConfigBaseEvent{
    /** 初始化全部数据*/
    public static Init = "Init";
    /** 批量加载数据*/
    public static ChangeList = "ChangeList";
    /** 配置ID*/
    public static id = "id";
    /** 备注*/
    public static desc = "desc";
    /** 用户列表*/
    public static players = "players";
    /** 用户位置*/
    public static playerPos = "playerPos";
    /** 道具*/
    public static items = "items";
    /** 道具位置*/
    public static itemPos = "itemPos";
    /** 当前时间*/
    public static nowTime = "nowTime";
    /** 结束时间*/
    public static endTime = "endTime";
    /** 游戏场景ID*/
    public static gameScene = "gameScene";
}