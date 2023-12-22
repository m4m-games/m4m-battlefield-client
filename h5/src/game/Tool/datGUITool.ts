import { EventDispatcher } from "Data/EventDispatcher";
import { RTree } from "Data/rtree";
import { EventBase, EventGeneric, EventMgr } from "eventMgr";
import { SceneHideEvent } from "events/sceneHideEvent";
import { SceneShowEvent } from "events/sceneShowEvent";
import { UiManager } from "PSDUI/UiManager";
import { TimeUtil } from "Time/TimeUtil";
import { commTool } from "Tools/commTool";
import { DebugLineTool2d } from "Tools/DebugLineTool2d";
import { getSpTransform } from "Tools/engineParallel/parallelEngineTool";
import { ISpTransform } from "Tools/engineParallel/spInterface";
import { FrameMgr } from "Tools/FrameMgr";
import { LateUpdateMgr } from "Tools/LateUpdateMgr";
import { miniAPIType, miniGame } from "Tools/miniGame";
import { Over3dModelMgr } from "Tools/Over3dModelMgr";
import { metaUIManager } from "UIBase/metaUIManager";
import { uiPolygon } from "UIBase/uiPolygon";
import { uiRenderLeaper } from "UIBase/uiRenderLeaper";
import { AudioPlayer } from "../Audio/AudioPlayer";
import { EffectMgr } from "../Core/EffectMgr";
import { GameLogic } from "../Core/GameLogic";
import { StageMgr } from "../Core/StageMgr";
import { GameMgr } from "../GameMgr";
import { RoleMgr } from "../Role/RoleMgr";
import { SceneCamAvoidObsCtr } from "../Scene/SceneCamAvoidObsCtr";
import { SceneMgr } from "../Scene/SceneMgr";
import { SceneObstacleMgr } from "../Scene/SceneObstacleMgr";

declare let dat;

/**
 * datGUI  调试GUI 工具
 * dat使用教程 @see http://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
 */
export class DatGUITool {

    public static uiPickFolder: any;
    public static effOverUIFolder: any;
    public static rayHitSceneFolder: any;

    private static getGUI() {
        if (this._currGUI) {
            this.clear();
        }
        this._currGUI = new dat.GUI();
        return this._currGUI;
    }
    private static getTitleName(text: string) {
        let idx = text.indexOf("\n");
        if (idx == -1) { return ""; }
        return text.substring(0, 2);
    }

    private static ckOpenEvent(innerText: string, map) {
        let name = this.getTitleName(innerText);
        let fun = map[name];
        if (fun) {
            fun();
        }
    }
    private static makeOpenClose() {
        let dom = dat.dom.dom;
        let oldCloseFun = dom.addClass;
        dom.addClass = (elem, className: string) => {
            oldCloseFun(elem, className);
            if (className == "closed") {
                this.ckOpenEvent(elem.innerText, this.TitleCloseEventMap);
            }
        };

        let oldOpenFun = dom.removeClass;
        dom.removeClass = (elem, className: string) => {
            oldOpenFun(elem, className);
            if (className == "closed") {
                this.ckOpenEvent(elem.innerText, this.TitleOpenEventMap);
            }
        };
    }

    /** 注册 title 点击 open */
    public static onTitleOpen(titleName: string, cb: () => any) {
        this.TitleOpenEventMap[titleName] = cb;
    }

    /** 注册 title 点击 close */
    public static onTitleClose(titleName: string, cb: () => any) {
        this.TitleCloseEventMap[titleName] = cb;
    }

    public static clear() {
        if (!this._currGUI) { return; }
        let selfEle = this._currGUI.domElement as HTMLElement;
        (selfEle.parentElement as HTMLElement).removeChild(selfEle);
        this._currGUI = null;
    }

