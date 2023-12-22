import { StageMgr } from "Core/StageMgr";
import { CellData } from "Data/CellData";
import { Grid } from "Data/Grid";
import { GridData } from "Data/GridData";
import { ListModel } from "Data/ListModel";
import { GameMgr } from "GameMgr";
import { PlayGameType } from "gamePlays/PlayGameType";
import { UIOpenOrHideManager } from "Manager/UIOpenOrHideManager";
import { TipPanelType, UITipManager } from "Manager/UITipManager";
import { UserDataManager } from "Manager/UserDataManager";
import { WebsocketTool } from "Net/WebsocketTool";
import { WsDataManager } from "Net/WsDataManager";
import { commTool } from "Tools/commTool";
import { PlatformType, PlatformUtil } from "Tools/PlatformUtil";
import { imgSpriteArrange } from "UIBase/imgSpriteArrange";
import { MenuBtnCell } from "./MenuBtnCell";
import { Hall } from "./Hall";
import { HallViewData } from "./HallViewData";
import { uiLayerType } from "PSDUI/UiManager";
import { PingTimeManager } from "Net/PingTimeManager";
import { CommonUIUtils } from "Data/CommonUIUtils";
import { FrameMgr } from "Tools/FrameMgr";
import { UiDataManager } from "PSDUI/UiDataManager";
import { BindKeyName } from "Data/BindKeyName";
import { EventGeneric, EventMgr } from "eventMgr";
import { multiToucher } from "Scripts/multiToucher";

/*大厅界面*/
export class HallView extends Hall {
    public static Instance: HallView;
    public uiLayer = uiLayerType.midlayer;
    public ticketImgNum: imgSpriteArrange;
    private viewData: HallViewData;
    /** 当前UI是否会影响场景玩家操作 */
    public influenceSceneAction: boolean = false;
    /* 当前UI是否会被记录（用于返回上一步打开）**/
    public isLogUi: boolean = true;
    private buygrid: Grid;
    private buyListModel = new ListModel<any>();
    public static menu: boolean = false;
    public gear_btn:boolean = false;
    public NetworkBindFun: any;
    // 当前选中数据
    private selectData: any;
    public selectCellIndex: number = 0;
    public zbbbList: any[] = [{ namme: "LEADERBOARD", type: 1 }, { namme: "STORE", type: 2 }, { namme: "INVENTORY", type: 3 }];
    public list: import("Net/PingTimeManager").NetworkQualityType;
    public listekas: boolean = true;
    public liste: number;
    public main: any;
    private _ev: EventGeneric<boolean> = new EventGeneric();
    // public proNumImg: imgSpriteArrange;

