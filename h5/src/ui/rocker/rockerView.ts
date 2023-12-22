import { StageMgr } from "Core/StageMgr";
import { BindKeyName } from "Data/BindKeyName";
import { EventGeneric, EventMgr } from "eventMgr";
import { GameType } from "GameEnum";
import { ShowAttackManager } from "Manager/ShowAttackManager";
import { FunctionBinder, UiDataManager } from "PSDUI/UiDataManager";
import { uiLayerType } from "PSDUI/UiManager";
import { RoleMgr } from "Role/RoleMgr";
import { multiToucher } from "Scripts/multiToucher";
import { CTimer } from "Time/CTimer";
import { TimeUtil } from "Time/TimeUtil";
import { commTool } from "Tools/commTool";
import { FrameMgr } from "Tools/FrameMgr";
import { PlatformType, PlatformUtil } from "Tools/PlatformUtil";
import { joyStick } from "UIBase/joyStick";
import { touchPad } from "UIBase/touchPad";
import { rockbg_img, rocker } from "./rocker";

/**
 * 摇杆 按钮 操控 界面
 */
// tslint:disable-next-line: class-name
export class rockerView extends rocker {
    // tslint:disable-next-line: jsdoc-format
    /**其他面板show 时 不隐藏 */
    public notHideOnOtherShow: boolean = true;
    public noAffected = true;
    /** 当前UI是否会影响场景玩家操作 */
    public influenceSceneAction: boolean = false;

    private joyRoot: m4m.framework.transform2D;
    private viewRoot: m4m.framework.transform2D;
    private joy: joyStick;
    private jumpBtn1: multiToucher;
    private jumpBtn2: multiToucher;
    private attackBtn: multiToucher;
    private knifeBtn: multiToucher;
    private showAttack: boolean = false;
    private viewToucher: multiToucher;
    private viewToucherPad: touchPad;
    private _evJoy: EventGeneric<m4m.math.vector2> = new EventGeneric(new m4m.math.vector2());
    private _evJoyRelease: EventGeneric<null> = new EventGeneric();
    private _evA: EventGeneric<null> = new EventGeneric();
    private _evB: EventGeneric<null> = new EventGeneric();
    private _evView: EventGeneric<m4m.math.vector2> = new EventGeneric(new m4m.math.vector2());
    private _evViewDown: EventGeneric<null> = new EventGeneric();
    private _viewDownPoint: m4m.math.vector2 = new m4m.math.vector2();
    private rockbg: rockbg_img;
    private joyResetFunBind: any;
    private bType: PlatformType;
    //private setRockerVisibleBinder: FunctionBinder;
    private _touchEnable = true;
    private showAttackBtnBind: FunctionBinder;

    public onInit() {
        super.onInit();
        this.initJoyStick();
        this.initBtns();
        this.onShow = this.onShowFunc.bind(this);
        this.onHide = this.onHideFunc.bind(this);
        this.onDispose = this.distroy.bind(this);
        //PC 平台设置
        this.bType = PlatformUtil.getTypeByBrowser();
        this.setViewTouch(this.bType == PlatformType.PC);
        // 监听摇杆显示隐藏
        //this.setRockerVisibleBinder = UiDataManager.bindFunctionData(BindKeyName.showOrHideRocker, this.setRockerVisible.bind(this));
        if (this.bType == PlatformType.PC) {
            this.joyRoot.visible = false;
            this.jumpBtn1.transform.visible = false;
            this.jumpBtn2.transform.visible = false;
            // this.attackBtn.transform.visible = false;
            this.rockbg.transform.visible = false;
        } else {
            //ios 滑动 和 移动影响问题
            let opt = m4m.framework.layoutOption;
            this.viewRoot.setLayoutValue(opt.LEFT, 400);
        }
        this.cd_lab_text("");
        this.buttonb2_img.barcd_img.transform.visible = false;
        this.showAttackBtnFunc(false);
        this.showAttackBtnBind = UiDataManager.bindFunctionData(BindKeyName.showAttackBtn, this.showAttackBtnFunc.bind(this));
        //event reg
        EventMgr.addListener("rocker_View_TouchEnable", this.onRockerViewEnable, this);
        EventMgr.addListener("rocker_View_FocusResetState", this.onFocusResetState, this);
    }

    private showAttackBtnFunc(v: boolean) {
        this.showAttack = v;
        if (this.bType != PlatformType.PC) {
            this.buttonb2_img.transform.visible = v;
            //this.buttonb2_img.barb_img.transform.visible = v;
            this.buttonb_img.transform.visible = !v;
        }
        console.error("攻击按钮状态",ShowAttackManager.Instance.Attackstate);
        if (ShowAttackManager.Instance.Attackstate == 0) {
            // 黑夜
            this.buttonb2_img.bara_btn.transform.visible = !v;
            this.buttonb2_img.barb_img.transform.visible = !v;
            this.buttonb2_img.knifea_btn.transform.visible = v;
            this.buttonb2_img.knifeb_img.transform.visible = v;
        }

    }

