import { StageMgr } from "Core/StageMgr";
import { BindKeyName } from "Data/BindKeyName";
import { CellData } from "Data/CellData";
import { CommonUIUtils } from "Data/CommonUIUtils";
import { Grid } from "Data/Grid";
import { GridData } from "Data/GridData";
import { ListModel } from "Data/ListModel";
import { GameType } from "GameEnum";
import { GamingManager } from "Manager/GamingManager";
import { UiDataManager } from "PSDUI/UiDataManager";
import { uiLayerType } from "PSDUI/UiManager";
import { RoleMgr, TopPosMap } from "Role/RoleMgr";
import { FrameMgr } from "Tools/FrameMgr";
import { touchPad } from "UIBase/touchPad";
import { gaming, statebg, topbg } from "./gaming";
import { gamingCell } from "./gamingCell";
import { gamingrnCell } from "./gamingrnCell";
import { gamingViewData } from "./gamingViewData";
import { TopBar } from "./TopBar";
import { TopBarCtr } from "./TopBarCtr";

/**游戏中的倒计时界面*/
export class gamingView extends gaming {
    public static Instance: gamingView;
    public noAffected = true;
    /** 当前UI是否会影响场景玩家操作 */
    public influenceSceneAction: boolean = false;
    public uiLayer = uiLayerType.midlayer;
    /** 状态条模板 */
    private slotRoleBarMap: { [slotId: number]: { roleID: number, topBar: TopBar } } = {};
    // private topVisibleMap: { [slotId: number]: boolean } = {};
    private isReadyBol: boolean;
    private zoomNum: number = 0;

    //头顶文本是否显示
    private topBarVisible: boolean = true;
    private viewToucherPad: touchPad;
    //默认头顶文本颜色
    private readonly defaultColor = new m4m.math.color();

    private startTimeCDFunBind: any;
    private runningTimeCDFunBind: any;
    private onBattleRoleTopBind: any;
    private onPlayerDeadBind: any;
    private readyTimeCDFunBind: any;
    private setTopBarVisibleBind: any;
    private enableGamingToucherBind: any;
    private clearTopBarBind: any;
    private leftbgFun: any;
    public ViewData: gamingViewData;
    public mygrid: Grid;
    public mygListModel = new ListModel<any>();
    private Textlaber: any;
    public rnygrid: Grid;
    public rnygrListModel = new ListModel<any>();
    public bgRealH: number;
    public tiemat: number = 0;

