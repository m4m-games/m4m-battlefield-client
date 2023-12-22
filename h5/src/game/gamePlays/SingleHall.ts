import { EventGeneric, EventMgr } from "eventMgr";
import { SceneVisualEvent } from "events/sceneVisualEvent";
import { UiDataManager } from "PSDUI/UiDataManager";
import { ISpTransform } from "Tools/engineParallel/spInterface";
import { FrameMgr } from "Tools/FrameMgr";
import { StageMgr } from "../Core/StageMgr";
import { BindKeyName } from "../Data/BindKeyName";
import { GamePlayType, GameType, InGameStatus, RoleActInput } from "../GameEnum";
import { UIOpenOrHideManager } from "../Manager/UIOpenOrHideManager";
import { RoleAttrInfo, RoleTypeEnum } from "../Role/RoleAttrInfo";
import { RoleMgr } from "../Role/RoleMgr";
import { SceneHomeMap } from "../Scene/SceneHomeMap";
import { SceneidEnum, SceneLoadManager } from "../Scene/SceneLoadManager";
import { SceneMgr } from "../Scene/SceneMgr";
import { IGamePlay } from "./IGamePlay";
import { PlayGameType } from "./PlayGameType";

export class SingleHall implements IGamePlay {
    private _evRoleSetPos: EventGeneric<{ GUID: string, pos: m4m.math.vector3 }> = new EventGeneric({ GUID: "", pos: new m4m.math.vector3() });
    private _evRoleSetRot: EventGeneric<{ GUID: string, yAngle: number }> = new EventGeneric({ GUID: "", yAngle: 0 });
    private mainRoleInit: boolean = false;
    private sceneInit: boolean = false;
    private npcLocalPosition: m4m.math.vector3;
    private canTestBol: boolean = false;
    private testGUID: string = "N:0001";
    private buyTicketSuccessToGameFunBind: any;
    private sceneModel: ISpTransform;

    private roleMakeSuccessFunBind: any;
    private roleInit: boolean = true;
    public startArea(): m4m.math.vector3[] {
        return null;
    }
    public endArea(): m4m.math.vector3[] {
        return null;
    }
    public getGameType(): GamePlayType {
        return GamePlayType.singleHall;
    }
    public runGame() {
        this.mainRoleInit = false;
        this.sceneInit = false;
        this.canTestBol = false;
        //每次移动一步的距离
        RoleMgr.moveDistance = 1;
        // throw new Error("Method not implemented.");
        console.error("进入单人大厅场景");
        EventMgr.addListener("scene_visual_change", this.sceneChangeFun, this);
        //因大厅房间和单人大厅是同一场景
        // EventMgr.addListener("role_makeSuccess", this.onMakeEnd, this);
        this.roleMakeSuccessFunBind = this.roleMakeSuccessFun.bind(this);
        //角色创建完毕
        UiDataManager.bindFunctionData(BindKeyName.roleMakeSuccess, this.roleMakeSuccessFunBind);
        //侦听购票成功 进入对应游戏
        UiDataManager.bindFunctionData(BindKeyName.buyTicketSuccessToGame, this.buyTicketSuccessToGameFunBind);

        this.initSingleHall();
        this.npcLocalPosition = new m4m.math.vector3(0, 0, -17);
        FrameMgr.Add(this.UpDateFun, this);

        // this._ev.data = false;
        // EventMgr.dispatchEvent("rocker_View_TouchEnable", this._ev);
        EventMgr.dispatchEvent("rocker_View_FocusResetState", null);
    }
    // tslint:disable-next-line: member-ordering
    public roleMakeSuccessFun(data) {
        // console.error(data, "  ++++++++++   ", StageMgr.PlayerGUID);
        if (data == StageMgr.PlayerGUID) {
            // EventMgr.removeListener("role_makeSuccess", this.onMakeEnd, this);

            // this._evRoleSetPos.data.GUID = StageMgr.PlayerGUID;
            // m4m.math.vec3Set(this._evRoleSetPos.data.pos, 0, 0, -10);
            // EventMgr.dispatchEvent("role_setPos", this._evRoleSetPos);
            // setTimeout(() => {

            //     this._evRoleSetRot.data.GUID = StageMgr.PlayerGUID;
            //     this._evRoleSetRot.data.yAngle = 90;
            //     EventMgr.dispatchEvent("role_setYRotate", this._evRoleSetRot);

            // }, 10000);
            let role = RoleMgr.getRoleByGUID(StageMgr.PlayerGUID);
            role.roleData.inGameState = InGameStatus.outGame;
            role.roleCtr.handleInput(RoleActInput.Revive);
            if (!this.roleInit) {
                role.roleDoll.setNum("00");
            }
            this.roleInit = false;
            this.mainRoleInit = true;
            this.loadReadyFun();
            this.canTestBol = true;
        }
        if (data == this.testGUID) {
            let npc = RoleMgr.getRoleByGUID(this.testGUID);
            //播放持枪动画
            npc.roleDoll.playAnim("IdleTakeTheGun");
            // npc.roleDoll.playAnim("Pistol");
            //暂时这么处理脸
            let model = npc.roleDoll.model;
            // console.error("model: ", model);

            model.find("Npc_lian01").gameObject.visible = false;
            model.find("NPC_lian02").gameObject.visible = false;
            model.find("shouqiang").gameObject.visible = false;
            model.find("wp_chongfengqiang").gameObject.visible = true;
        }
    }
    // //角色创建完毕
    // public onMakeEnd(ev: EventGeneric<string>) {
    //     console.error(ev.data, "  ++++++++++   ", StageMgr.PlayerGUID);
    //     if (ev.data == StageMgr.PlayerGUID) {
    //         // EventMgr.removeListener("role_makeSuccess", this.onMakeEnd, this);

