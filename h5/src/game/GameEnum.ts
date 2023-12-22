/**
 * 游戏玩法类型
 */
 export enum GamePlayType {
    /** 游戏准备大厅 */
    hall,
    /** 木头人 */
    woodenPeople,
    /** 扣糖饼 */
    sugarCake,
    /** 拔河 */
    tugOfWar,
    /**单人大厅*/
    singleHall,
    /**玻璃桥*/
    glassBridge,
    /** 弹珠 */
    hoodle,
    /**鱿鱼游戏*/
    squidGame,
    /**黑夜混战 */
    melee,
}
/**
 * 游戏关卡
*/
export enum GameType {
    /** 木头人 */
    woodenPeople = 1,
    /** 扣糖饼 */
    sugarCake = 2,
    /** 拔河 */
    tugOfWar = 3,
    /**玻璃桥*/
    glassBridge = 4,
    /** 弹珠 */
    marbles = 5,
    /**鱿鱼游戏*/
    squidGame = 6,
    /**大锦标赛 */
    greatChampionship = 8,
}
/**
 * 角色 行为输入
 */
export enum RoleActInput {
    /** 方向 摇杆 (走) */
    Direction,
    /** 方向 摇杆释放 (走 停) */
    Direction_Release,
    /** 跳跃 */
    Jump,
    /** 攻击 */
    Attack,
    /** 移动速度增加 (跑)*/
    SpeedUp,
    /** 移动速度增加 释放 (跑 停) */
    SpeedUp_Release,
    /** 等死状态 */
    WaitForDeath,
    /** 死亡 */
    Die,
    /** 掉落 */
    DropOut,
    /** 传送状态 */
    TransferState,
    /** 复活 */
    Revive,
    /** 玩家同步 走 */
    Walk,
    /** 抠糖饼状态 */
    Picking,
    /**左侧玩家发力拔绳子*/
    PulltheRope,
    /**左侧玩家拔河预备状态*/
    PreparePull,
    /**右侧玩家拔河预备状态*/
    RightPreparePull,
    /**右侧玩家发力拔绳子*/
    RightPulltheRope,
    /** 被击飞 */
    StrikeToFly,
}

/** 
 * 玩家账号状态
 */
export enum PlayerStatus {
    offLine = 0,
    onLine = 1,
    inRoom = 2,
    onLoad = 3,
    inReady = 4,
    inGame = 5,
}

/** 
 * 玩家游戏中状态
 */
export enum InGameStatus {
    outGame = 0,//退出当前游戏房间
    inGame = 1,//游戏中
    inGameWin = 2,//游戏胜利
    inGameDead = 3,//游戏失败或死亡
}

/** 
 * 移动类型
 */
export enum PlayerMoveType {
    homing = -1,//归位
    walk = 1,//走
    jump = 2,//跳
    run = 3,//跑
    strikeToFly = 4,//击飞
}

/** 
 * 玩家状态 (客户端状态)
 */
export enum PlayerClientState {
    //禁止移动
    prohibitionMove,
    //可移动
    canMove,
}
/**
 * 游戏的状态
*/
export enum GameState {
    ready = 1, //准备
    match = 2, //竞赛阶段
    over = 3, //时间到,结束
}
/**
 * 排行榜类型
*/
export enum RankType {
    daily = 1,
    weekly = 2,
    month = 3,
}
/**
 * @language zh_CN
 * @classdesc
 * 文本内容类型
 * @version gd3d 1.0
 */
export enum contentType {
    None = 0,
    Number = 1,//数字
    Word = 2,//字母
    Underline = 4,//下划线
    ChineseCharacter = 8,//中文字符
    NoneChineseCharacter = 16,//没有中文字符
    Email = 32,//邮件
    PassWord = 64,//密码
    Custom = 128,//自定义
}

/**
 * 点相对于形状的位置
 */
export enum PointWithShape {
    in = -1, //在形状里面
    on = 0, //在形状上
    out = 1, //在形状外
}

//图形类型
export enum ShapeType {
    //正方形
    square = "square",
    //三角形
    triangle = "triangle",
    //圆形
    round = "round",
    //星形
    star = "star",
    //伞形
    umbrella = "umbrella",
}

//门票类型
//门票类型
export enum TicketType {
    wooden = 1001,
    sugarCake = 1002,
    tugOfWar = 1003,
    miniChampionship= 1004,
    marbles = 1005,
    glassBridge = 1006,
    squidGame= 1007,
    greatChampionship = 1008,
}

//商店类型
export enum ShopType {
    //门票商店
    Tickets = 1001,
}

export enum CommodityType{
    Tickets = 1,
    Clothing = 2,
}

//武器列表
export enum Weapons {
    none, //徒手
    dao, //小刀
    bat, //棒球棍
}

export enum HitType {
    Bloom = "fx_Bloom",
    Hit = "fx_hit",
    HitBloom = "fx_hitBloom",
}