    private onRockerViewEnable(ev: EventGeneric<boolean>) {
        console.error(`onRockerViewEnable 0 :${ev.data}  `);
        if (ev.data == this._touchEnable) return;
        this.setRockerVisible(ev.data);
        this.setTouchsEnable(ev.data);
    }

    private setTouchsEnable(enable: boolean) {
        if (this._touchEnable == enable) return;
        this._touchEnable = enable;
        console.error(`onRockerViewEnable 1 :${enable}  `);

        if (this.jumpBtn1) {
            this.jumpBtn1.enabled = enable;
        }
        if (this.jumpBtn2) {
            this.jumpBtn2.enabled = enable;
        }
        if (this.attackBtn) {
            this.attackBtn.enabled = enable;
        }
        if (this.viewToucher) {
            this.viewToucher.enabled = enable;
        }
        if (this.joy) {
            this.joy.enabled = enable;
        }
        if (this.viewToucherPad) {
            this.viewToucherPad.enabled = enable;
        }
        if (this.knifeBtn) {
            this.knifeBtn.enabled = enable;
        }
        this.setFocusResetState();
    }

    private onFocusResetState(ev: EventGeneric<null>) {
        this.setFocusResetState();
    }

    private setFocusResetState() {
        if (this.jumpBtn1) {
            this.jumpBtn1.resetSate();
        }
        if (this.jumpBtn2) {
            this.jumpBtn2.resetSate();
        }
        if (this.attackBtn) {
            this.attackBtn.resetSate();
        }
        if (this.viewToucher) {
            this.viewToucher.resetSate();
        }
        if (this.joy) {
            this.joy.resetJoy();
        }
        if (this.knifeBtn) {
            this.knifeBtn.resetSate();
        }
    }

    //设置摇杆ui隐藏/显示
    private setRockerVisible(flag: boolean) {
        if (this.bType != PlatformType.PC) {
            this.joyRoot.visible = flag;
            if (this.showAttack) {
                this.jumpBtn2.transform.visible = flag;
            } else {
                this.jumpBtn1.transform.visible = flag;
            }
            this.rockbg.transform.visible = flag;
        }
    }

    //初始化摇杆
    private initJoyStick() {
        this.rockbg = this.rockbg_img;
        let opt = m4m.framework.layoutOption;
        let viewRoot = this.viewRoot = new m4m.framework.transform2D();
        this.transform.addChildAt(viewRoot, 0);
        viewRoot.layoutState = opt.LEFT | opt.TOP | opt.RIGHT | opt.BOTTOM;
        viewRoot.name = "viewRoot";
        // this.viewToucher = viewRoot.addComponent("multiToucher") as multiToucher;
        // this.viewToucher.addPointListener(m4m.event.PointEventEnum.PointMove, this.onViewTouch, this);
        // this.viewToucher.addPointListener(m4m.event.PointEventEnum.PointDown, this.onViewDown, this);
        //摇杆
        this.joyRoot = new m4m.framework.transform2D();
        this.joyRoot.pivot = new m4m.math.vector2(0.5, 0.5);
        // //test 显示区域
        // let img = this.joyRoot.addComponent("image2D") as m4m.framework.image2D;
        // img.sprite = m4m.framework.sceneMgr.app.getAssetMgr().getDefaultSprite("white_sprite");
        // //-------------
        this.joyRoot.width = 400;
        this.joyRoot.height = 400;
        this.joyRoot.name = "joyRoot";
        //this.joyRoot.layoutState = opt.LEFT | opt.BOTTOM;

        //this.transform.addChild(this.joyRoot);

        this.rockbg.transform.addChild(this.joyRoot);
        this.rockbg.transform.pivot.x = 0.5;
        this.rockbg.transform.pivot.y = 0.5;
        this.rockbg.transform.markDirty();
        // this.joyRoot.transform.addChild(this.rockbg.transform);

        //test-----
        // let ttt = new m4m.framework.transform2D();
        // ttt.width = ttt.height = 200;
        // let tttImg = ttt.addComponent("image2D") as m4m.framework.image2D;
        // tttImg.sprite = m4m.framework.sceneMgr.app.getAssetMgr().getDefaultSprite("grid_sprite");
        //----------
        // let joyImg = tttImg;
        let joyImg = this.rockbg.rock_btn.image;
        this.rockbg.rock_btn.transform.removeComponentByTypeName("button");
        //commTool.makeUIEventDiscard(joyImg.transform);


        this.joyRoot.addChild(joyImg.transform);
        joyImg.transform.pivot.x = 0.5;
        joyImg.transform.pivot.y = 0.5;
        joyImg.transform.localTranslate = new m4m.math.vector2();
        joyImg.transform.layoutState = 0;
        joyImg.transform.layoutPercentState = 0;
        joyImg.transform.markDirty();
        //摇杆
        let _joy = this.joy = joyImg.transform.addComponent("joyStick") as joyStick;
        _joy.moveRange = 70;
        _joy.overImg = joyImg;
        _joy.onShake = this.onJoyShake.bind(this);
        _joy.onRelease = this.onJoyRelease.bind(this);

        this.joyResetFunBind = this.joyResetFun.bind(this);
        //摇杆 复位
        UiDataManager.bindFunctionData(BindKeyName.joyReset, this.joyResetFunBind);
    }

