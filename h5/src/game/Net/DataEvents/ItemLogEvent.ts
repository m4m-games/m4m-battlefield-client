export class ItemLogEvent{
    /** 初始化全部数据*/
    public static Init = "Init";
    /** 批量加载数据*/
    public static ChangeList = "ChangeList";
    /** ID*/
    public static id = "id";
    /** 道具名字*/
    public static itemName = "itemName";
    /** 数据ID*/
    public static dataId = "dataId";
    /** 数量*/
    public static count = "count";
    /** 获取使用货币*/
    public static buyCurrency = "buyCurrency";
    /** 持有者*/
    public static playerUuid = "playerUuid";
    /** 消耗时间*/
    public static useTime = "useTime";
    /** 消耗方式*/
    public static useType = "useType";
}