    public onInit() {
        super.onInit();
        this.onShow = this.onShowFunc.bind(this);
        this.onHide = this.onHideFunc.bind(this);
        this.onDispose = this.onDisposeFunc.bind(this);
        let intY = this.rightbg1.ms_lab.transform.height - 20;
        this.rightbg1.ms_lab.transform.setLayoutValue(m4m.framework.layoutOption.V_CENTER, intY);

        this.statebg.transform.visible = false;
        // 锚点置为左上角
        this.transform.pivot.x = 0;
        this.transform.pivot.y = 0;
        this.transform.pivot = this.transform.pivot;

        this.statebg.transform.pivot.x = 0;
        this.statebg.transform.pivot.y = 0;
        this.statebg.transform.pivot = this.statebg.transform.pivot;

        this.statebg.name_lab.transform.localTranslate = new m4m.math.vector2();
        this.statebg.name_lab.transform.markDirty();

        TopBarCtr.instance.init(this.statebg);

        this.leftbgFun = this.leftbg.leftbg1.leftblack2_img.lefttopbg.leftblack_img.transform.addComponent("button") as m4m.framework.button;
        this.leftbgFun.addListener(m4m.event.UIEventEnum.PointerDown, this.leftbgBtnDown, this);
        // this.leftbg.leftbg1.leftblack2_img.slide_scr.slidecontent.numberbg.deathnumber_lab.label.fontsize = 17;
        // this.leftbg.leftbg1.leftblack2_img.slide_scr.slidecontent.numberbg.deathnumber_lab.alivenumber_lab.label.fontsize = 17;
        // this.leftbg.leftbg1.leftblack2_img.lefttopbg.lefttopblack_img.lefttoplab_lab.label.fontsize = 18;
        // this.leftbg.leftbg1.leftblack2_img.lefttopbg.lefttoprgbg.lefttoplab1_lab.label.fontsize = 15;
        // this.leftbg.leftbg1.leftblack2_img.lefttopbg.lefttoprgbg.lefttoplab2_lab.label.fontsize = 15;
        // this.leftbg.leftbg1.leftblack1_img.downbg.leftdownblack_img.leftdownlab_lab.label.fontsize = 18;
        // this.leftbg.leftbg1.leftblack1_img.downbg.downlabbg.downlab3_lab.label.fontsize = 13;
        // this.leftbg.leftbg1.leftblack1_img.downbg.downlabbg.downlab2_lab.label.fontsize = 13;
        // this.leftbg.leftbg1.leftblack1_img.downbg.downlabbg.downlab4_lab.label.fontsize = 13;
        // this.leftbg.leftbg1.leftblack1_img.downbg.downlab1_lab.label.fontsize = 15;
        // this.topbg.toplab1_lab.label.fontsize = 16;
        this.leftbg.arrowbtn1_btn.transform.visible = false;
        this.topbg.transform.visible = false;
        this.arrowbtn1_btn_btnEvent = this.arrowbtn.bind(this);
        this.lefttoplab1_lab_text("Alive:  ");
        this.lefttoplab2_lab_text("Death:    ");
        this.lefttoplab_lab_text("PLAYER LIST");
        this.leftdownlab_lab_text("SCORE LIST");
        this.downlab1_lab_text("");
        this.downlab2_lab_text("");
        if (GamingManager.Instance.index == 1) {
            this.leftbg.leftbg1.transform.visible = false;
            this.leftbg.arrowbtn1_btn.transform.visible = false;
            GamingManager.Instance.index = null;
        }else{
            this.topbg.transform.visible = false;
            this.leftbg.leftbg1.transform.visible = false;
            this.leftbg.arrowbtn1_btn.transform.visible = false;
        }
        this.ViewData = new gamingViewData();
        // if (StageMgr.levelType == GameType.glassBridge) {
        //     this.leftbg.leftbg1.leftblack1_img.transform.visible = false;
        //     this.leftdownlab_lab_text("");
        // }
        // setTimeout(() => {
        //     let bar = this.getBar("222");
        //     bar.setPos({x: -100, y: -100});
        //     console.log("bar: ", bar.barTrans.localTranslate);
        // }, 2000);
        // 血条
        this.statebg.blood1_img.transform.visible = false;
        this.statebg.blood2_img.transform.visible = false;
        this.statebg.blood3_img.transform.visible = false;
        this.statebg.bloodbg_img.transform.visible = false;

        this.redmask_img.transform.visible = false;
        //this.redmask_img.image.color.a = 0.5;

        // EventMgr.addListener("Wooden_Timer_Update", this.onWoodenTimerUpdate, this);
        this.startTimeCDFunBind = this.startTimeCDFun.bind(this)
        this.runningTimeCDFunBind = this.runningTimeCDFun.bind(this);
        this.onBattleRoleTopBind = this.onBattleRoleTop.bind(this);
        this.onPlayerDeadBind = this.onPlayerDead.bind(this);
        this.readyTimeCDFunBind = this.readyTimeCDFun.bind(this);
        this.setTopBarVisibleBind = this.setTopBarVisibleFun.bind(this);
        this.enableGamingToucherBind = this.enableGamingToucherFun.bind(this);
        this.clearTopBarBind = this.clearTopBar.bind(this);
        this.Textlaber = this.Text.bind(this);
        UiDataManager.bindFunctionData(BindKeyName.startTimeCD, this.startTimeCDFunBind);
        UiDataManager.bindFunctionData(BindKeyName.runningTimeCD, this.runningTimeCDFunBind);
        UiDataManager.bindFunctionData(BindKeyName.readyTimeCD, this.readyTimeCDFunBind);
        UiDataManager.bindFunctionData(BindKeyName.battleRoleTopTos, this.onBattleRoleTopBind);
        UiDataManager.bindFunctionData(BindKeyName.playerDead, this.onPlayerDeadBind);
        UiDataManager.bindFunctionData(BindKeyName.setTopBarVisible, this.setTopBarVisibleBind);
        UiDataManager.bindFunctionData(BindKeyName.enableGamingToucher, this.enableGamingToucherBind);
        UiDataManager.bindFunctionData(BindKeyName.clearTopBar, this.clearTopBarBind);
        UiDataManager.bindFunctionData(BindKeyName.updateTitleText, this.Textlaber);
        //UiDataManager.bindFunctionData(BindKeyName.showHpBar, this.showHpBarBind);
        FrameMgr.Add(this.onUpdateFun, this);
    }