    //摇杆 复位
    private joyResetFun() {
        // console.error("摇杆 复位");
        //复位
        this.joy.resetJoy();
    }

    private setViewTouch(isPC: boolean) {
        if (isPC) {
            this.viewToucherPad = this.viewRoot.addComponent("touchPad") as touchPad;
            this.viewToucherPad.onValueChange = this.onViewTouchValCg.bind(this);
            this.viewToucherPad.onPointDown = (x, y) => {
                this.onViewDown([x, y]);
            };
        } else {
            this.viewToucher = this.viewRoot.addComponent("multiToucher") as multiToucher;
            this.viewToucher.addPointListener(m4m.event.PointEventEnum.PointMove, this.onViewTouch, this);
            this.viewToucher.addPointListener(m4m.event.PointEventEnum.PointDown, this.onViewDown, this);
        }
    }

    private onSetViewTouch(e: EventGeneric<boolean>) {
        this.setViewTouch(e.data);
    }

    //初始化 按钮
    private initBtns() {
        this.buttonb_img.buttona_btn.transform.removeComponentByTypeName("button");
        let btna = this.buttonb_img.transform;
        let mtA = this.jumpBtn1 = btna.addComponent("multiToucher") as multiToucher;
        mtA.addPointListener(m4m.event.PointEventEnum.PointDown, this.onBtnAClick, this);
        mtA.addPointListener(m4m.event.PointEventEnum.PointUp, this.onBtnAUPClick, this);

        this.buttonb2_img.buttona1_btn.transform.removeComponentByTypeName("button");
        let btna1 = this.buttonb2_img.transform;
        let mtA1 = this.jumpBtn2 = btna1.addComponent("multiToucher") as multiToucher;
        mtA1.addPointListener(m4m.event.PointEventEnum.PointDown, this.onMtaClick, this);
        mtA1.addPointListener(m4m.event.PointEventEnum.PointUp, this.onMtaAUPClick, this);

        this.buttonb2_img.bara_btn.transform.removeComponentByTypeName("button");
        let baral = this.buttonb2_img.barb_img.transform;
        let matbarl = this.attackBtn = baral.addComponent("multiToucher") as multiToucher;
        matbarl.addPointListener(m4m.event.PointEventEnum.PointDown, this.onMatbaAClick, this);
        matbarl.addPointListener(m4m.event.PointEventEnum.PointUp, this.onMatbaAUp, this);

        this.buttonb2_img.knifea_btn.transform.removeComponentByTypeName("button");
        let knifeal = this.buttonb2_img.knifeb_img.transform;
        let matknifl = this.knifeBtn = knifeal.addComponent("multiToucher") as multiToucher;
        matknifl.addPointListener(m4m.event.PointEventEnum.PointDown, this.onKnifeAClick, this);
        matknifl.addPointListener(m4m.event.PointEventEnum.PointUp, this.onKnifeAUp, this);
        //跑的按钮隐藏 功能加入到摇杆中
        // btnb.transform.visible = false;
        // let mtB = this.attackBtn = btnb.addComponent("multiToucher") as multiToucher;
        // mtB.addPointListener(m4m.event.PointEventEnum.PointDown, this.onBtnBDown, this);
        // mtB.addPointListener(m4m.event.PointEventEnum.PointUp, this.onBtnBUp, this);
        // this.attackBtn.transform.visible = false;

        // CTimer.Instance.loopTimeUpdate(1000, this.updateFun.bind(this));
    }
    //测试
    private updateFun() {
        this.onBtnAClick();
    }
    private onJoyShake(x, y, currdis) {
        // console.log(`${x}_${y}`);
        // console.error("范围 ", currdis);
        if (currdis >= 30) {//因用的取目标点作位移 刚按下的小范围输入会不准确 暂时用大于30以上的范围值才派发
            let v2 = this._evJoy.data;
            v2.x = x;
            v2.y = -y;
            let needFixedLength = true;;
            if (needFixedLength) {
                m4m.math.vec2Normalize(v2, v2);
            }
            EventMgr.dispatchEvent("rocker_Direction", this._evJoy);

            if (currdis >= 60) {
                this.onBtnBDown();
            } else {
                this.onBtnBUp();
            }
        }
    }
    private onKnifeAClick() {
        this.buttonb2_img.knifea_btn.transform.visible = false;
        EventMgr.dispatchEvent("rocker_AttackBtn_click", this._evA);
    }
    private onKnifeAUp() {
        this.buttonb2_img.knifea_btn.transform.visible = true;
    }
    private onJoyRelease() {
        EventMgr.dispatchEvent("rocker_Release", this._evJoyRelease);
    }
    private onBtnAUPClick() {
        this.buttonb_img.buttona_btn.transform.visible = true;
    }
    private onBtnAClick() {
        // console.error("点了跳按钮！！",TimeUtil.realtimeSinceStartup);
        this.buttonb_img.buttona_btn.transform.visible = false;
        EventMgr.dispatchEvent("rocker_JumpBtn_click", this._evA);
    }
    private onMtaAUPClick() {
        this.buttonb2_img.buttona1_btn.transform.visible = true;
    }