    /** 使用样例 */
    public static example() {
        if (!dat) { return; }
        let FizzyText = function () {
            this.message = "dat.gui";
            this.speed = 0.8;
            this.displayOutline = false;
            this.explode = () => { console.log(`do explode`); };
            // Define render logic ...
        };

        let text = new FizzyText();
        let gui = this.getGUI();
        gui.add(text, "message");
        gui.add(text, "speed", -5, 5);
        gui.add(text, "displayOutline");
        gui.add(text, "explode");
        let folderF = gui.addFolder("Folder");
    }
    //游戏运行调试
    public static runGameGUI() {
        if (miniGame.miniType != miniAPIType.none || !dat) { return; }
        let obj = this.runGameContent;
        if (!this.runGameContent) {
            obj = this.runGameContent = new SetContent();
        }

        let gui = this.runGameDatGUIObj = new dat.GUI({ closeOnTop: true, name: "runGameGUI" });
        gui.close();
        gui.add(obj, "title")
            .listen();
        let folderDebug = gui.addFolder("调试");//----------------------------------------
        //--------------------------全局设置-----------------------------
        folderDebug.add(obj, "switchLOG")
            .name("显示LOG")
        folderDebug.add(obj, "switchFPS")  //fps
            .name("显示FPS");
        folderDebug.add(obj, "switchDrawCall")  //drawcall
            .name("显示DrawCall数量");
        // folderDebug.add(GameMgr, "debugModeBattle")  //调试模式
        //     .listen()
        //     .name("战斗调试模式");
        folderDebug.add(obj, "openVconsole")  //打开 虚拟 console
            .listen()
            .name("打开VConsole");
        folderDebug.add(obj, "enableDebugDraw")  //开启 debug绘制
            .listen()
            .name("debug绘制");
        folderDebug.add(obj, "enablePickUI")  //拣选UI节点
            .listen()
            .name("拣选UI节点");
        //----------------UI 点选--------------------------------
        let uiPickFolder = this.uiPickFolder = folderDebug.addFolder("UI选中");
        uiPickFolder.add(obj, "pickUIVisiable")  //
            .listen()
            .name("显示UI");
        uiPickFolder.add(obj, "pickUIName")  //
            .listen()
            .name("UI名字");
        uiPickFolder.add(obj, "pickUIPos")  //
            .listen()
            .name("UI世界坐标");
        uiPickFolder.add(obj, "pickUIPivot")  //
            .listen()
            .name("UI锚点");
        uiPickFolder.add(obj, "pickUILayout")  //
            .listen()
            .name("UI对齐状态(像素)");
        uiPickFolder.add(obj, "pickUILayoutPerc")  //
            .listen()
            .name("UI对齐状态(百分比)");
        uiPickFolder.add(obj, "pickUIComponents")  //
            .listen()
            .name("UI挂在的组件");
        uiPickFolder.add(obj, "pickUIPath")  //
            .listen()
            .name("UI全局路径");
        folderDebug.add(obj, "enableRayHitScene")  //拣选UI节点
            .listen()
            .name("射线碰场景");
        let rayHitSceneFolder = this.rayHitSceneFolder = folderDebug.addFolder("射线点中");
        rayHitSceneFolder.add(obj, "pickModelVisiable")  //显示模型
            .listen()
            .name("显示模型");
        rayHitSceneFolder.add(obj, "isRayHitMesh")  //碰撞mesh
            .listen()
            .name("碰撞mesh");
        rayHitSceneFolder.add(obj, "isRayHitMakePoint")  //是否打点
            .listen()
            .name("是否打点");
        rayHitSceneFolder.add(obj, "rayHitLayer", -1, 31, 1)  //限制layer
            .listen()
            .name("限制layer");
        rayHitSceneFolder.add(obj, "rayHitTranName")  //hit节点名
            .listen()
            .name("hit节点名");
        rayHitSceneFolder.add(obj, "rayHitPosition")  //hit坐标
            .listen()
            .name("hit坐标");
        rayHitSceneFolder.add(obj, "rayHitTranLayer")  //hit节点Layer
            .listen()
            .name("hit节点Layer");
        rayHitSceneFolder.add(obj, "rayHitTranGlobalPath")  //全局路径
            .listen()
            .name("全局路径");
        //--------------------------------------------------------------

        //---------------------------------------------------------------
        // let folderCam = folderDebug.addFolder("相机");
        // // folderCam.open();
        // let camCtr = stageMgr.camCtr;
        // let cam = m4m.framework.sceneMgr.app.getScene().mainCamera;
        // folderCam.add(camCtr, "_pause"); //暂停开关
        // folderCam.add(obj, "syncCameraPos"); //相机设置位置
        // folderCam.add(cam, "opvalue", 0, 1); //正交 0  和 透视模式1
        // folderCam.add(cam, "fov", 0, Math.PI, 0.01);
        // folderCam.add(cam, "far");
        // folderCam.add(cam, "near");
        // folderCam.add(cam, "size", 1, 2048, 1);
        // folderCam.add(obj, "distance", 1, 1000, 1);        //相机跟随距离
        // folderCam.add(obj, "Yangle", 0, 360, 1);
        // folderCam.add(obj, "elevationAngle", 0, 360, 1);
        // folderCam.add(obj, "testView"); //俯视测试视角
        //------------------------------------------------------------------------------------------
        //
        let folderLogic = gui.addFolder("逻辑");//----------------------------------------
        folderLogic.add(GameMgr, "openWalletBol")  //拣选UI节点
            .listen()
            .name("钱包模式");
        let folderLogicUI = folderLogic.addFolder("UI逻辑");//----------------------------------------
        folderLogicUI.add(obj, "rockerResetState")  //摇杆页面状态释放
            .listen()
            .name("摇杆页面状态释放");
        folderLogicUI.add(obj, "rockerTouchEnable")  //摇杆页面触摸开启
            .listen()
            .name("摇杆页面触摸开启");
        let folderModelsHide = folderLogic.addFolder("场景可见性");//----------------------------------------
        folderModelsHide.add(obj, "sceneVisible")   //显示场景
            .name("显示场景");
        folderModelsHide.add(obj, "roleVisible")   //显示角色
            .name("显示角色");
        folderModelsHide.add(obj, "effectVisible")   //显示特效
            .name("显示特效");
        let folderBattle = folderLogic.addFolder("战斗");//----------------------------------------
        folderBattle.add(obj, "battleSpeed", 0, 3, 0.5)   //战斗播放速度
            .name("战斗播放速度");
        // let folderGuide = folderLogic.addFolder("引导");    //引导
        // folderGuide.add(obj, "guideType", obj["guideTypeKMap"])
        //     .name("引导类型");
        // folderGuide.add(obj, "guideTypeID")
        //     .listen()
        //     .name("引导类型ID");
        // folderGuide.add(obj, "addGuide")
        //     .name("添加引导");
        let folderPlayerCam = folderLogic.addFolder("palyer相机");
        folderPlayerCam.add(obj, "playerCamFOV", 5, 180)
            .name("相机FOV");
        folderPlayerCam.add(obj, "playerCamTilt", 0, 90)
            .name("相机跟随 斜角度");
        folderPlayerCam.add(obj, "playerCamPan", 0, 360)
            .name("相机跟随 环绕角度");
        folderPlayerCam.add(obj, "playerCamDistance", 0, 50)
            .name("相机跟随 距离");
        let folderCamAvoidObs = folderLogic.addFolder("相机避障");
        folderCamAvoidObs.add(SceneCamAvoidObsCtr, "active")
            .name("激活");
        folderCamAvoidObs.add(SceneCamAvoidObsCtr, "_enableCkObs")
            .name("开启检查障碍");
        folderCamAvoidObs.add(SceneCamAvoidObsCtr, "_moveSpeed", 0, 10)
            .listen()
            .name("相机移动速度");
        folderCamAvoidObs.add(SceneCamAvoidObsCtr, "minDistance", 0, 10)
            .listen()
            .name("最小距离");
        folderCamAvoidObs.add(SceneCamAvoidObsCtr, "baseDistance", 1, 50)
            .listen()
            .name("基础距离");
        folderCamAvoidObs.add(SceneCamAvoidObsCtr, "_currDistance", 0, 50)
            .listen()
            .name("当前距离");

        //游戏逻辑
        let folderGame = gui.addFolder("资源");//----------------------------------------
        let folderRole = folderGame.addFolder("角色");//----------------------------------------
        // folderRole.add(obj, "slotIDs") //插孔id 列表(使用 , 分割)
        //     .name("位置ID列表 `,`分割");
        // folderRole.add(obj, "roleIDs") //角色id 列表(使用 , 分割)
        //     .name("角色ID列表 `,`分割");
        // let folderRoleBattle = folderRole.addFolder("*战斗中*");//----------------------------------------
        // folderRoleBattle.open();
        // folderRoleBattle.add(obj, "showRole")  //加载角色
        //     .name("展示角色");
        // folderRoleBattle.add(obj, "clearRole")  //清理角色
        //     .name("清理角色");
        // folderRoleBattle.add(obj, "animStateName", obj.stateNameList)  //动画状态名
        //     .name("动画状态名");
        // folderRoleBattle.add(obj, "playAnim")  //播放动画
        //     .name("播放动画");
        // folderRoleBattle.add(obj, "testAnimEvent")  //动画事件测试
        //     .name("动画事件测试");
        // let folderOffset = folderRoleBattle.addFolder("全局偏移");//----------------------------------------
        // folderOffset.add(obj, "Offset_X") //偏移 X
        //     .name("偏移 X");
        // folderOffset.add(obj, "Offset_Y") //偏移 Y
        //     .name("偏移 Y");
        // folderOffset.add(obj, "Offset_Z") //偏移 Z
        //     .name("偏移 Z");
        // let folderRolePrepare = folderRole.addFolder("*预备中*");//----------------------------------------
        // folderRolePrepare.add(obj, "prepareAttach")  //附加到
        //     .name("附加角色");
        // folderRolePrepare.add(obj, "prepareRemove")  //删除
        //     .name("移除角色");
        // folderRolePrepare.add(obj, "prepareOver")  //浮空
        //     .name("浮空角色");
        // folderRolePrepare.add(obj, "prepareClear")  //清理全部
        //     .name("清理全部角色");
        // let folderRoleShowRoom = folderRole.addFolder("*陈列室中*");//----------------------------------------
        // folderRoleShowRoom.add(obj, "showRoomAttach")  //附加到
        //     .name("附加角色");
        // folderRoleShowRoom.add(obj, "showRoomClear")  //清理
        //     .name("清理角色");
        // folderRoleShowRoom.add(obj, "showRoomEuler", 0, 360)  //旋转 欧拉角
        //     .name("旋转");
        // let folderRshowRAdjustUI = folderRoleShowRoom.addFolder("*通过UI坐标调整*");
        // folderRshowRAdjustUI.add(obj, "aboveUiPosX")
        //     .name("UI坐标 X");
        // folderRshowRAdjustUI.add(obj, "aboveUiPosY")
        //     .name("UI坐标 Y");
        // folderRshowRAdjustUI.add(obj, "doAdjustUI")
        //     .name("调整UI坐标");
        // let folderRoleAboveUi = folderRole.addFolder("*UI上角色*");//----------------------------------------
        // folderRoleAboveUi.add(obj, "aboveUiPosX")  //UI 之上的 坐标X
        //     .name("坐标X");
        // folderRoleAboveUi.add(obj, "aboveUiPosY")  //UI 之上的 坐标Y
        //     .name("坐标Y");
        // folderRoleAboveUi.add(obj, "aboveScale", 0.0001, 10)  //UI 之上的 缩放
        //     .name("缩放");
        // folderRoleAboveUi.add(obj, "aboveUiAttach")  //附加到
        //     .name("附加角色");
        // folderRoleAboveUi.add(obj, "aboveUiClear")  //清理
        //     .name("清理角色");
        let folderUI = folderGame.addFolder("UI");//----------------------------------------
        folderUI.add(obj, "UIName")
            .name("UI名字");
        folderUI.add(obj, "showUI")
            .name("显示UI");
        folderUI.add(obj, "hideUI")
            .name("隐藏UI");
        let folderUIShader = folderUI.addFolder("shader效果");
        folderUIShader.add(obj, "onlyLabel")    //仅 开启 label
            .name("仅label");
        folderUIShader.add(obj, "forceNewMaterial")    //给UI 创建新的材质
            .name("创建新的材质");
        folderUIShader.add(obj, "UIShaderName", obj["uiShaderList"])
            .name("shader名字");
        folderUIShader.add(obj, "UIShaderChange")
            .name("切换shader");
        let folderOver3dUI = folderUI.addFolder("UI上3d");//UI上3d
        folderOver3dUI.add(obj, "Over3dUIAdd")  //UI上3d 添加 模型
            .name("添加");
        folderOver3dUI.add(obj, "Over3dUIRemove") //UI上 删除 之前的模型
            .name("清理全部");
        folderOver3dUI.add(obj, "aboveUiPosX") //UI上 坐标 x
            .name("UI坐标X");
        folderOver3dUI.add(obj, "aboveUiPosY") //UI上 坐标 y
            .name("UI坐标Y");
        let folderScene = folderGame.addFolder("场景");//----------------------------------------
        folderScene.add(obj, "sceneId") //场景id
            .name("场景ID");
        folderScene.add(obj, "showScene")  //加载场景
            .name("展示场景");
        folderScene.add(obj, "obstacleName") //障碍名
            .name("障碍Res名");
        folderScene.add(obj, "showObstacle")  //显示 场景障碍
            .name("展示障碍");
        let folderEffect = folderGame.addFolder("特效");//----------------------------------------
        folderEffect.add(obj, "effectName")    //特效名
            .name("特效资源名");
        folderEffect.add(obj, "EffPos_X")//特效位置x
            .step(0.1)
            .name("坐标 X");
        folderEffect.add(obj, "EffPos_Y")      //特效位置y
            .step(0.1)
            .name("坐标 Y");
        folderEffect.add(obj, "EffPos_Z")      //特效位置z
            .step(0.1)
            .name("坐标 Z");
        folderEffect.add(obj, "EffSecal")      //特效位置z
            .step(0.1)
            .name("缩放");
        folderEffect.add(obj, "EffEuler_X")      //特效位置z
            .step(0.1)
            .name("旋转 X");
        folderEffect.add(obj, "EffEuler_Y")      //特效位置z
            .step(0.1)
            .name("旋转 Y");
        folderEffect.add(obj, "EffEuler_Z")      //特效位置z
            .step(0.1)
            .name("旋转 Z");
        folderEffect.add(obj, "playEndRemove")      //特效位置z
            .name("是否播放完回调");
        folderEffect.add(obj, "isEffOverUI")      //显示在UI上
            .name("显示在UI上");
        let effOverUIFolder = this.effOverUIFolder = folderEffect.addFolder("UI位置");
        effOverUIFolder.add(obj, "EffUIPosX")
            .name("UI坐标 X");
        effOverUIFolder.add(obj, "EffUIPosY")
            .name("UI坐标 Y");
        folderEffect.add(obj, "showEffect")     //加载特效
            .name("展示特效");
        folderEffect.add(obj, "clearEffect")     //清理特效
            .name("清理特效");

        // let folderSceneShow = folderGame.addFolder("场景演出");//----------------------------------------
        // folderSceneShow.add(obj, "pubDoorShow")     //酒馆 抽卡开门
        //     .name("酒馆开门");
        // let folderSummonMeteor = folderSceneShow.addFolder("十连流星");
        // folderSummonMeteor.add(ScenePerformMgr, "_meteorAirFriction", 0, 1)
        //     .name("摩擦系数");
        // folderSummonMeteor.add(ScenePerformMgr, "_meteorExplodeYRate", 0, 1)
        //     .name("爆点Y率 位置");
        // folderSummonMeteor.add(ScenePerformMgr, "_meteorStartSpeed")
        //     .name("初始飞行速度");
        // folderSummonMeteor.add(ScenePerformMgr, "_meteorSpeed")
        //     .name("飞行速度");
        // folderSummonMeteor.add(ScenePerformMgr, "_meteorbackSp")
        //     .name("转向率");
        // folderSummonMeteor.add(ScenePerformMgr, "_meteorGap")
        //     .name("分布间隔");
        // folderSummonMeteor.add(obj, "summonMeteorShow")     //十连流星
        //     .name("播放");

        let folderAudio = folderGame.addFolder("音频");//----------------------------------------
        folderAudio.add(obj, "audioTypeID")
            .listen()
            .name("音频ID");
        folderAudio.add(obj, "audioVolume", 0, 1)
            .name("音量(volume)");
        folderAudio.add(obj, "audioPlay")
            .name("播放(play)");
        folderAudio.add(obj, "audioStop")
            .name("停止(stop)");
        folderAudio.add(obj, "audioPause")
            .name("暂停(pause)");

        //--------------------------------测试------------------------------
        let folderTest = gui.addFolder("测试");//----------------------------------------
        folderTest.add(obj, "testCutUIView")
            .name("筛选可见UI");
        // let folderPolygon = folderTest.addFolder("UI矢量多边形");
        // folderPolygon.add(obj, "aboveUiPosX")
        //     .name("UI坐标X");
        // folderPolygon.add(obj, "aboveUiPosY")
        //     .name("UI坐标Y");
        // folderPolygon.add(obj, "aboveScale")
        //     .name("UI缩放");
        // folderPolygon.add(obj, "uiPolygonPoint")
        //     .name("点坐标");
        // folderPolygon.add(obj, "addUIPolygonPoint")
        //     .name("添加点");
        // folderPolygon.add(obj, "clearUIPolygonPoint")
        //     .name("清理");

        //dom
        this.makeOpenClose();

        //openTitle event
        this.onTitleOpen("角色", () => {
            GameMgr.debugModeBattle = true; //强制开启调试
            console.warn(`debugModeBattle  战斗调试开启`);
        });

        // this.onTitleOpen("引导", () => {
        //     // GuideMgr.DebugPrint = true; //强制开启调试
        //     // GameMgr.debugGuide = true; //强制开启调试
        //     console.warn(`DebugPrint  引导调试debug 开启`);
        // });

    }

