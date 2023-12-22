export class ResultBaseEvent{
    /** 初始化全部数据*/
    public static Init = "Init";
    /** 批量加载数据*/
    public static ChangeList = "ChangeList";
    /** 配置ID*/
    public static id = "id";
    /** 游戏ID*/
    public static gameId = "gameId";
    /** 胜利用户列表*/
    public static winers = "winers";
    /** 失败用户列表*/
    public static losers = "losers";
    /** 结算时间*/
    public static resultTime = "resultTime";
}