    //         // this._evRoleSetPos.data.GUID = StageMgr.PlayerGUID;
    //         // m4m.math.vec3Set(this._evRoleSetPos.data.pos, 0, 0, -10);
    //         // EventMgr.dispatchEvent("role_setPos", this._evRoleSetPos);
    //         // setTimeout(() => {

    //         //     this._evRoleSetRot.data.GUID = StageMgr.PlayerGUID;
    //         //     this._evRoleSetRot.data.yAngle = 90;
    //         //     EventMgr.dispatchEvent("role_setYRotate", this._evRoleSetRot);

    //         // }, 10000);

    //         this.mainRoleInit = true;
    //         this.loadReadyFun();
    //         this.canTestBol = true;
    //     }
    //     if (ev.data == this.testGUID) {
    //         let npc = RoleMgr.getRoleByGUID(this.testGUID);
    //         //播放持枪动画
    //         npc.roleDoll.playAnim("idle1");
    //         //暂时这么处理脸
    //         let model = npc.roleDoll.model;
    //         console.error("model: ", model);

    //         model.find("Npc_lian01").gameObject.visible = false;
    //         model.find("NPC_lian02").gameObject.visible = false;
    //     }
    // }
    public exitGame() {
        //退出当前场景 禁止移动
        RoleMgr.canMove(false);
        //让 摇杆 复位
        UiDataManager.changeFunctionData(BindKeyName.joyReset, null);
        //角色创建完毕
        UiDataManager.unBindFunctionData(BindKeyName.roleMakeSuccess, this.roleMakeSuccessFunBind);
        //隐藏大厅UI界面
        // UIOpenOrHideManager.Instance.HideHallView();
        // EventMgr.removeListener("role_makeSuccess", this.onMakeEnd, this);
        console.error("退出单人大厅场景");
        FrameMgr.Remove(this.UpDateFun, this);
    }

    //场景加载完毕
    private sceneChangeFun(ev: SceneVisualEvent) {
        if (ev.sceneID == SceneidEnum.Hall && ev.isShow) {
            EventMgr.removeListener("scene_visual_change", this.sceneChangeFun, this);
            console.error(`场景加载完毕 isShow : ${ev.isShow} , sceneID : ${ev.sceneID} , sceneType : ${ev.sceneType}`);
            this.sceneInit = true;
            //金币数量控制
            let scene = SceneMgr.getSceneByID(ev.sceneID) as SceneHomeMap;
            this.sceneModel = scene.model;
            this.setJinbuduiState(JinbuduiState.man);
            this.loadReadyFun();
        }
    }
    private loadReadyFun() {
        console.error("单人大厅场景111");
        //场景以及主角加载完成
        if (this.mainRoleInit && this.sceneInit) {
            console.error("单人大厅场景222");
            // //设置玩家相机
            // StageMgr.camCtr.distance = 10;
            // StageMgr.camCtr.tiltAngle = 7;
            // StageMgr.camCtr.panAngle = 0;
            // StageMgr.mainCam.fov = commTool.toRadian * 32;

            //设置相机看向目标参数
            SceneLoadManager.Instance.upDateCameraViewInfo();
            //是否需要新手引导
            if (StageMgr.needGuildBol) {
                //后续增加新手引导流程 q区分 pc 和移动端
                // if (PlatformUtil.getTypeByBrowser() == PlatformType.PC) {
                //     UIOpenOrHideManager.Instance.OpenTutorialpcView();
                // } else {
                //     UIOpenOrHideManager.Instance.OpenTutorialmbView();
                // }
                StageMgr.needGuildBol = false;
            } else {
                // //打开大厅UI界面
                // UIOpenOrHideManager.Instance.OpenHallView();
            }

        }
    }