    private onMtaClick() {
        this.buttonb2_img.buttona1_btn.transform.visible = false;
        EventMgr.dispatchEvent("rocker_JumpBtn_click", this._evA);
    }

    private onMatbaAClick() {
        this.buttonb2_img.bara_btn.transform.visible = false;
        EventMgr.dispatchEvent("rocker_AttackBtn_click", this._evA);
    }
    private onMatbaAUp() {
        this.buttonb2_img.bara_btn.transform.visible = true;
    }

    private onBtnBDown() {
        // EventMgr.dispatchEvent("rocker_AttackBtn_click", this._evAttack);
        EventMgr.dispatchEvent("rocker_RunBtn_Down", this._evB);
    }

    private onBtnBUp() {
        // EventMgr.dispatchEvent("rocker_AttackBtn_click", this._evAttack);
        EventMgr.dispatchEvent("rocker_RunBtn_Up", this._evB);
    }

    private onViewDown([x, y]) {
        // console.error(`onViewDown `);
        this._viewDownPoint.x = x;
        this._viewDownPoint.y = y;
        EventMgr.dispatchEvent("rocker_View_down", this._evViewDown);
    }

    private onViewTouch([x, y]) {
        let _oldP = this._viewDownPoint;
        this.onViewTouchValCg(x - _oldP.x, y - _oldP.y);
        // console.log(`${this._evView.data.x} _ ${this._evView.data.y}`);
    }

    private onViewTouchValCg(x: number, y: number) {
        this._evView.data.x = x;
        this._evView.data.y = y;
        EventMgr.dispatchEvent("rocker_View_move", this._evView);
    }

    public onShowFunc() {

    }

    public onHideFunc() {

    }

    private distroy() {
        EventMgr.removeListener("rocker_View_FocusResetState", this.onFocusResetState, this);

        //UiDataManager.unBindFunctionDataByBinder(this.setRockerVisibleBinder);
        //摇杆 复位
        UiDataManager.unBindFunctionData(BindKeyName.joyReset, this.joyResetFunBind);
        UiDataManager.unBindFunctionDataByBinder(this.showAttackBtnBind);

        this.joy.onRelease = null;
        this.joy.onShake = null;
        this.jumpBtn1.removePointListener(m4m.event.PointEventEnum.PointClick, this.onBtnAClick, this);
        this.jumpBtn2.removePointListener(m4m.event.PointEventEnum.PointClick, this.onMtaClick, this);
        this.attackBtn.removePointListener(m4m.event.PointEventEnum.PointClick, this.onMatbaAClick, this);
        this.attackBtn.removePointListener(m4m.event.PointEventEnum.PointClick, this.onMatbaAUp, this);
        this.knifeBtn.removePointListener(m4m.event.PointEventEnum.PointClick, this.onKnifeAClick, this);
        this.knifeBtn.removePointListener(m4m.event.PointEventEnum.PointClick, this.onKnifeAUp, this);

        if (this.viewToucher) {
            this.viewToucher.removePointListener(m4m.event.PointEventEnum.PointMove, this.onViewTouch, this);
            this.viewToucher.removePointListener(m4m.event.PointEventEnum.PointDown, this.onViewDown, this);
        }
        if (this.viewToucherPad) {
            this.viewToucherPad.onValueChange = null;
            this.viewToucherPad.onPointDown = null;
            this.viewToucherPad.onPointUp = null;
        }

        this.viewToucherPad = null;
        this.joyRoot = null;
        this.joy = null;
        this.jumpBtn1 = null;
        this.jumpBtn2 = null;
        // this.attackBtn = null;
    }
}