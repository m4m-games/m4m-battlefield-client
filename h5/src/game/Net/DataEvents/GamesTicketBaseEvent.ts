export class GamesTicketBaseEvent{
    /** 初始化全部数据*/
    public static Init = "Init";
    /** 批量加载数据*/
    public static ChangeList = "ChangeList";
    /** 配置ID*/
    public static id = "id";
    /** 备注*/
    public static desc = "desc";
    /** 对应关卡显示大图*/
    public static rawpicture = "rawpicture";
    /** 门票ID*/
    public static ticketID = "ticketID";
    /** 门票UI*/
    public static ticketUI = "ticketUI";
    /** 使用门票*/
    public static ticketUse = "ticketUse";
    /** 游戏类名*/
    public static gameClass = "gameClass";
    /** 场景id*/
    public static sceneBase = "sceneBase";
    /** 是否显示*/
    public static visible = "visible";
}