    public onInit() {
        super.onInit();
        // //打开当前界面不影响其他界面 TipPanel
        this.noAffected = true;
        HallView.menu = true;
        // if(UIStageselectManager.Instance.datainfo.length == 0){
        //     UIStageselectManager.Instance.init();  // 通知服务器获取所有门票
        // }if (UIStageselectTimeManager.Instance.timeinfo.length == 0) {
        //     UIStageselectTimeManager.Instance.init(); // 通知服务器获取所有关卡时间
        // }
        //  屏蔽UI事件
        this.viewData = new HallViewData();
        commTool.makeUIEventDiscard(this.bg1.transform, true);
        commTool.makeUIEventDiscard(this.socialiconbg.transform, true);
        this.openshutFun();
        this.menu1_btn_btnEvent = this.openshutFun.bind(this);
        this.email_btn_btnEvent = this.openmailFun.bind(this);
        // this.initBtns();
        let gear = this.bg1.bg3.rightblackbg_img.right2.gear_btn.button;  // 设置
        gear.addListener(m4m.event.UIEventEnum.PointerDown,this.gearBtnDownFun, this);
        // gear.addListener(m4m.event.UIEventEnum.PointerUp,this.gearBtnUpFun, this);
        this.notice_btn_btnEvent = this.OpenNoticeFun.bind(this);  // 公告
        this.man1_btn_btnEvent = this.settingFun.bind(this);
        // --------------------------------------------------------
        this.naver_btn_btnEvent = this.settingFun.bind(this);
        this.discord_btn_btnEvent = this.settingFun.bind(this);
        this.youtube_btn_btnEvent = this.settingFun.bind(this);
        this.telegram_btn_btnEvent = this.settingFun.bind(this);
        this.twitter_btn_btnEvent = this.settingFun.bind(this);
        this.medium_btn_btnEvent = this.settingFun.bind(this);
        this.menulab_lab_text("MENU");
        this.bg1.bg2.menubg.menulab_lab.label.fontsize -= 11;
        // this.rightblackbg_img.rightbg1.ms_lab.label.fontsize -= 2;
        let name = this.bg1.leftblackbg_img.player_lab.transform.addComponent("button") as m4m.framework.button;   // 名字
        // this.blackju_img.image.color.a = 0;
        name.addListener(m4m.event.UIEventEnum.PointerClick, this.settingFun, this);
        let ID = WsDataManager.UserVarBaseData.id;
        console.error("界面玩家账号: ", ID,"玩家名",StageMgr.playername);
        this.player_lab_text(StageMgr.playername);
        this.bg1.bg3.slideareabg.slideunit_scr.slideunitcontent.jianbianbg_img.time_lab.label.text = "Interact with NPC to enter the game";
        this.bg1.bg3.rightblackbg_img.rightbg1.ms_lab.label.fontsize -= 5; // 信号文字大小
        let intY = this.bg1.bg3.rightblackbg_img.rightbg1.ms_lab.transform.height - 20;
        this.bg1.bg3.rightblackbg_img.rightbg1.ms_lab.transform.setLayoutValue(m4m.framework.layoutOption.V_CENTER, intY);
        this.onShow = this.onShowFun.bind(this);
        this.onHide = this.onHideFun.bind(this);
        this.InitBtn(this.zbbbList);
        this.onDispose = this.onDisposeFun.bind(this);
        // this.ticketImgNum = commTool.makeImgSpriteArrange(this.button2_btn.number_img.image);
        // this.button2_btn.number_img.transform.visible = false;

        // this.liaokuang.transform.visible = false;
        // this.pinktiao_img.transform.visible = false;
        // this.lpink_img.transform.visible = false;
        if (GameMgr.openWalletBol) {

        }
        // 信号
        this.NetworkBindFun = this.NetworkFun.bind(this);
        UiDataManager.bindFunctionData(BindKeyName.Network, this.NetworkBindFun);
        this.bg1.bg3.slideareabg.slideunit_scr.slideunitcontent.jianbianbg_img.time_lab.label.fontsize = 16;
        this.time_lab_text("Your network quality is poor and the game is performing abnormally, please switch to a better network.");
        // this.jianbianbg_img.time_lab.label.text = "Your network quality is poor and the game is performing abnormally, please switch to a better network.";
        this.bg1.bg3.slideareabg.slideunit_scr.slideunitcontent.jianbianbg_img.time_lab.label.color = new m4m.math.color(1, 0, 0);
        this.bg1.bg3.slideareabg.slideunit_scr.slideunitcontent.jianbianbg_img.time_lab.transform.visible = false;
        this.bg1.bg3.slideareabg.slideunit_scr.slideunitcontent.jianbianbg_img.transform.visible = false;
        this.bg1.bg3.rightblackbg_img.rightbg1.transform.visible = false;
        //event reg
        WebsocketTool.Instance.MailManager_getMails();  // 获取邮件
    }
    // private initBtns() {
    //     this.bg1.bg3.rightblackbg_img.right2.gear_btn.transform.removeComponentByTypeName("button");
    //     let btna = this.bg1.bg3.rightblackbg_img.right2.gear1_img.transform;
    //     let mtA = btna.addComponent("multiToucher") as multiToucher;
    //     mtA.addPointListener(m4m.event.PointEventEnum.PointDown, this.gearBtnDownFun, this);
    //     mtA.addPointListener(m4m.event.PointEventEnum.PointUp, this.gearBtnUpFun, this);
    // }
    private settingFun() {
        UITipManager.Instance.tipPanelText = "Function is under development";
        UITipManager.Instance.type = TipPanelType.rest;
        UIOpenOrHideManager.Instance.OpenTipsTCView();

    }
    private OpenNoticeFun(){
        // UIOpenOrHideManager.Instance.OpenAnnouncement();
    }
    private InitBtn(list: any[]) {
        if (!this.buygrid) {
            let lo = m4m.framework.layoutOption;
            let cellTrans: m4m.framework.transform2D = this.bg1.bg2.middlebg.functionbtn1_img.transform;
            // tslint:disable-next-line: no-bitwise
            cellTrans.layoutState = m4m.framework.layoutOption.LEFT | m4m.framework.layoutOption.V_CENTER;
            // cellTrans.visible = true;
            let cellPercentWidth = cellTrans.width;
            let cellPercentHeight = cellTrans.height;
            let cellData = new CellData();
            cellData.width = cellPercentWidth;
            cellData.height = cellPercentHeight;
            let gridData = new GridData();
            gridData.columns = list.length;
            gridData.rows = 1;
            gridData.offsetX = 6;
            gridData.offsetY = 2;
            let initX = cellTrans.getLayoutValue(lo.LEFT);
            gridData.initXPlace = initX;
            let initY = cellTrans.getLayoutValue(lo.V_CENTER);
            gridData.initYPlace = initY;
            gridData.cellName = MenuBtnCell.name;
            gridData.cellData = cellData;
            gridData.cell = this.bg1.bg2.middlebg.functionbtn1_img;
            //生成的格子放在父节点
            gridData.parentTrans = cellTrans.parent;
            gridData.cellLayoutX = lo.LEFT;
            gridData.cellLayoutY = lo.V_CENTER;
            this.buygrid = new Grid(gridData);
            // this.buygrid.selectCallBackFun = this.buyCellFun.bind(this);
            cellTrans.visible = false;
            this.buyListModel.setSource(list);
            this.buygrid.setListModel(this.buyListModel);
        }
    }
    private openshutFun() {
        this.bg1.bg2.menubg.arrow1_img.transform.visible = false;
        this.bg1.bg2.menubg.arrow2_img.transform.visible = false;
        if (HallView.menu) {
            let initY = this.bg1.bg2.menubg.transform.height - 40;
            this.bg1.bg2.menubg.transform.setLayoutValue(m4m.framework.layoutOption.V_CENTER, initY);
            this.bg1.bg2.menubg.arrow1_img.transform.visible = true;
            this.bg1.bg2.middlebg.transform.visible = true;
            HallView.menu = false;
        } else {
            let initY = this.bg1.bg2.menubg.transform.height - 98;
            this.bg1.bg2.menubg.transform.setLayoutValue(m4m.framework.layoutOption.V_CENTER, initY);
            this.bg1.bg2.menubg.arrow2_img.transform.visible = true;
            this.bg1.bg2.middlebg.transform.visible = false;
            HallView.menu = true;
        }
        console.error("菜单状态", HallView.menu);
    }

