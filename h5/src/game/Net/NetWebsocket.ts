import { StageMgr } from "../Core/StageMgr";
import { UIOpenOrHideManager } from "../Manager/UIOpenOrHideManager";
import { TipPanelType, UITipManager } from "../Manager/UITipManager";
import { PingTimeManager } from "./PingTimeManager";
import { WebsocketTool } from "./WebsocketTool";
export class NetWebscoket {

    public static get Instance(): NetWebscoket {
        if (this._instance == null) {
            this._instance = new NetWebscoket();
        }

        return this._instance;
    }
    /**********是否需要请求 配置数据***********
    */
    public static reqconfigMes: boolean = true;

    private static _instance: NetWebscoket;
    private _webscoket: WebSocket;
    public connect(url: string) {
        // console.log("开始链接服务器*** " + url);
        // this._webscoket = new WebSocket(url);//"wss://hse-dev-qq.upaidui.com"
        if (url == null) {
            console.error("服务器 地址出错！" + url);
            return;
        }
        // url = "wss://kingzet.cn";
        console.log("开始链接服务器 " + url);
        this._webscoket = new WebSocket(url) as any;
        this._webscoket["onmessage"] = this.onmessage.bind(this);
        this._webscoket["onopen"] = this.onopen.bind(this);
        this._webscoket["onclose"] = this.onclose.bind(this);
        this._webscoket["onerror"] = this.onerror.bind(this);

    }

    public async onmessage(e: MessageEvent) {

        // console.log("来消息了：" + e.data);
        let notCode = await WebsocketTool.Instance.onmessage(e);
        // console.log(`byteLength : ${(e.data as ArrayBuffer).byteLength}` , e.data);
        // e.data.arrayBuffer()
        //     .then((buffer) => {
        //         console.error("处理 ArrayBuffer 数据的代码……");
        //     });
        if (notCode) {
            return;
        }
        let buffer: any;
        if (e.data.arrayBuffer) {
            buffer = await e.data.arrayBuffer();
        } else {
            buffer = e.data;
        }

        if (typeof (buffer) == "string") {
            if (buffer.indexOf("[LOG]") == -1) {
                let messObj = JSON.parse(buffer);

                //ping Time
                if (messObj.functionName == "ping") {
                    //
                    PingTimeManager.Instance.serverBackFun();
                } else {
                    if (messObj.className == "Tip" && messObj.functionName == "Message") {
                        //
                        let messStr = messObj.args[0];
                        let messageObj = JSON.parse(messStr);
                        let title: string = messageObj.title;
                        let tipType = messageObj.tipType;
                        let context = messageObj.context;
                        console.log(title,tipType,context);
                        if (tipType == 0) {
                            UITipManager.Instance.tipPanelText = "Login denied\nThe account has been logged in to another device\nPlease refresh the page and re-enter the game";
                            UITipManager.Instance.type = TipPanelType.mistake;
                        } else {
                            UITipManager.Instance.tipPanelText = context;
                            UITipManager.Instance.type = TipPanelType.rest;
                        }
                        UIOpenOrHideManager.Instance.OpenTipsTCView();
                    } else {
                        console.error(messObj);
                    }
                }
                if (messObj.className == "newUser") {
                    UIOpenOrHideManager.Instance.HideTloadingView();
                    // UIOpenOrHideManager.Instance.OpenCreateCharacterView();  // 进入创建角色
                }
                // if (messObj.functionName == "login") {
                //     //登录成功返回
                //     UIOpenOrHideManager.Instance.HideTestView();
                //     //
                //     let roleArr = messObj.args[0];
                //     StageMgr.onLoginServerSuccess();
                // }
                // if (messObj.functionName == "creatARoom") {
                //     //加载房间场景

                // }
                // if (messObj.functionName == "addToRoom") {
                //     //进入游戏开始前等待房间
                //     let roleArr = messObj.args[0];
                //     StageMgr.createRole(roleArr);
                // }
                // if (messObj.functionName == "loadGame") {
                //     //开始加载游戏场景
                //     let roleArr = messObj.args[0];
                //     StageMgr.loadGameScene(roleArr);
                // }
                // if (messObj.functionName == "startGame") {
                //     //可以开始游戏
                // }
                // if (messObj.functionName == "updataGame") {
                //     //同步玩家数据
                //     let roleArr = messObj.args[0];
                //     StageMgr.moveRole(roleArr);
                // }

            }
        }
    }

    public sendMessage(buff: Uint8Array) {
        console.error("发送消息", buff.toString());
        // console.error(buff.join());
        // this.rnetStream.Write(buff, 0, buff.length);

        NetWebscoket.Instance.send(buff);
    }

    public onopen(e) {
        console.log("WebSocket连接成功! 开始链接服务器onopen");
    }

    public send(bytes: Uint8Array) {
        // console.error("发送");
        // console.error(bytes.join());
        if (this._webscoket && this._webscoket.readyState == 1) {
            this._webscoket.send(bytes);
        } else {
            console.error("谁的傻逼代码 服务器都还没连上就调发送了111！");
        }
    }

    public sendStr(mess: string) {
        // console.error("发送");
        if (this._webscoket && this._webscoket.readyState == 1) {
            this._webscoket.send(mess);
        } else {
            console.error("谁的傻逼代码 服务器都还没连上就调发送了222！");
        }
    }

    public onclose(e) {
        console.error("socket close  连接关闭连接关闭连接关闭。。。", e);
        UITipManager.Instance.tipsData = 1;
        UITipManager.Instance.tipPanelText = "Server disconnected\nPlease refresh the page and re-enter the game";
        UITipManager.Instance.type = TipPanelType.mistake;
        UIOpenOrHideManager.Instance.OpenTipsTCView();
    }
    public onerror(e) {
        console.error(e);
        console.log("socket error", e);
        if (UITipManager.Instance.tipsData != 1) {
            UITipManager.Instance.tipPanelText = e;
            UITipManager.Instance.type = TipPanelType.mistake;
            UIOpenOrHideManager.Instance.OpenTipsTCView();
        }

    }

    private Close() {
        if (this._webscoket) {
            this._webscoket.close();
        }
    }

}