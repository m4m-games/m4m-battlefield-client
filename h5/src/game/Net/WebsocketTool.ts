import { NetWebscoket } from "./NetWebsocket";
import { WsDataManager } from "./WsDataManager";

export class WebsocketTool {
    public static get Instance(): WebsocketTool {
        if (this._instance == null) {
            this._instance = new WebsocketTool();
        }

        return this._instance;
    }
    private static _instance: WebsocketTool;
    public async onmessage(e: MessageEvent) {
        let buffer: any;
        if (e.data.arrayBuffer) {
            buffer = await e.data.arrayBuffer();
        } else {
            buffer = e.data;
        }
        if (typeof (buffer) == "string") {
            if (!buffer.startsWith("[LOG]")) {
                let messObj = JSON.parse(buffer);
                if (messObj.argsType == "code") {
                    return false;
                }
                if (messObj.functionName == "All") {
                    WsDataManager.setData(messObj.className, messObj.args[0]);
                } else if (messObj.functionName == "ChangeList") {
                    WsDataManager.changeDataList(messObj.className, messObj.args[0]);
                } else {
                    for (const key in messObj.args) {
                        let element = messObj.args[key];
                        WsDataManager.changeData(messObj.className, messObj.functionName, messObj.argsType, element);
                    }
                }
                return true;
            }
        }
        return false;
    }
    public getMsg(className, functionName, text) {
        let mess = `{"currentType":null,"type":null,"callTime":"0001-01-01T00:00:00","callid":0,"timeout":0,"className":"${className}","functionName":"${functionName}","argsType":null,
        "args":[${text}],"returnType":null,"returnValue":null}`;
        return mess;
    }

