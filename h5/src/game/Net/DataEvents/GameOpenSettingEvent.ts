export class GameOpenSettingEvent{
    /** 初始化全部数据*/
    public static Init = "Init";
    /** 批量加载数据*/
    public static ChangeList = "ChangeList";
    /** 配置ID*/
    public static id = "id";
    /** 任务名称*/
    public static eventName = "eventName";
    /** 开始加入时间*/
    public static startTime = "startTime";
    /** 加入结束时间*/
    public static EndTime = "EndTime";
    /** 下次开始时间*/
    public static nextStartTime = "nextStartTime";
    /** 默认时间是0也就是utc时间*/
    public static serverTimeZone = "serverTimeZone";
    /** 可加入时长*/
    public static enterTime = "enterTime";
    /** 可加人时加入BOT的时间间隔*/
    public static addBotInEnter = "addBotInEnter";
    /** 停止加人后加入BOT的时间间隔*/
    public static addBotOverEnter = "addBotOverEnter";
    /** 停止加人后加入BOT的时间间隔最大间隔*/
    public static addBotOverEnterMax = "addBotOverEnterMax";
    /** 任务间隔执行时间*/
    public static taskLoopTime = "taskLoopTime";
    /** 每天结算开始的时间，和loopTime共同执行*/
    public static rankTime = "rankTime";
    /** 结算结束时间*/
    public static rankEndTime = "rankEndTime";
}