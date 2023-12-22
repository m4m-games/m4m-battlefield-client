export class MailDataEvent{
    /** 初始化全部数据*/
    public static Init = "Init";
    /** 批量加载数据*/
    public static ChangeList = "ChangeList";
    /** 邮件ID*/
    public static id = "id";
    /** 邮件类型*/
    public static mailType = "mailType";
    /** 邮件来源*/
    public static mailFrom = "mailFrom";
    /** 邮件接收者*/
    public static mailTo = "mailTo";
    /** 邮件标题*/
    public static mailTitle = "mailTitle";
    /** 邮件内容*/
    public static mailContent = "mailContent";
    /** 附带道具*/
    public static items = "items";
    /** 发送时间*/
    public static sendTime = "sendTime";
    /** 过期时间*/
    public static expires = "expires";
    /** 是否领取*/
    public static visible = "visible";
}