    public static viewResourceGUI() {
        // if (wxTool.wx || !dat) { return; }
        // let obj = setViewResContent.instance;

        // // let gui = this.getGUI();
        // let gui = this.viewResourceGUIObj = new dat.GUI();
        // gui.add(obj, "title");
        // gui.add(obj, "backGameGUI");
        // gui.add(obj, "resType", obj.PathList, "角色");
        // gui.add(obj, "resName");
        // gui.add(obj, "viewModel");
    }

    public static roleViewCtrObj;
    private static TitleOpenEventMap: { [titleName: string]: Function } = {};
    private static TitleCloseEventMap: { [titleName: string]: Function } = {};
    private static runGameDatGUIObj;
    private static _currGUI: any;
    private static runGameContent: SetContent;
}

class SetContent {

    private get EffSecal() { return this._effScale; }
    private set EffSecal(v) { this._effScale = v; this.refreashEffectScale(); }

    private get Offset_X() { return this._roleOffset.x; }
    private set Offset_X(v) { this._roleOffset.x = v; this.refreashRoleOffset(); }
    private get Offset_Y() { return this._roleOffset.y; }
    private set Offset_Y(v) { this._roleOffset.y = v; this.refreashRoleOffset(); }
    private get Offset_Z() { return this._roleOffset.z; }
    private set Offset_Z(v) { this._roleOffset.z = v; this.refreashRoleOffset(); }

    private get EffPos_X() { return this._effPos.x; }
    private set EffPos_X(v) { this._effPos.x = v; this.refreashEffectPos(); }
    private get EffPos_Y() { return this._effPos.y; }
    private set EffPos_Y(v) { this._effPos.y = v; this.refreashEffectPos(); }
    private get EffPos_Z() { return this._effPos.z; }
    private set EffPos_Z(v) { this._effPos.z = v; this.refreashEffectPos(); }

    private get EffEuler_X() { return this._effEuler.x; }
    private set EffEuler_X(v) { this._effEuler.x = v; this.refreashEffectEuler(); }
    private get EffEuler_Y() { return this._effEuler.y; }
    private set EffEuler_Y(v) { this._effEuler.y = v; this.refreashEffectEuler(); }
    private get EffEuler_Z() { return this._effEuler.z; }
    private set EffEuler_Z(v) { this._effEuler.z = v; this.refreashEffectEuler(); }

    private get battleSpeed() { return this._battleSpeed; }
    private set battleSpeed(v) {
        this._battleSpeed = v;
        TimeUtil.timeScale = v;
    }