    public Text(data) {
        this.toplab1_lab_text(data);
    }

    public onShowFunc() {
        this.isReadyBol = false;
        TopBarCtr.instance.onShow(this.transform);
        this.updateHpBarFun();
    }

    public onDisposeFunc() {
        this.leftbgFun.removeListener(m4m.event.UIEventEnum.PointerDown, this.leftbgBtnDown, this);
        this.ViewData.dispose();
    }

    public onHideFunc() {
        UiDataManager.unBindFunctionData(BindKeyName.startTimeCD, this.startTimeCDFunBind);
        UiDataManager.unBindFunctionData(BindKeyName.runningTimeCD, this.runningTimeCDFunBind);
        UiDataManager.unBindFunctionData(BindKeyName.battleRoleTopTos, this.onBattleRoleTopBind);
        UiDataManager.unBindFunctionData(BindKeyName.playerDead, this.onPlayerDeadBind);
        UiDataManager.unBindFunctionData(BindKeyName.readyTimeCD, this.readyTimeCDFunBind);
        UiDataManager.unBindFunctionData(BindKeyName.setTopBarVisible, this.setTopBarVisibleBind);
        UiDataManager.unBindFunctionData(BindKeyName.enableGamingToucher, this.enableGamingToucherBind);
        UiDataManager.unBindFunctionData(BindKeyName.clearTopBar, this.clearTopBarBind);
        UiDataManager.unBindFunctionData(BindKeyName.updateTitleText, this.Textlaber);
        //UiDataManager.unBindFunctionData(BindKeyName.showHpBar, this.showHpBarBind);
        this.clearTopBar();
        TopBarCtr.instance.onHide();
        FrameMgr.Remove(this.onUpdateFun, this);
        this.transform.removeComponent(this.viewToucherPad);
        this.viewToucherPad = null;
        GamingManager.Instance.index = null;
    }
    //初始化所有玩家
    public oninfogamingGrid() {
        let lo = m4m.framework.layoutOption;
        let cellTrans: m4m.framework.transform2D = this.leftbg.leftbg1.leftblack2_img.slide_scr.slidecontent.numberbg.transform;
        let cellPercentWidth = cellTrans.width;
        let cellPercentHeight = cellTrans.height;
        let cellData = new CellData();
        cellData.width = cellPercentWidth;
        cellData.height = cellPercentHeight;
        let gridData = new GridData();
        gridData.columns = 10;
        gridData.rows = 10;
        gridData.offsetX = 14;
        gridData.offsetY = 6;
        let initX = cellTrans.getLayoutValue(lo.H_CENTER);

        gridData.initXPlace = initX;
        let initY = cellTrans.getLayoutValue(lo.V_CENTER);
        gridData.initYPlace = initY;
        gridData.cellName = gamingCell.name;
        gridData.cellData = cellData;
        gridData.cell = this.leftbg.leftbg1.leftblack2_img.slide_scr.slidecontent.numberbg;
        //生成的格子放在父节点
        gridData.parentTrans = cellTrans.parent;
        gridData.cellLayoutX = lo.H_CENTER;
        gridData.cellLayoutY = lo.V_CENTER;
        this.mygrid = new Grid(gridData);
        cellTrans.visible = false;
    }


