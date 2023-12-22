export class BattleListBaseEvent{
    /** 初始化全部数据*/
    public static Init = "Init";
    /** 批量加载数据*/
    public static ChangeList = "ChangeList";
    /** 配置ID*/
    public static id = "id";
    /** 关卡*/
    public static checkpoint = "checkpoint";
    /** 关卡ID*/
    public static checkpointID = "checkpointID";
    /** 场数*/
    public static total = "total";
    /** 胜场*/
    public static wins = "wins";
    /** 玩家ID*/
    public static userID = "userID";
    /** 最佳战绩*/
    public static bestAchievement = "bestAchievement";
}