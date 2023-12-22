export class NoticeEvent{
    /** 初始化全部数据*/
    public static Init = "Init";
    /** 批量加载数据*/
    public static ChangeList = "ChangeList";
    /** 配置ID*/
    public static id = "id";
    /** 公告的标题*/
    public static noticeTitle = "noticeTitle";
    /** 任务实际开始时间*/
    public static notice = "notice";
    /** 每次只显示一次，根据上一次登录时间来客户端自行判断是否要去被动获取公告。*/
    public static DisplayOnceAday = "DisplayOnceAday";
    /** 公告开始时间*/
    public static StartTime = "StartTime";
    /** 公告结束时间*/
    public static EndTime = "EndTime";
    /** 任务之前的执行状态，1正在执行，2执行错误，3执行成功，注意写任务的一定要注意可能服务器被中断的情况*/
    public static taskPreviousState = "taskPreviousState";
}