    public oninforankinglist() {
        let lo = m4m.framework.layoutOption;
        let cellTrans: m4m.framework.transform2D = this.leftbg.leftbg1.leftblack1_img.downbg_img.downlabbg.transform;
        let cellPercentWidth = cellTrans.width;
        let cellPercentHeight = cellTrans.height;
        let cellData = new CellData();
        cellData.width = cellPercentWidth;
        cellData.height = cellPercentHeight;
        let gridData = new GridData();
        gridData.columns = 1;
        gridData.rows = 3;
        gridData.offsetX = 10;
        gridData.offsetY = 5;
        let initX = cellTrans.getLayoutValue(lo.H_CENTER);

        gridData.initXPlace = initX;
        let initY = cellTrans.getLayoutValue(lo.V_CENTER);
        gridData.initYPlace = initY;
        gridData.cellName = gamingrnCell.name;
        gridData.cellData = cellData;
        gridData.cell = this.leftbg.leftbg1.leftblack1_img.downbg_img.downlabbg;
        //生成的格子放在父节点
        gridData.parentTrans = cellTrans.parent;
        gridData.cellLayoutX = lo.H_CENTER;
        gridData.cellLayoutY = lo.V_CENTER;
        this.rnygrid = new Grid(gridData);
        cellTrans.visible = false;
        this.rnygrListModel.setSource([]);
        this.rnygrid.setListModel(gamingView.Instance.rnygrListModel);
    }


    //更新头顶文本
    private onBattleRoleTop(sMap: TopPosMap) {
        if (!this.topBarVisible) {
            return;
        }
        for (let slotId in sMap) {
            let val = sMap[slotId];
            if (val.name != null) {
                let bar = this.getBar(val.name);
                if (val.color) {
                    m4m.math.colorClone(val.color, bar.bar.name_lab.label.color);
                } else {
                    m4m.math.colorClone(this.defaultColor, bar.bar.name_lab.label.color);
                }
                let active = val.active;
                bar.setVisible(active);
                if (active) {
                    bar.setPos(val.pos);
                    bar.setHP(val.hpNormal);
                    //console.log("pos: ", val.pos);
                }
            }
        }
    }
    //头顶文本是否显示
    private setTopBarVisibleFun(v: boolean) {
        this.topBarVisible = v;
        if (!v) {
            for (let key in this.slotRoleBarMap) {
                let slot = this.slotRoleBarMap[key];
                slot.topBar.setVisible(false);
            }
        }
    }
    //清理头顶文本
    private clearTopBar() {
        let keys = Object.keys(this.slotRoleBarMap);
        for (let key of keys) {
            let slot = this.slotRoleBarMap[key];
            slot.topBar.dispose();
            delete this.slotRoleBarMap[key];
        }
    }
    private startTimeCDFun(data) {
        let time = data.time;
        let lab = this.topbg.toplab1_lab.label;
        if(this.bool){
            this.leftbg.leftbg1.transform.visible = true;
            this.leftbg.arrowbtn1_btn.transform.visible = false;
            this.topbg.transform.visible = true;
            this.bool = false
        }
        if (time > 0) {
            lab.text = "GAME STARTS IN " + time + "S";
            if (StageMgr.levelType == GameType.tugOfWar) {
                if (time == 4) {//倒计时第3秒时 拔河进入平台
                    UiDataManager.changeFunctionData(BindKeyName.gameStart, null);
                }
            }
        } else {
            // lab.text = "GAME STARTS !";
            this.tiemat = 1;
        }
    }
    private runningTimeCDFun(data) {
        if (this.ViewData.store == false) {
            if (this.tiemat == 1) {
                let time = data.time;
                let lab = this.topbg.toplab1_lab.label;
                this.topbg.transform.visible = true;
                if (time > 0) {
                    lab.text = "TIME LEFT: " + time + " S";
                } else {
                    lab.text = "TIME 'S UP";
                    // this.jianbianbg_img.transform.visible = false;
                }
            }
        }
    }
    public bool : boolean = true;
    private readyTimeCDFun(data) {
        // this.topbg.toplab1_lab.label.fontsize = 16;
        console.error("readyTime", data.time, this.topbg.toplab1_lab.transform.localScale);
        this.isReadyBol = true;
        this.zoomNum = 3;
        let time = data.time;
        let lab = this.topbg.toplab1_lab.label;
        if(this.bool){
            this.leftbg.leftbg1.transform.visible = true;
            this.leftbg.arrowbtn1_btn.transform.visible = false;
            this.topbg.transform.visible = true;
            this.bool= false;
        }
        if (time > 0) {
            lab.text = "GAME STARTS IN " + time + "S";
        } else {
            lab.text = "READY GO";
            this.tiemat = 1;
            // this.jianbianbg_img.transform.visible = false;
        }
    }
    private onUpdateFun() {
        // console.error("缩放--------", this.isReadyBol, "-------", this.zoomNum, "--------");
        if (!this.isReadyBol) { return };
        this.topbg.transform.visible = true;
        this.topbg.toplab1_lab.transform.localScale.x = this.zoomNum;
        this.topbg.toplab1_lab.transform.localScale.y = this.zoomNum;
        this.topbg.toplab1_lab.transform.markDirty();
        this.zoomNum -= 0.25;
        if (this.zoomNum == 1) {
            this.isReadyBol = false;
        }
    }

