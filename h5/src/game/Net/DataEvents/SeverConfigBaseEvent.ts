export class SeverConfigBaseEvent{
    /** 初始化全部数据*/
    public static Init = "Init";
    /** 批量加载数据*/
    public static ChangeList = "ChangeList";
    /** 配置ID*/
    public static id = "id";
    /** 备注*/
    public static desc = "desc";
    /** ip*/
    public static ip = "ip";
    /** 网关地址*/
    public static gateway = "gateway";
    /** MAC地址*/
    public static MAC = "MAC";
    /** 启动时间*/
    public static setupTime = "setupTime";
    /** 状态*/
    public static status = "status";
    /** 当前人数*/
    public static playerSum = "playerSum";
    /** 是否为网关*/
    public static isGate = "isGate";
    /** 备注IP*/
    public static descIP = "descIP";
    /** 心跳断开限制*/
    public static heatbeatLimit = "heatbeatLimit";
    /** 日排名人数*/
    public static dailyRankMax = "dailyRankMax";
    /** 周排名人数*/
    public static weeklyRankMax = "weeklyRankMax";
    /** 月排名人数*/
    public static monthlyRankMax = "monthlyRankMax";
    /** 日排名一页显示*/
    public static dailyPage = "dailyPage";
    /** 周排名一页显示*/
    public static weeklyPage = "weeklyPage";
    /** 月排名一页显示*/
    public static monthlyPage = "monthlyPage";
    /** 是否使用钱包*/
    public static useWallet = "useWallet";
}