    /***
     * 同步游戏信息 dataInfo:同步信息
     */
    public GameManager_updataGame(dataInfo) {
        let paramJsons = `${JSON.stringify(dataInfo)}`;
        let mess = this.getMsg("GameManager", "updataGame", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 退出游戏
     */
    public GameManager_outGame() {
        let paramJsons = ``;
        let mess = this.getMsg("GameManager", "outGame", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取游戏开放信息
     */
    public GameOpenManager_getGameOpenInfo() {
        let paramJsons = ``;
        let mess = this.getMsg("GameOpenManager", "getGameOpenInfo", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 玩家注册新账号,userInfoJson:玩家信息,passWord:密码,name:玩家名字,face:脸ID,hair:头发id
     */
    public LoginManager_creatAndLoginWallet(userInfoJson, passWord, name, face, hair) {
        let paramJsons = `${JSON.stringify(userInfoJson)},${JSON.stringify(passWord)},${JSON.stringify(name)},${JSON.stringify(face)},${JSON.stringify(hair)}`;
        let mess = this.getMsg("LoginManager", "creatAndLoginWallet", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 玩家注册新账号不经过钱包,userID:玩家id,passWord:密码,name:玩家名字,face:脸ID,hair:头发id
     */
    public LoginManager_creatAndLogin(userID, passWord, name, face, hair) {
        let paramJsons = `${JSON.stringify(userID)},${JSON.stringify(passWord)},${JSON.stringify(name)},${JSON.stringify(face)},${JSON.stringify(hair)}`;
        let mess = this.getMsg("LoginManager", "creatAndLogin", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 玩家登录不使用钱包,userId:玩家ID,passWord:密码
     */
    public LoginManager_loginWithOutWallet(userId, passWord, playerName) {
        let paramJsons = `${JSON.stringify(userId)},${JSON.stringify(passWord)},${JSON.stringify(playerName)}`;
        let mess = this.getMsg("LoginManager", "loginWithOutWallet", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 玩家登录使用钱包,userInfoJson:玩家信息,passWord:密码
     */
    public LoginManager_login(userInfoJson, passWord, playerName) {
        let paramJsons = `${JSON.stringify(userInfoJson)},${JSON.stringify(passWord)},${JSON.stringify(playerName)}`;
        let mess = this.getMsg("LoginManager", "login", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取邮件
     */
    public MailManager_getMails() {
        let paramJsons = ``;
        let mess = this.getMsg("MailManager", "getMails", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取邮件道具,itemDataID:道具ID
     */
    public MailManager_getMailItem(itemDataID) {
        let paramJsons = `${JSON.stringify(itemDataID)}`;
        let mess = this.getMsg("MailManager", "getMailItem", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过邮件ID获取邮件道具,mailID:邮件ID
     */
    public MailManager_getMailItemByMailID(mailID) {
        let paramJsons = `${JSON.stringify(mailID)}`;
        let mess = this.getMsg("MailManager", "getMailItemByMailID", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过邮件ID删除邮件,mailID:邮件ID
     */
    public MailManager_updateMailItemByMailID(mailID) {
        let paramJsons = `${JSON.stringify(mailID)}`;
        let mess = this.getMsg("MailManager", "updateMailItemByMailID", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取木头人排行列表 rankType:列表类型 1：日榜 2：周榜 3：月榜  page:页数
     */
    public RankManager_getRankList(rankType, page) {
        let paramJsons = `${JSON.stringify(rankType)},${JSON.stringify(page)}`;
        let mess = this.getMsg("RankManager", "getRankList", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取糖饼排行列表 rankType:列表类型 1：日榜 2：周榜 3：月榜  page:页数
     */
    public RankManager_getCookieRankList(rankType, page) {
        let paramJsons = `${JSON.stringify(rankType)},${JSON.stringify(page)}`;
        let mess = this.getMsg("RankManager", "getCookieRankList", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取木头人实时排行列表 rankType:列表类型 1：日榜 2：周榜 3：月榜  page:页数
     */
    public RankManager_getNowRankList(rankType, page) {
        let paramJsons = `${JSON.stringify(rankType)},${JSON.stringify(page)}`;
        let mess = this.getMsg("RankManager", "getNowRankList", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取糖饼实时排行列表 rankType:列表类型 1：日榜 2：周榜 3：月榜  page:页数
     */
    public RankManager_getCookieNowRankList(rankType, page) {
        let paramJsons = `${JSON.stringify(rankType)},${JSON.stringify(page)}`;
        let mess = this.getMsg("RankManager", "getCookieNowRankList", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取自身排行 rankType:列表类型 1：日榜 2：周榜 3：月榜 
     */
    public RankManager_getSelfRank(rankType) {
        let paramJsons = `${JSON.stringify(rankType)}`;
        let mess = this.getMsg("RankManager", "getSelfRank", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取糖饼自身排行 rankType:列表类型 1：日榜 2：周榜 3：月榜 
     */
    public RankManager_getCookieSelfRank(rankType) {
        let paramJsons = `${JSON.stringify(rankType)}`;
        let mess = this.getMsg("RankManager", "getCookieSelfRank", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取木头人实时自身排行 rankType:列表类型 1：日榜 2：周榜 3：月榜 
     */
    public RankManager_getNowSelfRank(rankType) {
        let paramJsons = `${JSON.stringify(rankType)}`;
        let mess = this.getMsg("RankManager", "getNowSelfRank", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取糖饼实时自身排行 rankType:列表类型 1：日榜 2：周榜 3：月榜 
     */
    public RankManager_getCookieNowSelfRank(rankType) {
        let paramJsons = `${JSON.stringify(rankType)}`;
        let mess = this.getMsg("RankManager", "getCookieNowSelfRank", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 准备完成
     */
    public RoomManager_readyForGame() {
        let paramJsons = ``;
        let mess = this.getMsg("RoomManager", "readyForGame", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 修改服务器时间,count：时间便宜量，单位秒
     */
    public ServerManager_timePlus(count) {
        let paramJsons = `${JSON.stringify(count)}`;
        let mess = this.getMsg("ServerManager", "timePlus", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 心跳检测
     */
    public ServerManager_heartBeat() {
        let paramJsons = ``;
        let mess = this.getMsg("ServerManager", "heartBeat", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 延迟检测
     */
    public ServerManager_ping() {
        let paramJsons = ``;
        let mess = this.getMsg("ServerManager", "ping", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取服务器时间
     */
    public ServerManager_servertime() {
        let paramJsons = ``;
        let mess = this.getMsg("ServerManager", "servertime", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取设置数据
     */
    public SettingManager_ObtainTing() {
        let paramJsons = ``;
        let mess = this.getMsg("SettingManager", "ObtainTing", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 修改设置数据
     */
    public SettingManager_ModifyTing(SettingData) {
        let paramJsons = `${JSON.stringify(SettingData)}`;
        let mess = this.getMsg("SettingManager", "ModifyTing", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取商品列表，shopId:商店ID)
     */
    public ShopManager_getShopInfo(shopId) {
        let paramJsons = `${JSON.stringify(shopId)}`;
        let mess = this.getMsg("ShopManager", "getShopInfo", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 购买商品，goodsId:商店ID,shopType:货币类型)
     */
    public ShopManager_buyShopGoods(goodsId, shopType) {
        let paramJsons = `${JSON.stringify(goodsId)},${JSON.stringify(shopType)}`;
        let mess = this.getMsg("ShopManager", "buyShopGoods", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 购买门票验证，使用数字货币验证的话就和数字货币服务器通讯获取门票,gameType 游戏类型)
     */
    public TicketManager_getTicket(gameType) {
        let paramJsons = `${JSON.stringify(gameType)}`;
        let mess = this.getMsg("TicketManager", "getTicket", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 购买门票不经过钱包，count购买数量,gameType:游戏类型)
     */
    public TicketManager_getTicketWithOutWallet(count, gameType) {
        let paramJsons = `${JSON.stringify(count)},${JSON.stringify(gameType)}`;
        let mess = this.getMsg("TicketManager", "getTicketWithOutWallet", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取所有门票信息)
     */
    public TicketManager_getAllTicketInfo() {
        let paramJsons = ``;
        let mess = this.getMsg("TicketManager", "getAllTicketInfo", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取门票信息，gameId:游戏ID)
     */
    public TicketManager_getTicketId(gameId) {
        let paramJsons = `${JSON.stringify(gameId)}`;
        let mess = this.getMsg("TicketManager", "getTicketId", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 支付门票开始进入游戏房，gameId:游戏ID)
     */
    public TicketManager_useTickToGameRoom(gameId) {
        let paramJsons = `${JSON.stringify(gameId)}`;
        let mess = this.getMsg("TicketManager", "useTickToGameRoom", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过玩家userId获得玩家数据,userId:玩家UID
     */
    public UserManager_getUser(userId) {
        let paramJsons = `${JSON.stringify(userId)}`;
        let mess = this.getMsg("UserManager", "getUser", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过玩家userID修改昵称，userID:玩家ID,playerName:玩家昵称,itemDataId:道具ID
     */
    public UserManager_updataUser(userID, playerName, itemDataId) {
        let paramJsons = `${JSON.stringify(userID)},${JSON.stringify(playerName)},${JSON.stringify(itemDataId)}`;
        let mess = this.getMsg("UserManager", "updataUser", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过玩家userID修改游戏经历是否打开，userID:玩家ID
     */
    public UserManager_updataUserexpice(userID) {
        let paramJsons = `${JSON.stringify(userID)}`;
        let mess = this.getMsg("UserManager", "updataUserexpice", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过玩家userID修改玩家头像,userID:玩家ID,playericon:玩家头像
     */
    public UserManager_updataplayericon(userID, playericon) {
        let paramJsons = `${JSON.stringify(userID)},${JSON.stringify(playericon)}`;
        let mess = this.getMsg("UserManager", "updataplayericon", `${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

}