    private getBar(slotID) {
        let temp = this.slotRoleBarMap[slotID];
        if (!temp) {
            temp = this.slotRoleBarMap[slotID] = { roleID: -1, topBar: TopBarCtr.instance.newBar() };
            temp.topBar.setPlayerName(slotID);
            this.updateHpBarVisible(temp.topBar.bar, slotID.toString());
        }
        return temp.topBar;
    }

    private updateHpBarFun() {
        for (let key in this.slotRoleBarMap) {
            let slot = this.slotRoleBarMap[key];
            this.updateHpBarVisible(slot.topBar.bar, key.toString());
        }
    }

    //更新血条是否显示
    private updateHpBarVisible(statebg: statebg, slotID: string) {
        if (GamingManager.Instance.hpBarVisible == 0) {
            statebg.blood1_img.transform.visible = false;
            statebg.blood2_img.transform.visible = false;
        } else if (GamingManager.Instance.hpBarVisible == 1) {
            let v = slotID == RoleMgr.player.roleData.name;
            statebg.blood1_img.transform.visible = v;
            statebg.blood2_img.transform.visible = v;
        } else if (GamingManager.Instance.hpBarVisible == 2) {
            statebg.blood1_img.transform.visible = true;
            statebg.blood2_img.transform.visible = true;
        }
    }

    private onPlayerDead(guid: string) {
        if (guid == StageMgr.PlayerGUID) {
            this.redmask_img.transform.visible = true;
        }
    }

    public arrowbtn() {
        this.leftbg.leftbg1.transform.visible = true;
        this.leftbg.arrowbtn1_btn.transform.visible = false;
    }
    public leftbgBtnDown() {

        this.leftbg.leftbg1.transform.visible = false;
        this.leftbg.arrowbtn1_btn.transform.visible = true;
    }

    //是否启用点击触摸
    private enableGamingToucherFun(v: boolean) {
        if (!this.viewToucherPad) {
            this.viewToucherPad = this.transform.addComponent("touchPad") as touchPad;
            this.viewToucherPad.onPointDown = this.onPointDown.bind(this);
            this.viewToucherPad.onPointUp = this.onPointUp.bind(this);
            this.viewToucherPad.onValueChange = this.onPointMove.bind(this);
        }
        this.viewToucherPad.enabled = v;
    }
    private onPointDown(x, y) {
        UiDataManager.changeFunctionData(BindKeyName.gamingToucherPoint, { type: "down", x, y });
    }
    private onPointUp(x, y) {
        UiDataManager.changeFunctionData(BindKeyName.gamingToucherPoint, { type: "up", x, y });
    }
    private onPointMove(x, y) {
        UiDataManager.changeFunctionData(BindKeyName.gamingToucherPoint, { type: "move", x, y });
    }


    public leftblack() {
        //console.log(this.mygrid.getHeight());
        // if (this.mygrid.getHeight() < 95) {
        //     this.leftbg.leftbg1.leftblack2_img.transform.height = this.leftbg.leftbg1.leftblack2_img.transform.height - (95 - this.mygrid.getHeight()) + 10;
        //     this.leftbg.leftbg1.leftblack2_img.transform.markDirty();
        //     if (this.mygrid.getHeight() < 21.5) {
        //         this.leftbg.leftbg1.leftblack1_img.transform.setLayoutValue(m4m.framework.layoutOption.TOP, (95 - this.mygrid.getHeight()) + 31);
        //         this.leftbg.leftbg1.leftblack1_img.transform.markDirty();
        //     } else {
        //         this.leftbg.leftbg1.leftblack1_img.transform.setLayoutValue(m4m.framework.layoutOption.TOP, (95 - this.mygrid.getHeight()) + 69);
        //         this.leftbg.leftbg1.leftblack1_img.transform.markDirty();
        //     }
        // }
    }
}