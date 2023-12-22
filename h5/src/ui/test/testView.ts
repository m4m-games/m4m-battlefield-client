import { StageMgr } from "Core/StageMgr";
import { PlayGameType } from "gamePlays/PlayGameType";
import { ScoreboardManager } from "Manager/ScoreboardManager";
import { UIOpenOrHideManager } from "Manager/UIOpenOrHideManager";
import { WebsocketTool } from "Net/WebsocketTool";
import { DebugLineTool2d } from "Tools/DebugLineTool2d";
import { FrameMgr } from "Tools/FrameMgr";
import { gameMathUtil } from "Tools/gameMathUtil";
import { test } from "./test";
export class testView extends test {

    public noAffected = true;
    public onInit() {
        super.onInit();
        this.onShow = this.onShowFunc.bind(this);
        this.onDispose = this.onDisposeFunc.bind(this);
        this.onHide = this.onHideFunc.bind(this);
        //点击登录
        this.button1_btn_btnEvent = this.loginBtnClick.bind(this);
        //this.button1_btn.button.addListener(m4m.event.UIEventEnum.PointerDown, this.loginBtnClick, this);
        let placeholderLabel = this.rect1_inp.inputField.PlaceholderLabel;
        placeholderLabel.color = new m4m.math.color(0.5, 0.5, 0.5, 1);
        placeholderLabel.text = "请输入名称";
        placeholderLabel.transform.markDirty();

        //ScoreboardManager.Instance.rank = 100;
        //ScoreboardManager.Instance.score = 200;
        //ScoreboardManager.Instance.showWinBoard();
    }

    //登录按钮点击
    public loginBtnClick() {
        let text=this.rect1_inp.inputField.TextLabel.text;
        console.error("点击登录: " + text);
        if(text=="")
        {
            console.error("请输入账号信息！ ");
            return;
        }
        StageMgr.playerID = text;
        WebsocketTool.Instance.LoginManager_loginWithOutWallet(text,"123");
        UIOpenOrHideManager.Instance.HideTestView();
        // WebsocketTool.Instance.LoginManager_loginWithOutWallet(text,"123");
        //UIOpenOrHideManager.Instance.OpenstageselectView();
        // StageMgr.onLoginServerSuccess();
        // UIOpenOrHideManager.Instance.HideTestView();
    }
    public onShowFunc() {
        //this.text1_lab_text("");
        this.text2_lab_text("");
        this.rect1_inp.inputField.TextLabel.text = this.randomAccount();
        //隐藏loading
        // UIOpenOrHideManager.Instance.HideLoadingView();
        UIOpenOrHideManager.Instance.HideTloadingView();
    }

    public onDisposeFunc() {

    }

    public onHideFunc() {

    }

    //测试用,随机账号
    private randomAccount() {
        let str: string = "";
        let length = gameMathUtil.RandRange(5, 10, true);
        for (let i = 0; i < length; i++) {
            str += gameMathUtil.RandRange(0, 10, true);
        }
        console.error("随机账号:", str);
        return str;
    }
}