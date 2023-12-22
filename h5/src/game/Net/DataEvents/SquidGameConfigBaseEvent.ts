export class SquidGameConfigBaseEvent{
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
    /** 每一步距离*/
    public static stepDis = "stepDis";
    /** 下落高度*/
    public static dropHeigth = "dropHeigth";
    /** 初始位置*/
    public static startArea = "startArea";
    /** 活动区域*/
    public static moveArea = "moveArea";
    /** 正方形安全区*/
    public static safeRect = "safeRect";
    /** 三角安全区*/
    public static safeTriangle = "safeTriangle";
    /** 圆形安全区*/
    public static safeCircular = "safeCircular";
    /** 目标安全区*/
    public static tagetCircular = "tagetCircular";
    /** 小圆安全区1*/
    public static smallCircular1 = "smallCircular1";
    /** 小圆安全区2*/
    public static smallCircular2 = "smallCircular2";
    /** 简单难度持续时间*/
    public static easyMode = "easyMode";
    /** 困难难度开始时间*/
    public static hardMode = "hardMode";
    /** 最小力度*/
    public static powerMin = "powerMin";
    /** 最大力度*/
    public static powerMax = "powerMax";
    /** 最小判定角度*/
    public static agreeMin = "agreeMin";
    /** 最大判定角度*/
    public static agreeMax = "agreeMax";
    /** 提前发送时间*/
    public static advance = "advance";
    /** 游戏总时间*/
    public static totleTime = "totleTime";
    /** 倒计时时长*/
    public static countTime = "countTime";
    /** 游戏开始时间*/
    public static gameTime = "gameTime";
    /** 游戏状态*/
    public static gameStatus = "gameStatus";
    /** 倒计时开始时间*/
    public static countDown = "countDown";
    /** 当前时间*/
    public static nowTime = "nowTime";
    /** 结束时间*/
    public static endTime = "endTime";
    /** 游戏场景ID*/
    public static gameScene = "gameScene";
}