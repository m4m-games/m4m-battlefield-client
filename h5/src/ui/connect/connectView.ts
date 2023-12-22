import { ConnectWalletManager } from "Core/blockchain/ConnectWalletManager";
import { CellData } from "Data/CellData";
import { Grid } from "Data/Grid";
import { GridData } from "Data/GridData";
import { ListModel } from "Data/ListModel";
import { UIOpenOrHideManager } from "Manager/UIOpenOrHideManager";
import { WebsocketTool } from "Net/WebsocketTool";
import { connect } from "./connect";
import { WalletCell } from "./WalletCell";
/*链接钱包功能界面*/
export class connectView extends connect {
    public static Instance: connectView;
    private grid: Grid;
    private walletList = new ListModel<any>();
    // private ViewData: tloadingViewData;
    public onInit() {
        super.onInit();
        // //打开当前界面不影响其他界面 TipPanel
        // this.noAffected = true;
        //屏蔽UI事件
        // commTool.makeUIEventDiscard(this.gamebg.transform);
        this.connect1_btn_btnEvent = this.connectBtnFun.bind(this);
        //this.connect1_btn.button.addListener(m4m.event.UIEventEnum.PointerDown, this.connectBtnFun, this);
        this.cancle_btn_btnEvent = this.closeBtnFun.bind(this);
        //this.cancle_btn.button.addListener(m4m.event.UIEventEnum.PointerDown, this.closeBtnFun, this);
        // 多语言版本
        this.text2_lab_text("PLEASE CONNECT TO YOUR WALLET");
        this.gamebg4_img.connect1_btn.text2_lab.label.fontsize += 5;
        this.gamebg4_img.connect1_btn.text2_lab.label.color2 = new m4m.math.color(0.5, 0.5, 0.5);
        this.text1_lab_text("CONNECT TO A WALLET");
        this.gamebg4_img.cancle_btn.text1_lab.label.fontsize += 5;
        this.gamebg4_img.cancle_btn.text1_lab.label.color2 = new m4m.math.color(0.5, 0.5, 0.5);
        this.connecttext1_lab_text("CONNECT");
        this.gamebg4_img.connect1_btn.connecttext1_lab.label.color2 = new m4m.math.color(1, 1, 1);
        this.cancletext1_lab_text("CANCEL");
        this.gamebg4_img.cancle_btn.cancletext1_lab.label.color2 = new m4m.math.color(0.19, 0.19, 0.19);
        this.onShow = this.onShowFun.bind(this);
        this.onHide = this.onHideFun.bind(this);
        this.onDispose = this.onDisposeFun.bind(this);
        this.initWalletGrid();
        this.setWalletData();
        this.gamebg4_img.buttonbg.transform.visible = false;
    }
    //初始化钱包按钮
    private initWalletGrid() {
        let lo = m4m.framework.layoutOption;
        let cellTrans: m4m.framework.transform2D = this.gamebg4_img.buttonbg.button1_img.transform;
        // cellTrans.layoutState = m4m.framework.layoutOption.LEFT | m4m.framework.layoutOption.V_CENTER;
        // cellTrans.visible = true;
        let cellPercentWidth = cellTrans.width;
        let cellPercentHeight = cellTrans.height;
        let cellData = new CellData();
        cellData.width = cellPercentWidth;
        cellData.height = cellPercentHeight;
        let gridData = new GridData();
        gridData.columns = 4;
        gridData.rows = 2;
        gridData.offsetX = 60;
        gridData.offsetY = 60;
        let initX = cellTrans.getLayoutValue(lo.LEFT);
        gridData.initXPlace = initX;
        console.error("initX", gridData.initXPlace);
        let initY = cellTrans.getLayoutValue(lo.V_CENTER);
        gridData.initYPlace = initY;
        gridData.cellName = WalletCell.name;
        gridData.cellData = cellData;
        gridData.cell = this.gamebg4_img.buttonbg.button1_img;
        //生成的格子放在父节点
        gridData.parentTrans = cellTrans.parent;
        gridData.cellLayoutX = lo.LEFT;
        gridData.cellLayoutY = lo.V_CENTER;
        this.grid = new Grid(gridData);
        this.grid.selectCallBackFun = this.sellectFun.bind(this);
        cellTrans.visible = false;
        // this.gamebg4_img.buttonbg.button1_img.transform.setLayoutValue(m4m.framework.layoutOption.LEFT, 100);
        // this.gamebg4_img.buttonbg.button1_img.transform.markDirty();
    }
    //点击单个钱包
    private sellectFun(index) {
        // console.error("点击了单个钱包", index);
        // let walletType = "m";
        // if (index == 5) {
        //     walletType = "w";
        // } else if (index == 6) {
        //     walletType = "b";
        // } else if (index == 7) {
        //     walletType = "o";
        // } else if (index == 8) {
        //     walletType = "c";
        // }
        // //链接钱包
        // console.error("StageMgr.agreeAutographbol", StageMgr.agreeAutographbol);
        // if (StageMgr.agreeAutographbol) {
        //     console.error("链接钱包");
        //     StageMgr.connect(walletType);
        //     // StageMgr.ethSignTypedData();
        // } else {
        //     console.error("授权签名");
        //     // // StageMgr.connect(walletType);
        //     StageMgr.ethSignTypedData();
        //     // NetWebscoket.Instance.connect(null, "10.67.30.52", 8004);

        // }
    }
    //设置钱包数据
    private setWalletData() {
        let walletArr = [1, 2, 3, 4, 5, 6, 7, 8];
        this.walletList.setSource(walletArr);
        this.grid.setListModel(this.walletList);
        // console.error(this.buttonbg.transform.width, "  --- ", this.grid.getWidth());
        // let leftDistance = (this.gamebg4_img.buttonbg.transform.width - this.grid.getWidth()) / 2;
        // this.grid.girdData.initXPlace = leftDistance;
        // this.grid.reshUIPosFun();
    }
    private connectBtnFun() {
        console.error("点击链接钱包按钮");
        ConnectWalletManager.Instance.loginAccount((res) => {
            let address = res.address;
            console.error(res.address);
            WebsocketTool.Instance.LoginManager_loginWithOutWallet(address, "123");
        })
    }

    private closeBtnFun() {
        // console.error("点击关闭按钮");
        this.gamebg4_img.connect1_btn.transform.visible = true;
        this.gamebg4_img.cancle_btn.transform.visible = false;
        this.gamebg4_img.buttonbg.transform.visible = false;
    }
    private onShowFun() {
        this.gamebg4_img.connect1_btn.transform.visible = true;
        this.gamebg4_img.cancle_btn.transform.visible = false;
        this.gamebg4_img.buttonbg.transform.visible = false;
        UIOpenOrHideManager.Instance.HideTloadingView();
    }
    private onHideFun() {
    }
    private onDisposeFun() {
        this.gamebg4_img.connect1_btn.button.removeListener(m4m.event.UIEventEnum.PointerDown, this.connectBtnFun, this);
        this.gamebg4_img.cancle_btn.button.removeListener(m4m.event.UIEventEnum.PointerDown, this.closeBtnFun, this);
    }
}