    // public static test() {
    //     //角色
    //     let roleInfo = new RoleAttrInfo();
    //     roleInfo.roleType = RoleTypeEnum.Player;
    //     roleInfo.GUID = StageMgr.PlayerGUID;
    //     roleInfo.pos = new m4m.math.vector3(0, 0, -15);
    //     roleInfo.angle = 40;
    //     EventMgr.dispatchEvent("role_make", new EventGeneric<{ roleInfo: RoleAttrInfo }>({ roleInfo }));
    // }
    //单人游戏大厅
    private initSingleHall() {
        let sceneID = SceneidEnum.Hall;
        // //单人大厅
        // let ev = new SceneShowEvent();
        // ev.sceneID = sceneID;
        // EventMgr.dispatchEvent("scene_show", ev);

        //单人大厅
        SceneLoadManager.Instance.loadScene(sceneID);
        SceneLoadManager.Instance.getSceneConfig()
            .then((config) => {
                //角色
                let roleInfo = new RoleAttrInfo();
                roleInfo.roleType = RoleTypeEnum.Player;
                roleInfo.GUID = StageMgr.PlayerGUID;
                roleInfo.pos = new m4m.math.vector3(0, 0, -10);
                roleInfo.angle = config.roleAngle;//正面看向玩家
                roleInfo.isSingle = true;
                roleInfo.isInit = true;
                EventMgr.dispatchEvent("role_make", new EventGeneric<{ roleInfo: RoleAttrInfo }>({ roleInfo }));

                // //测试添加一个npc
                // roleInfo = new RoleAttrInfo();
                // roleInfo.roleType = RoleTypeEnum.NPC;
                // roleInfo.GUID = this.testGUID;
                // roleInfo.pos = new m4m.math.vector3(0, 0, -17);
                // EventMgr.dispatchEvent("role_make", new EventGeneric<{ roleInfo: RoleAttrInfo }>({ roleInfo }));
            });
        //model.find("NPC_lian03").gameObject.visible = false;

        // //移动到一个位置
        // this._evRoleSetPos.data.GUID = testGUID;
        // m4m.math.vec3Set(this._evRoleSetPos.data.pos, 0, 0, -18);
        // EventMgr.dispatchEvent("role_setPos", this._evRoleSetPos);
    }
    private UpDateFun() {
        let role = RoleMgr.getRoleByGUID(StageMgr.PlayerGUID);
        if (role && role.roleDoll) {
            let rolePos = RoleMgr.getRoleByGUID(StageMgr.PlayerGUID).roleDoll.model.localPosition;
            let currDist = m4m.math.vec3Distance(rolePos, this.npcLocalPosition);
            if (this.canTestBol) {
                // console.error("玩家位置：", rolePos, "  currDist:", currDist);
                if (currDist <= 2) {
                    this.canTestBol = false;
                    // UIOpenOrHideManager.Instance.OpenstageselectView();
                    // StageMgr.levelType = GameType.greatChampionship;
                    // WebsocketTool.Instance.TicketManager_getTicketWithOutWallet(1, PlayGameType.GreatChampionship);
                    // WebsocketTool.Instance.TicketManager_useTickToGameRoom(PlayGameType.GreatChampionship);
                    //UIOpenOrHideManager.Instance.OpenJoingameView();
                    // //首次需要先签名
                    // if (StageMgr.isFirstAutograph) {
                    //     StageMgr.ethSignTypedData();
                    //     StageMgr.isFirstAutograph = false;
                    // } else {
                    //     UIOpenOrHideManager.Instance.OpenJoingameView();
                    // }
                }
            }
            if (currDist >= 3) {
                this.canTestBol = true;
            }
        }
    }

    //设置金猪存钱罐状态
    private setJinbuduiState(state: JinbuduiState) {
        if (!this.sceneModel) {
            return;
        }
        switch (state) {
            case JinbuduiState.shao:
                this.sceneModel.find(JinbuduiState.shao).gameObject.visible = true;
                this.sceneModel.find(JinbuduiState.banman).gameObject.visible = false;
                this.sceneModel.find(JinbuduiState.man).gameObject.visible = false;
                break;
            case JinbuduiState.banman:
                this.sceneModel.find(JinbuduiState.shao).gameObject.visible = false;
                this.sceneModel.find(JinbuduiState.banman).gameObject.visible = true;
                this.sceneModel.find(JinbuduiState.man).gameObject.visible = false;
                break;
            case JinbuduiState.man:
                this.sceneModel.find(JinbuduiState.shao).gameObject.visible = false;
                this.sceneModel.find(JinbuduiState.banman).gameObject.visible = false;
                this.sceneModel.find(JinbuduiState.man).gameObject.visible = true;
                break;
            default:
        }
    }
}

//金猪存钱罐状态
export enum JinbuduiState {
    shao = "jinbudui_shao",
    banman = "jinbudui_banman",
    man = "jinbudui_man",
}