    // private set showRoomEuler(v) { this._showRoomEuler = v; this.refreashShowRoompaltformEuler(); }
    // private get showRoomEuler() { return this._showRoomEuler; }
    private get testUI() {
        if (!this._testUI) {
            let imgTran = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.Image2D, m4m.framework.sceneMgr.app);
            imgTran.width = imgTran.height = 200;
            imgTran.pivot = new m4m.math.vector2(0.5, 0.5);
            let img = imgTran.getComponent("image2D") as m4m.framework.image2D;
            img.color = new m4m.math.color(1, 1, 1, 0.4);
            //text
            let textTran = new m4m.framework.transform2D();
            let opt = m4m.framework.layoutOption;
            textTran.layoutState = opt.H_CENTER | opt.V_CENTER;
            imgTran.addChild(textTran);
            textTran.width = textTran.height = 200;
            let textLab = textTran.addComponent("label") as m4m.framework.label;
            textLab["_fontName"] = "defFont.font.json";
            textLab.horizontalType = m4m.framework.HorizontalType.Center;
            textLab.horizontalOverflow = true;
            textLab.fontsize = 30;
            textLab.text = `测试 UI \n 锚点在中间`;

            UiManager.overlay.canvas.addChild(imgTran);
            //leaper add
            this._testUI = imgTran.addComponent("uiRenderLeaper") as uiRenderLeaper;
        }