    private openmailFun(){
        // UIOpenOrHideManager.Instance.OpenmailView(); // 打开邮件
    }
 	public gearBtnDownFun() {
        console.error("点击了设置");
        // UIOpenOrHideManager.Instance.OpenSettingView();
    }
    private onShowFun() {
        console.error("显示大厅UI界面");
        //判断是否是pc端,如果不是,就显示摇杆
        // if (PlatformUtil.WXGetSystemPlatformType != PlatformType.PC) {
        UIOpenOrHideManager.Instance.OpenRockerView();
        // this.ticketImgNum.setNum(UserDataManager.Instance.ticketNum);
        // }
    }
    private onHideFun() {
        FrameMgr.Remove(this.carousel, this);
        console.error("隐藏大厅UI界面");
        // UIOpenOrHideManager.Instance.HideRockerView();
    }
    private onDisposeFun() {
        FrameMgr.Remove(this.carousel, this);
    }
    // ------------------------------------------------------------------
    // 信号
    public NetworkFun(data) {
        this.bg1.bg3.rightblackbg_img.rightbg1.transform.visible = true;
        this.list = PingTimeManager.Instance.getNetworkQuality();
        this.showlist(this.list);
        this.showdata(data);
    }
    public showlist(list) {
        if (list == 1) {
            let iconType = HallView.Instance.uiName + ".atlas.json_signalg";
            this.bg1.bg3.rightblackbg_img.rightbg1.signal_img.image.sprite = CommonUIUtils.getSprite(iconType);
        } else if (list == 2) {
            let iconType = HallView.Instance.uiName + ".atlas.json_signalo";
            this.bg1.bg3.rightblackbg_img.rightbg1.signal_img.image.sprite = CommonUIUtils.getSprite(iconType);
        } else {
            let iconType = HallView.Instance.uiName + ".atlas.json_signalr";
            this.bg1.bg3.rightblackbg_img.rightbg1.signal_img.image.sprite = CommonUIUtils.getSprite(iconType);
            this.listeka(list);
        }
    }
    public listeka(list) {
        if (list == 3) {
            if (this.listekas == true) {
                this.bg1.bg3.slideareabg.slideunit_scr.slideunitcontent.jianbianbg_img.transform.visible = true;
                this.bg1.bg3.slideareabg.slideunit_scr.slideunitcontent.jianbianbg_img.time_lab.transform.visible = true;
                FrameMgr.Add(this.carousel, this);
            }
        }
    }
    public carousel() {
        let listes = this.bg1.bg3.slideareabg.slideunit_scr.transform.width + 500;
        let listt: any;
        let late: any;
        listt = Math.floor(listes);
        if (listt % 2 != 0) {
            late = listt + 1;
        } else {
            late = Math.floor(listes);
        }
        let count;
        if (this.main == null) {
            count = late - 2;
            this.main = count;
        } else {
            if (this.main != -600) {
                count = this.main - 2;
                this.main = count;
                this.listekas = false
            } else {
                this.main = late;
                FrameMgr.Remove(this.carousel, this);
                this.bg1.bg3.slideareabg.slideunit_scr.slideunitcontent.jianbianbg_img.transform.visible = false;
                this.bg1.bg3.slideareabg.slideunit_scr.slideunitcontent.jianbianbg_img.time_lab.transform.visible = false;
                this.listekas = true;
            }
        }
        this.bg1.bg3.slideareabg.slideunit_scr.slideunitcontent.jianbianbg_img.time_lab.transform.setLayoutValue(m4m.framework.layoutOption.LEFT, count);
        this.bg1.bg3.slideareabg.slideunit_scr.slideunitcontent.jianbianbg_img.time_lab.transform.markDirty();
    }
    public showdata(data) {
        if (data <= 100) {
            this.ms_lab_text(data + "ms");
            this.bg1.bg3.rightblackbg_img.rightbg1.ms_lab.label.color = new m4m.math.color(0, 1, 0, 1);
        } else if (data <= 200 && data > 100) {
            this.ms_lab_text(data + "ms");
            this.bg1.bg3.rightblackbg_img.rightbg1.ms_lab.label.color = new m4m.math.color(1, 1, 0, 1);
        } else {
            this.ms_lab_text(data + "ms");
            this.bg1.bg3.rightblackbg_img.rightbg1.ms_lab.label.color = new m4m.math.color(1, 0, 0, 1);
        }
    }
    // private onDisposeFun() {
    //     this.button2_btn.button.removeListener(m4m.event.UIEventEnum.PointerDown, this.buyTicketFun, this);
    //     this.button1_btn.button.removeListener(m4m.event.UIEventEnum.PointerDown, this.rankAndAwardFun, this);
    // }
}