        return this._testUI;
    }

    // public get guideTypeID() { return this._guideTypeID; }
    // public set guideTypeID(val) {
    //     if (isNaN(Number(val))) {
    //         this._guideTypeID = "";
    //         return;
    //     }
    //     this._guideTypeID = val;
    // }

    // public get guideType() { return this._guideType; }
    // public set guideType(val) {
    //     this._guideType = val;
    //     this.guideTypeID = val.toString();
    // }

    public get UICanvas() {
        if (!this._canvas) {
            let uiLay = this.OverLay2D;
            if (uiLay) {
                this._canvas = uiLay.canvas;
            }
        }

        return this._canvas;
    }

    public get OverLay2D() {
        if (!this._overLay2d) {
            let lays = m4m.framework.sceneMgr.scene.mainCamera.getOverLays();
            let uiLay: m4m.framework.overlay2D;
            for (let i = 0, len = lays.length; i < len; i++) {
                if (lays[i] instanceof (m4m.framework.overlay2D)) {
                    uiLay = lays[i] as m4m.framework.overlay2D;
                    break;
                }
            }

            this._overLay2d = uiLay;
        }

        return this._overLay2d;
    }
    public get playerCamFOV() {
        return this._playerCamFOV;
    }
    public set playerCamFOV(val: number) {
        this._playerCamFOV = val;
        let cam = m4m.framework.sceneMgr.scene.mainCamera;
        if (!cam) { return; }
        cam.fov = val * commTool.toRadian;
    }

    // public get enablePreparePick() { return this._enablePreparePick; }
    // public set enablePreparePick(val) {
    //     this._enablePreparePick = val;
    //     let ev = new EventBase(val);
    //     // EventMgr.dispatchEvent("prepare_pick_enable", ev);
    // }
    public stateNameList: string[] = ["show", "showidle", "dead", "dizzy", "hit1", "idle", "run", "skill1", "skill2", "skill3", "skill4", "jumpskill1", "jumpskill2"];

    // playerCamFOV
    public _playerCamFOV: number = 30;

    constructor() {
        // for (let key in CGID) {
        //     if (!isNaN(Number(key))) { continue; }
        //     this.guideTypeKMap[key] = Number(CGID[key]);
        // }
        FrameMgr.Add(this.update, this);
        LateUpdateMgr.Add(this.lateUpdate, this);
    }
    private static readonly helpV2 = new m4m.math.vector2();
    private static readonly helpV2v1 = new m4m.math.vector2();
    private static readonly helpV3 = new m4m.math.vector3();
    private static readonly helpV3v1 = new m4m.math.vector3();
    private static readonly helpQuat = new m4m.math.quaternion();
    private static readonly helpPickInfo = new m4m.framework.pickinfo();
    private title = "游戏运行调试";
    private isshowFps = false;
    private isshowLog = false;;
    private isshowDrawCall = false;
    private sceneId: number = 2001;
    private slotIDs: string = `1,2,3,4,5,6,7,8,9,10,11,12`;
    private roleIDs: string = `3021,3035,4322`;
    private lastShowSceneId: number;
    private _roleOffset = new m4m.math.vector3();
    private _isEffOverUI: boolean = false;
    private EffUIPosX: number = 500;
    private EffUIPosY: number = 300;
    private _effPos = new m4m.math.vector3(0, 0, 0);
    private _effEuler = new m4m.math.vector3(0, 0, 0);
    private effectName = "fx_pp";
    private _effScale: number = 1;
    private playEndRemove: boolean = false;
    private UIName: string = `Playgame`;
    private animStateName: string = "idle";
    private _effectContainer: ISpTransform;
    private lastEffId = -1;
    private lastUIName = "";
    private _showRoomEuler = 0;
    private _battleSpeed = 1;
    private _enablePreparePick = false;
    private _isShowUIByEvent = false;
    private _makeThouched = false;
    private aboveUiPosX = 640;
    private aboveUiPosY = 360;
    private aboveScale = 1;
    // tslint:disable-next-line: max-line-length
    private uiShaderList = ["shader/defuifont", "shader/defmaskuifont", "shader/defui", "shader/defmaskui", "grey_ui.shader.json", "grey_mask_ui.shader.json", "mul_color_flow_font.shader.json"];  //ui shader 列表
    private UIShaderName: string = "grey_ui.shader.json";
    private Over3dList: ISpTransform[] = [];
    private onlyLabel: boolean = false;
    private forceNewMaterial: boolean = false;
    private uiPolygonPoint: string = `[0,0,200,30,250,50,100,100,20,70]`;
    // private _guideType: CGID = CGID.CG1_FAKE_BATTLE;
    // private _guideTypeID: string = this._guideType.toString();
    // private guideTypeKMap: { [typeName: string]: CGID } = {};

    private _testUI: uiRenderLeaper;
    private _enableDebugDraw: boolean = false;
    private _enablePickUI: boolean = false;
    private _enableRayHitScene: boolean = false;
    private _canvas: m4m.framework.canvas;
    private _overLay2d: m4m.framework.overlay2D;
    private _pickUIContinuity: number[] = [];
    private _DrawLineInited: boolean = false;
    private _pickDrawLineInited: boolean = false;
    private _lineRoot: m4m.framework.transform2D;
    private _pickLineRoot: m4m.framework.transform2D;
    private _rayHitRoot: m4m.framework.gameObject;
    private _currPickedUI: m4m.framework.transform2D;
    private _currPickedModel: m4m.framework.transform;
    private pickUIName: string = "";
    private pickUIComponents: string = "";
    private pickUIPath: string = "";
    private pickUIPos: string = "";
    private pickUIPivot: string = "";
    private pickUILayout: string = "";
    private pickUILayoutPerc: string = "";
    private _audioTypeID: string = "1000";
    private _audioVolume: number = 1;
    private _playerCamTile: number = 0;
    private _playerCamPan: number = 0;
    private _playerCamDistance: number = 0;
    private obstacleName: string = "";
    private isRayHitMesh: boolean = true;
    private isRayHitMakePoint: boolean = true;
    private rayHitLayer: number = -1;
    private rayHitTranName: string = "";
    private rayHitTranLayer: string = "";
    private rayHitTranGlobalPath: string = "";
    private rayHitPosition: string = "";
    private _sceneVisible: boolean = true;
    private _roleVisible: boolean = true;
    private _effectVisible: boolean = true;
    private _rockerTouchEnable: boolean = true;

    public get audioTypeID() { return this._audioTypeID; }
    public set audioTypeID(val) {
        if (isNaN(Number(val))) { return; }
        this._audioTypeID = val;
    }

    public get audioVolume() { return this._audioVolume; }
    public set audioVolume(val) {
        AudioPlayer.setVolume(Number(this.audioTypeID), val);
        this._audioVolume = val;
    }

    // public get guideTypeID() { return this._guideTypeID; }
    // public set guideTypeID(val) {
    //     if (isNaN(Number(val))) {
    //         this._guideTypeID = "";
    //         return;
    //     }
    //     this._guideTypeID = val;
    // }

    // public get guideType() { return this._guideType; }
    // public set guideType(val) {
    //     this._guideType = val;
    //     this.guideTypeID = val.toString();
    // }

    public get isEffOverUI() {
        return this._isEffOverUI;
    }

    public set isEffOverUI(val: boolean) {
        this._isEffOverUI = val;
        val ? DatGUITool.effOverUIFolder.open() : DatGUITool.effOverUIFolder.close();
    }

    public get pickUIVisiable() {
        if (!this._currPickedUI) { return false; }
        return this._currPickedUI.visible;
    }
    public set pickUIVisiable(val: boolean) {
        if (!this._currPickedUI) { return; }
        this._currPickedUI.visible = val;
    }
    public get pickModelVisiable() {
        if (!this._currPickedModel) { return false; }
        return this._currPickedModel.gameObject.visible;
    }
    public set pickModelVisiable(val: boolean) {
        if (!this._currPickedModel) { return; }
        this._currPickedModel.gameObject.visible = val;
    }

    public get enableDebugDraw() { return this._enableDebugDraw; }
    public set enableDebugDraw(enable: boolean) {
        if (this._enableDebugDraw == enable) { return; }
        this._enableDebugDraw = enable;
        enable ? this.doEnableDrawLine() : this.doDisableDrawLine();
    }

    public get enablePickUI() { return this._enablePickUI; }
    public set enablePickUI(enable: boolean) {
        if (this._enablePickUI == enable) { return; }
        this._enablePickUI = enable;
        enable ? this.doEnablePickUI() : this.doDisablePickUI();
    }

    public get enableRayHitScene() { return this._enableRayHitScene; }
    public set enableRayHitScene(enable: boolean) {
        if (this._enableRayHitScene == enable) { return; }
        this._enableRayHitScene = enable;
        enable ? this.doEnableRayHit() : this.doDisableRayHit();
    }

    public update(dt: number) {
        if (this._DrawLineInited) {
            DebugLineTool2d.update();
            if (this._pickDrawLineInited) {
                let _t = this._currPickedUI;
                if (_t) {
                    let tWpos = _t.getWorldTranslate();
                    let tp = _t.pivot;
                    DebugLineTool2d.drawRect(tWpos.x - (tp.x * _t.width), tWpos.y - (tp.y * _t.height), _t.width, _t.height, 5, 1, 0.8);
                }
            }
        }
    }

    public lateUpdate(dt: number) {

    }

    public drawLineInit() {
        if (this._DrawLineInited) { return; }
        let lay2d = this.OverLay2D;
        let lineRoot = this._lineRoot = new m4m.framework.transform2D();
        lineRoot.name = "drawLineRoot";
        let opt = m4m.framework.layoutOption;
        lineRoot.layoutState = opt.BOTTOM | opt.LEFT | opt.RIGHT | opt.TOP;
        lay2d.canvas.addChild(lineRoot);
        DebugLineTool2d.init(lineRoot);
        this._DrawLineInited = true;
    }

    public pickUIDrawLineInit() {
        if (this._pickDrawLineInited) { return; }
        this.drawLineInit();
        let lay2d = this.OverLay2D;
        let opt = m4m.framework.layoutOption;
        let p = this._pickLineRoot = new m4m.framework.transform2D();
        p.layoutState = opt.BOTTOM | opt.LEFT | opt.RIGHT | opt.TOP;
        lay2d.canvas.addChild(p);
        commTool.makeUIEventDiscard(p);
        this._pickDrawLineInited = true;
    }

    public switchFPS() {
        if (this.isshowFps) {
            m4m.framework.sceneMgr.app.closeFps();
        } else {
            m4m.framework.sceneMgr.app.showFps();
        }

        this.isshowFps = !this.isshowFps;
    }


    public switchLOG() {
        if (this.isshowLog) {
            this.closeLOG();
        } else {
            this.showLOG();
        }
        this.isshowLog = !this.isshowLog;
    }

    public closeLOG() {
        this.world2D.transform.visible = false;
    }

    public TextUI: m4m.framework.label;
    public world2D: m4m.framework.transform2D;
    public showLOG() {
        if (!this.world2D) {
            this.world2D = new m4m.framework.transform2D();
            var g_this = this;
            this.TextUI = this.world2D.addComponent("label") as m4m.framework.label;
            this.world2D.transform.width = 1000;
            this.world2D.transform.height = 1000;
            this.TextUI.transform.width = 700;
            this.TextUI.transform.width = 700;
            this.TextUI.fontsize = 24;
            this.world2D.transform.localTranslate = new m4m.math.vector2(100, -300)
            console.error = function () {
                try {
                    let str = "";
                    for (let i = 0; i < arguments.length; i++) {
                        const item = arguments[i];
                        str += g_this.stringify(item) + ", ";
                    }
                    // console.error(str);
                    g_this.TextUI.text += "\n" + str;
                } catch (e) {
                    console.error("console.error()函数解析对象出现异常: ");
                }
            }
            console.error("href", window.location.href);
            console.error("search", window.location.search);
            console.error("hash", window.location.hash);
            metaUIManager.ActiveSelf.poplayer.addChild(this.world2D);
        } else {
            this.world2D.transform.visible = true;
        }
    }

    /**
     * 序列化对象, 注意, 序列化的结果不是json字符串
     * @param obj 对象
     * @param level 最大序列化层级, 默认1级
     * @param maxLen 限制字符串最大长度, 无限制则设置为-1
     */
    public stringify(obj: any, level: number = 3, maxLen: number = 5000, append: string = ""): string {
        if (obj === null) {
            return "null";
        }
        let type = typeof obj;
        if (type == "string") {
            return '"' + obj + '"';
        } else if (type == "undefined") {
            return "undefined";
        } else if (type == "bigint" || type == "boolean" || type == "number" || type == "symbol") {
            return obj;
        } else if (type == "function") {
            return "function() { [code] }";
        }
        if (level == 0) {
            return "[object: Object]";
        }
        let str = "";
        let isArr = Array.isArray(obj);
        if (isArr) {
            str += "[\n";
            for (let item of obj) {
                if (maxLen > -1 && str.length > maxLen) {
                    return str + "\n对象数据太大了.....";
                }
                str += append + "    " + this.stringify(item, level - 1, maxLen, append + "    ") + ",\n";
            }
            str += append + "]";
        } else {
            str += "{\n";
            for (let key in obj) {
                if (maxLen > -1 && str.length > maxLen) {
                    return str + "\n对象数据太大了.....";
                }
                let item = obj[key];
                str += append + '    "' + key + '": ' + this.stringify(item, level - 1, maxLen, append + "    ") + ",\n";
            }
            str += append + "}";
        }
        return str;
    }

    public switchDrawCall() {
        if (this.isshowDrawCall) {
            m4m.framework.sceneMgr.app.closeDrawCall();
        } else {
            m4m.framework.sceneMgr.app.showDrawCall();
        }

        this.isshowDrawCall = !this.isshowDrawCall;
    }
    public showScene() {
        //关闭 上一个场景
        let _sceneHideEvent = new SceneHideEvent();
        _sceneHideEvent.sceneID = this.lastShowSceneId;
        _sceneHideEvent.dispose = true;
        EventMgr.dispatchEvent("scene_hide", _sceneHideEvent);
        //显示目标场景
        let sceneShowEvent = new SceneShowEvent();
        sceneShowEvent.sceneID = this.sceneId;
        this.lastShowSceneId = this.sceneId;
        EventMgr.dispatchEvent("scene_show", sceneShowEvent);
    }
    public showObstacle() {
        SceneObstacleMgr.show(this.obstacleName);
    }
    public getSlotRoleIDS(): number[][] {
        let result: number[][] = [];
        //显示目标场景
        let _sIds = JSON.parse(`[${this.slotIDs}]`) as number[];
        let _trIds = JSON.parse(`[${this.roleIDs}]`) as number[];
        let _trIdLen = _trIds.length;
        if (_trIdLen < 1) {
            _trIds.push(1);
            _trIdLen = 1;
        }
        _sIds.forEach((v, i) => {
            let realRID = _trIds[i % _trIdLen];
            result.push([v, realRID]);
        });
        return result;
    }

    public showRole() {
        // //关闭 上一个
        this.clearRole();
        // //显示目标场景
        // let battleRoleInitEvent = new RoleBattleInitEvent();
        // let arr = this.getSlotRoleIDS();
        // arr.forEach((v) => {
        //     battleRoleInitEvent.battleRoleIDMap[v[0]] = v[1];
        // });

        // EventMgr.dispatchEvent("battle_role_init", battleRoleInitEvent);

        // //头像显示打卡
        // let ev = new EventBase();
        // ev.data = true;
        // EventMgr.dispatchEvent("battle_role_top_visibale", ev);
    }

    public clearRole() {
        // EventMgr.dispatchEvent("battle_role_clear", new EventBase());
    }

    public refreashRoleOffset() {
        StageMgr.roleRoot.localPosition = this._roleOffset;
    }
    public refreashEffectPos() {
        let p = this.getEffectContainer();
        p.localPosition = this._effPos;
    }
    public refreashEffectScale() {
        let p = this.getEffectContainer();
        m4m.math.vec3SetAll(p.localScale, this._effScale);
        p.localScale = p.localScale;
    }
    public refreashEffectEuler() {
        let q = SetContent.helpQuat;
        let e = this._effEuler;
        m4m.math.quatFromEulerAngles(e.x, e.y, e.z, q);
        let p = this.getEffectContainer();
        p.localRotate = q;
    }
    public getEffectContainer() {
        if (!this._effectContainer) {
            this._effectContainer = getSpTransform(new m4m.framework.transform());
            this._effectContainer.name = "_effectContainer";
            getSpTransform(m4m.framework.sceneMgr.scene.getRoot())
                .addChild(this._effectContainer);
        }
        return this._effectContainer;
    }
    public async showEffect() {
        //清理历史
        this.clearEffect();
        this.refreashEffectEuler();
        if (!this._isEffOverUI) {
            this.refreashEffectPos();
            this.refreashEffectScale();
            //
            let p = this.getEffectContainer();
            m4m.math.vec3SetAll(SetContent.helpV3, 0);
            this.lastEffId = await EffectMgr.setPlay(this.effectName as any, SetContent.helpV3, 1, null, p);
        } else {
            let uiPos = SetContent.helpV2;
            let v3Pos = SetContent.helpV3;
            let v3Euler = SetContent.helpV3v1;
            m4m.math.vec3Set(v3Euler, this.EffEuler_X, this.EffEuler_Y, this.EffEuler_Z);
            m4m.math.vec2Set(uiPos, this.EffUIPosX, this.EffUIPosY);
            Over3dModelMgr.get3dPos(uiPos, v3Pos);
            //UI 上显示特效
            this.lastEffId = await EffectMgr.setPlay(this.effectName as any, v3Pos, this.EffSecal, v3Euler);
            //设置layer ，跳转到第二个相机去渲染
            EffectMgr.effectLayerChange(this.lastEffId, GameLogic.layerIndexOverUI3d);
        }

        if (this.playEndRemove) {
            EffectMgr.onPlayEndRemove(this.lastEffId, () => { alert(`特效 ：${this.effectName} 播放完毕！`); });
        }
    }

    public clearEffect() {
        //清理改回 默认层级
        EffectMgr.effectLayerChange(this.lastEffId, GameLogic.layerIndexDefault);
        EffectMgr.setStop(this.lastEffId);
    }
    public showUI() {
        if (this.lastUIName == this.UIName) { return; }
        //清理历史
        this.hideUI();
        //
        if (!this._isShowUIByEvent) {
            UiManager.showUi(this.UIName);
        } else {
            let eventStr = `UI_${this.UIName}_Show`;
            EventMgr.dispatchEvent(eventStr as any, null);
        }
        this.lastUIName = this.UIName;
    }
    public hideUI() {
        if (!this.lastUIName) { return; }

        if (!this._isShowUIByEvent) {
            UiManager.hideUi(this.UIName);
        } else {
            let eventStr = `UI_${this.lastUIName}_Hide`;
            EventMgr.dispatchEvent(eventStr as any, null);
        }
        this.lastUIName = "";

    }
    // public prepareAttach() {
    //     this.SlotRoleEventAct("prepare_role_attach");
    // }
    // public prepareRemove() {
    //     this.SlotRoleEventAct("prepare_role_remove");
    // }
    // public prepareOver() {
    //     this.SlotRoleEventAct("prepare_role_over");
    // }
    // /**
    //  * 方便 派发slotRoleEvent
    //  * @param evStr 
    //  * @param maxLen 
    //  * @param data 
    //  */
    // public SlotRoleEventAct(evStr: string, maxLen = 6, data?) {
    //     let _ev = new SlotRoleEvent();
    //     if (data) {
    //         _ev.data = data;
    //     }
    //     let arr = this.getSlotRoleIDS();
    //     arr.length = arr.length > maxLen ? maxLen : arr.length;
    //     arr.forEach((v) => {
    //         _ev.slotId = v[0];
    //         _ev.roleId = v[1];
    //         EventMgr.dispatchEvent(evStr as any, _ev);
    //     });
    // }

    // public prepareClear() {
    //     EventMgr.dispatchEvent("prepare_role_clear", new EventBase());
    // }

    // public playAnim() {
    //     this.SlotRoleEventAct("battle_role_playAnim", 13, this.animStateName);
    // }

    // public showRoomAttach() {
    //     this.SlotRoleEventAct("showRoom_role_attach", 10);
    //     this.tryMakeThouchRotate();
    // }

    // /** 构建一个 角色旋转 全屏触控板 */
    // public tryMakeThouchRotate() {
    //     if (this._makeThouched) { return; }
    //     this._makeThouched = true;

    //     // let root = UiManager.overlay.canvas.getRoot();
    //     let root = this.UICanvas.getRoot();
    //     let touchPadTran = new m4m.framework.transform2D();
    //     touchPadTran.name = `test_fillTouchPadTran`;
    //     touchPadTran.width = 500; touchPadTran.height = 500;
    //     let lop = m4m.framework.layoutOption;
    //     touchPadTran.layoutState = lop.LEFT | lop.V_CENTER;
    //     let img = touchPadTran.addComponent("image2D") as m4m.framework.image2D;
    //     img.sprite = m4m.framework.sceneMgr.app.getAssetMgr()
    //         .getDefaultSprite("white_sprite");
    //     img.color = new m4m.math.color(1, 1, 1, 0.3);
    //     root.addChild(touchPadTran);
    //     let tPad = touchPadTran.addComponent("touchPad") as touchPad;
    //     //监听输出
    //     let starEuler = 165;
    //     this.showRoomEuler = starEuler;

    //     let rotSpeed = 3;
    //     tPad.onValueChange = (x, y) => {
    //         this.showRoomEuler = starEuler - x * rotSpeed;
    //     };
    // }

    // public showRoomClear() {
    //     EventMgr.dispatchEvent("showRoom_role_clear", new EventBase());
    // }

    // public refreashShowRoompaltformEuler() {
    //     this.SlotRoleEventAct("showRoom_role_euler", 1, this._showRoomEuler);
    // }

    public testAnimEvent() {
        RoleMgr["testAnimEvent"]();
    }

    public openVconsole() {
        if (window["eruda"]) {
            window["eruda"].init();
        }
    }

    public testCutUIView() {
        //new  一个R树
        let _rtree = new RTree(1000000);
        let _canvas = this.UICanvas;
        let _uiRoot = _canvas.getRoot();
        let _color = new m4m.math.color(0.5, 0.5, 0.5, 0.3);
        let _color1 = new m4m.math.color(1, 1, 1, 1);

        let transIdxArr: m4m.framework.transform2D[] = [];
        //遍历 所有UI
        //构建树 
        commTool.forEachTransform2DTree(_uiRoot, (t) => {
            if (t.renderer) {
                let _idx = transIdxArr.length;
                transIdxArr.push(t);
                (t.renderer as m4m.framework.image2D | m4m.framework.rawImage2D).color = _color;
                //插入 数据到 树
                let wpos = t.getWorldTranslate();
                let w = t.width;
                let h = t.height;
                let x = wpos.x - w * t.pivot.x;
                let y = wpos.y - h * t.pivot.y;
                _rtree.insert(new m4m.math.rect(x, y, w, h), _idx);
            }
        });

        let arr: number[] = [];
        let idx = _rtree.searchExtend(new m4m.math.rect(0, 0, _canvas.pixelWidth, _canvas.pixelHeight), arr);
        arr.forEach((i) => {
            let t = transIdxArr[i];
            if (t.renderer) {
                (t.renderer as m4m.framework.image2D | m4m.framework.rawImage2D).color = _color1;
            }
        });

        //属性
        _uiRoot.markDirty();
        _uiRoot.updateTran(true);
    }

    // public pubDoorShow() {
    //     let colorType = Math.floor(Math.random() * 3);
    //     let ev = new EventBase(colorType);
    //     EventMgr.dispatchEvent("perform_pubDoorShow_start", ev);
    // }
    // public summonMeteorShow() {
    //     let colorType = Math.floor(Math.random() * 3);
    //     let ev = new ArrayTypeEvent<number>(colorType);
    //     for (let i = 0; i < 10; i++) {
    //         ev.array[i] = Math.floor(Math.random() * 3);
    //     }
    //     EventMgr.dispatchEvent("perform_summonMeteorShow_start", ev);
    // }

    // public aboveUiAttach() {
    //     this.SlotRoleEventAct("aboveUI_role_attach", 1);
    //     //设置位置
    //     let ev = new EventGeneric<{ slotId: number; uiPos: m4m.math.vector2; roleScale?: number; roleRotate?: m4m.math.quaternion; }>();
    //     ev.data = {
    //         slotId: 1,
    //         uiPos: new m4m.math.vector2(this.aboveUiPosX, this.aboveUiPosY),
    //         roleScale: this.aboveScale,
    //     };
    //     EventMgr.dispatchEvent("aboveUI_role_transform", ev);

    //     //test ui
    //     let uiTran = this.testUI.transform;
    //     m4m.math.vec2Clone(ev.data.uiPos, uiTran.localTranslate);
    //     uiTran.markDirty();
    //     this.testUI.swLeapDisplay(true);
    // }

    // public aboveUiClear() {
    //     EventMgr.dispatchEvent("aboveUI_role_clear", new EventBase());
    // }

    public Over3dUIAdd() {
        let scene = m4m.framework.sceneMgr.scene;
        let root = scene.getRoot();
        let model = m4m.framework.TransformUtil.CreatePrimitive(m4m.framework.PrimitiveType.Cube, scene.app);
        let uiPos = SetContent.helpV2;
        m4m.math.vec2Set(uiPos, this.aboveUiPosX, this.aboveUiPosY);
        let spTran = getSpTransform(model);
        getSpTransform(root)
            .addChild(spTran);
        Over3dModelMgr.setModelToUI(spTran);
        let v3Pos = SetContent.helpV3;
        Over3dModelMgr.get3dPos(uiPos, v3Pos);
        spTran.setWorldPosition(v3Pos);

        //tranform 修改
        m4m.math.vec3SetAll(model.localScale, 1);
        let Rfun = Math.random;
        model.localEulerAngles = new m4m.math.vector3(Rfun() * 360, Rfun() * 360, Rfun() * 360);

        this.Over3dList.push(spTran);
    }

    public Over3dUIRemove() {
        this.Over3dList.forEach((v) => {
            Over3dModelMgr.recoveryModel(v);
            v.getParent()
                .removeChild(v);
        });
        this.Over3dList.length = 0;
    }

    // public doAdjustUI() {
    //     let ev = new EventGeneric<{ slotId: number; uiPos: m4m.math.vector2; }>();
    //     ev.data = {
    //         slotId: 1,
    //         uiPos: new m4m.math.vector2(this.aboveUiPosX, this.aboveUiPosY),
    //     };

    //     let uiTran = this.testUI.transform;
    //     this.testUI.swLeapDisplay(false);
    //     m4m.math.vec2Clone(ev.data.uiPos, uiTran.localTranslate);
    //     uiTran.markDirty();

    //     EventMgr.dispatchEvent("showRoom_scene_adjustUI", ev);
    // }

    public UIShaderChange() {
        let _canvas = this.UICanvas;
        let _uiRoot = _canvas.getRoot();
        //遍历 所有UI
        //构建树 
        // let realSName = `${this.UIShaderName}.shader.json`;
        let realSName = `${this.UIShaderName}`;
        let assetMgr = m4m.framework.sceneMgr.app.getAssetMgr();
        commTool.forEachTransform2DTree(_uiRoot, (t) => {
            // let a: m4m.framework.image2D;
            let r: any = t.renderer;
            if (r && !this.onlyLabel || r instanceof (m4m.framework.label)) {
                commTool.setUIShader(realSName, r, this.forceNewMaterial);
            }
        });
    }

    public addUIPolygonPoint() {
        let point: number[];
        try {
            point = JSON.parse(this.uiPolygonPoint);
        } catch (err) {
            alert(`点 数据格式不正确 , 需要一个长度为2 的倍数的json数组。`);
            return;
        }
        //过滤 输入的数据
        let count = Math.floor(point.length / 2);
        point.length = count * 2;
        //调整 testUI 的位置
        let ui = this.testUI;
        m4m.math.vec2Set(ui.transform.localTranslate, this.aboveUiPosX, this.aboveUiPosY);
        m4m.math.vec2Set(ui.transform.localScale, this.aboveScale, this.aboveScale);
        ui.transform.markDirty();
        //获取 uiPolygon
        let uiPol = ui.transform.getFirstComponentInChildren("uiPolygon") as uiPolygon;
        if (!uiPol) {   //添加一个 uiPolygon 组件
            let opt = m4m.framework.layoutOption;
            let uiPolTrans = new m4m.framework.transform2D();
            ui.transform.addChild(uiPolTrans);
            uiPolTrans.layoutState = opt.LEFT | opt.RIGHT | opt.TOP | opt.BOTTOM;
            uiPol = uiPolTrans.transform.addComponent("uiPolygon") as uiPolygon;
        }
        //uiPolygon 改颜色
        uiPol.color = new m4m.math.color(0, 1, 0.5, 0.5);
        let v2 = SetContent.helpV2;
        for (let i = 0; i < count; i++) {
            let m = (i * 2);
            m4m.math.vec2Set(v2, point[m + 0], point[m + 1]);
            //添加点 数据（少于3 个点不渲染）
            uiPol.addPoint(v2);
        }
    }

    public clearUIPolygonPoint() {
        let ui = this.testUI;
        let tran = ui.transform;
        let uiPol = tran.getFirstComponentInChildren("uiPolygon") as uiPolygon;
        if (!uiPol) { return; }
        //清理 所有点
        uiPol.clearPoint();
    }

    // public addGuide() {
    //     let ev = new EventGeneric<number>(Number(this.guideTypeID));
    //     EventMgr.dispatchEvent("guide_run", ev);
    // }

    public doEnableDrawLine() {
        this.drawLineInit();
        this._lineRoot.visible = true;
        GameMgr.Draw2dDebug = true;
    }

    public doDisableDrawLine() {
        if (this._lineRoot) {
            this._lineRoot.visible = false;
        }
        GameMgr.Draw2dDebug = false;
    }

    //开启 拣选 UI
    public doEnablePickUI() {
        this.pickUIDrawLineInit();
        this._pickLineRoot.visible = true;
        DatGUITool.uiPickFolder.open();
        //监听点击
        let ipt = m4m.framework.sceneMgr.app.getInputMgr();
        ipt.addPointListener(m4m.event.PointEventEnum.PointDown, this.onPickUIclick, this);

    }

    //关闭 拣选UI
    public doDisablePickUI() {
        if (this._pickLineRoot) {
            this._pickLineRoot.visible = false;
        }
        DatGUITool.uiPickFolder.close();
        let ipt = m4m.framework.sceneMgr.app.getInputMgr();
        ipt.removePointListener(m4m.event.PointEventEnum.PointDown, this.onPickUIclick, this);

    }

    //开启 RayHit
    public doEnableRayHit() {
        if (!this._rayHitRoot) {
            this._rayHitRoot = (new m4m.framework.transform()).gameObject;
            this._rayHitRoot.transform.name = "_rayHitRoot";
            //不接受射线
            this._rayHitRoot.layer = m4m.framework.cullingmaskutil.maskTolayer(m4m.framework.CullingMask.IgnoreRaycast);
            let scene = m4m.framework.sceneMgr.scene;
            scene.addChild(this._rayHitRoot.transform);
        }

        this._rayHitRoot.visible = true;
        DatGUITool.rayHitSceneFolder.open();
        //监听点击
        let ipt = m4m.framework.sceneMgr.app.getInputMgr();
        ipt.addPointListener(m4m.event.PointEventEnum.PointDown, this.onRayHit, this);

    }

    //关闭 RayHit
    public doDisableRayHit() {
        this._rayHitRoot.visible = false;
        DatGUITool.rayHitSceneFolder.close();
        let ipt = m4m.framework.sceneMgr.app.getInputMgr();
        ipt.removePointListener(m4m.event.PointEventEnum.PointDown, this.onRayHit, this);

    }

    //射线碰撞场景
    public onRayHit([x, y]) {
        console.error(`onRayHit : ${x} , ${y} `);
        //场景 中发射 射线
        let s = m4m.framework.sceneMgr.scene;
        let mainCam = s.mainCamera;
        let sPos = SetContent.helpV2;
        m4m.math.vec2Set(sPos, x, y);
        let ray = mainCam.creatRayByScreen(sPos, s.app);
        let pickInfo = SetContent.helpPickInfo;
        let lMask = m4m.framework.CullingMask.everything;
        if (!isNaN(this.rayHitLayer) && this.rayHitLayer != -1) {
            let rl = this.rayHitLayer;
            rl = rl < 0 ? 0 : rl > 31 ? 31 : rl;
            lMask = m4m.framework.cullingmaskutil.layerToMask(rl);
        }
        lMask = lMask ^ m4m.framework.CullingMask.IgnoreRaycast;
        let ishited = s.pick(ray, pickInfo, this.isRayHitMesh, s.getRoot(), lMask);
        this.rayHitTranName = "";
        this.rayHitTranLayer = "";
        this.rayHitTranGlobalPath = "";
        this.rayHitPosition = "";
        this._currPickedModel = null;
        if (ishited) {
            this._currPickedModel = pickInfo.pickedtran;
            this.rayHitTranName = pickInfo.pickedtran.name;
            this.rayHitTranLayer = `${pickInfo.pickedtran.gameObject.layer}`;
            this.rayHitTranGlobalPath = `${commTool.get3DPathStr(pickInfo.pickedtran)}`;
            let hitPos = SetContent.helpV3;
            m4m.math.vec3Clone(pickInfo.hitposition, hitPos);
            m4m.math.vec3Set(hitPos, Math.abs(hitPos.x) < 0.001 ? 0 : hitPos.x, Math.abs(hitPos.y) < 0.001 ? 0 : hitPos.y, Math.abs(hitPos.z) < 0.001 ? 0 : hitPos.z);
            this.rayHitPosition = `${hitPos.x.toFixed(2)},${hitPos.y.toFixed(2)},${hitPos.z.toFixed(2)}`;

            if (this.isRayHitMakePoint) {
                let sphere = m4m.framework.TransformUtil.CreatePrimitive(m4m.framework.PrimitiveType.Sphere, s.app);
                sphere.gameObject.layer = this._rayHitRoot.layer;
                let sNum = 0.1;
                sphere.localScale = new m4m.math.vector3(sNum, sNum, sNum);
                this._rayHitRoot.transform.addChild(sphere);
                sphere.localPosition = pickInfo.hitposition;
            }
        }
    }

    public onPickUIclick([x, y]) {
        this.pickUIName = "";
        this.pickUIPath = "";
        this.pickUIComponents = "";
        this._currPickedUI = null;

        let lay2d = this.OverLay2D;
        //转换成 UI 坐标
        let sPos = SetContent.helpV2;
        m4m.math.vec2Set(sPos, x, y);
        let mPos = SetContent.helpV2v1;
        lay2d.calScreenPosToModelPos(sPos, mPos);
        // commTool.screenPosToUIpos();

        //遍历 所有
        let canvas = this.UICanvas;
        let uiRoot = canvas.getRoot();
        let target: m4m.framework.transform2D;
        let firstTrans: m4m.framework.transform2D;
        let contnuIdx = 0;
        commTool.forEachTransform2DTree(uiRoot, (val) => {
            if (val.visible && val != this._pickLineRoot) {
                //匹配点击区域
                let b = val.ContainsCanvasPoint(mPos);
                if (b) {
                    console.log(val.name);
                    let lastID = this._pickUIContinuity[contnuIdx];
                    let currID = val.insId.getInsID();
                    if (lastID == null || lastID != currID) {
                        this._pickUIContinuity[contnuIdx] = currID;
                        this._pickUIContinuity.length = contnuIdx + 1;
                        target = val;
                        return true;    //中断 遍历
                    }

                    contnuIdx++;

                    if (!firstTrans) {
                        firstTrans = val;
                    }
                }
            }
        });

        if (!firstTrans) {
            console.warn(` 没有获取到任何一个 ui 节点`);
            return;
        }

        if (!target) {
            //切换一个轮回了
            target = firstTrans;
            this._pickUIContinuity.length = 1;
        }
        this.pickUIVisiable = target.visible;
        this.pickUIName = target.name;
        this.pickUIPos = JSON.stringify(target.getWorldTranslate());
        this.pickUIPivot = JSON.stringify(target.pivot);
        this.pickUILayout = this.getUIlayoutStr(target.layoutState);
        this.pickUILayoutPerc = this.getUIlayoutStr(target.layoutPercentState);
        // this.pickUIPath = JSON.stringify(this.getUIPath(target));

        this.pickUIPath = commTool.getUIPathStr(target);
        let compNames = target.components.map((val) => { return val.comp["constructor"].name; }); //获取组件 类名
        this.pickUIComponents = JSON.stringify(compNames);

        this._currPickedUI = target;
    }

    public getUIlayoutStr(layout: number) {
        let str = "";
        let lo = m4m.framework.layoutOption;
        let arr = [lo.BOTTOM, lo.H_CENTER, lo.LEFT, lo.RIGHT, lo.TOP, lo.V_CENTER];
        arr.forEach((val) => {
            if (val & layout) {
                str += `${m4m.framework.layoutOption[val]};`;
            }
        });
        return str;
    }

    public audioPlay() {
        AudioPlayer.play(Number(this.audioTypeID));
    }
    public audioStop() {
        AudioPlayer.stop(Number(this.audioTypeID));
    }
    public audioPause() {
        AudioPlayer.pause(Number(this.audioTypeID));
    }

    public get playerCamTilt() {
        return this._playerCamTile;
    }
    public set playerCamTilt(val: number) {
        let camCtr = StageMgr.camCtr;
        this._playerCamTile = val;
        camCtr.tiltAngle = val;
    }

    public get playerCamPan() {
        return this._playerCamPan;
    }
    public set playerCamPan(val: number) {
        let camCtr = StageMgr.camCtr;
        this._playerCamPan = val;
        camCtr.panAngle = val;
    }

    public get playerCamDistance() {
        return this._playerCamDistance;
    }
    public set playerCamDistance(val: number) {
        let camCtr = StageMgr.camCtr;
        this._playerCamDistance = val;
        camCtr.distance = val;
    }

    public get sceneVisible() { return this._sceneVisible; }
    public set sceneVisible(val) {
        this._sceneVisible = val;
        StageMgr.sceneRoot.gameObject.visible = val;
    }

    public get roleVisible() { return this._roleVisible; }
    public set roleVisible(val) {
        this._roleVisible = val;
        StageMgr.roleRoot.gameObject.visible = val;
    }

    public get effectVisible() { return this._effectVisible; }
    public set effectVisible(val) {
        this._effectVisible = val;
        StageMgr.effectRoot.gameObject.visible = val;
    }

    public rockerResetState() {
        EventMgr.dispatchEvent("rocker_View_FocusResetState", null);
    }

    public get rockerTouchEnable() { return this._rockerTouchEnable; }
    public set rockerTouchEnable(val: boolean) {
        this._rockerTouchEnable = val;
        EventMgr.dispatchEvent("rocker_View_TouchEnable", new EventGeneric<boolean>(this._rockerTouchEnable));

    }
}
