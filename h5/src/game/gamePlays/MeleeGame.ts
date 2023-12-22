import { EventGeneric, EventMgr } from "eventMgr";
import { SceneVisualEvent } from "events/sceneVisualEvent";
import { FunctionBinder, UiDataManager } from "PSDUI/UiDataManager";
import { ResultBase } from "ResultBase";
import { FrameMgr } from "Tools/FrameMgr";
import { AudioEnum } from "../Audio/AudioEnum";
import { AudioPlayer } from "../Audio/AudioPlayer";
import { StageMgr } from "../Core/StageMgr";
import { BindKeyName } from "../Data/BindKeyName";
import { GamePlayType, GameState, InGameStatus, RoleActInput, Weapons } from "../GameEnum";
import { ScoreboardManager } from "../Manager/ScoreboardManager";
import { MeleeGameManager } from "../Manager/MeleeGameManager";
import { TimeLineManager } from "../Manager/TimeLineManager";
import { UIOpenOrHideManager } from "../Manager/UIOpenOrHideManager";
import { WebsocketTool } from "../Net/WebsocketTool";
import { WsDataManager } from "../Net/WsDataManager";
import { GameDiePerformanceEnum, RoleAttrInfo, RoleTypeEnum } from "../Role/RoleAttrInfo";
import { RoleMgr } from "../Role/RoleMgr";
import { SceneidEnum, SceneLoadManager } from "../Scene/SceneLoadManager";
import { IGamePlay } from "./IGamePlay";
import { DarkFightConfigBase } from "DarkFightConfigBase";
import { GamingManager } from "../Manager/GamingManager";
import { ShowAttackManager } from "../Manager/ShowAttackManager";

/** 黑夜大混战玩家状态 */
export enum MeleeGamePlayerState {
    normal, // 正常
    dead, // 死亡
}
/**
 * 黑夜大混战
 */
export class MeleeGame implements IGamePlay {

    private sceneID: SceneidEnum;
    private sceneInit: boolean = false;
    private mainRoleInit: boolean = false;
    //服务器配置
    private serverConfig: DarkFightConfigBase;
    //是否已经结算
    private isResulted: boolean;
    //游戏状态
    private gameState: GameState;
    //玩家状态
    private playerState: MeleeGamePlayerState = MeleeGamePlayerState.normal;
    private shootPlayTime: number = 0;
    //自己的编号
    private selfNum: string;
    private playerDeadBind: FunctionBinder;
    private dieStateRoleJumpGroundBind: FunctionBinder;

    public startArea(): m4m.math.vector3[] {
        return null;
    }
    public endArea(): m4m.math.vector3[] {
        return null;
    }
    public getGameType(): GamePlayType {
        return GamePlayType.hoodle;
    }
    public runGame() {
        this.mainRoleInit = false;
        this.sceneInit = false;
        console.log("进入黑夜大混战");
        this.serverConfig = WsDataManager.DarkFightConfigBaseData;

        EventMgr.addListener("role_makeSuccess", this.onMakeEnd, this);
        EventMgr.addListener("game_result", this.gameResultFunc, this);
        EventMgr.addListener("game_state", this.gameStateChangeFunc, this);
        this.playerDeadBind = UiDataManager.bindFunctionData(BindKeyName.gamePlayerDead, this.playerDeadFunc.bind(this));
        this.dieStateRoleJumpGroundBind = UiDataManager.bindFunctionData(BindKeyName.dieStateRoleJumpGround, this.dieStateRoleJumpGroundFunc.bind(this));

        // 加载黑夜大混战场景
        EventMgr.addListener("scene_visual_change", this.sceneChangeFun, this);
        this.sceneID = SceneidEnum.Hall;
        SceneLoadManager.Instance.loadScene(this.sceneID);

        FrameMgr.Add(this.Update, this);

        this.initPlayers();

        //太诡异的bgm了
        AudioPlayer.playBGM(AudioEnum.WoodenBg);
        ShowAttackManager.Instance.Attackstate = 0;
        UiDataManager.changeFunctionData(BindKeyName.showAttackBtn, true);
    }
    public exitGame() {
        console.log("退出黑夜大混战");
        EventMgr.removeListener("role_makeSuccess", this.onMakeEnd, this);
        EventMgr.removeListener("game_result", this.gameResultFunc, this);
        EventMgr.removeListener("game_state", this.gameStateChangeFunc, this);
        EventMgr.removeListener("scene_visual_change", this.sceneChangeFun, this);
        UiDataManager.unBindFunctionDataByBinder(this.playerDeadBind);
        UiDataManager.unBindFunctionDataByBinder(this.dieStateRoleJumpGroundBind);

        TimeLineManager.Instance.stopAndClaer();
        FrameMgr.Remove(this.Update, this);

        RoleMgr.player.changeWeapons(Weapons.none);

        UiDataManager.changeFunctionData(BindKeyName.showAttackBtn, false);

        GamingManager.Instance.hpBarVisible = 0;
        UIOpenOrHideManager.Instance.HideGamingView();
    }

    public Update(delta: number) {
        this.shootPlayTime -= delta;
    }

    //角色创建完毕
    public onMakeEnd(ev: EventGeneric<string>) {
        if (ev.data.startsWith("N:")) { //npc

        } else {
            let role = RoleMgr.getRoleByGUID(ev.data);
            role.changeWeapons(Weapons.dao);
            if (ev.data == StageMgr.PlayerGUID) {
                console.error("黑夜大混战场游戏场景主角色创建完毕!");
                this.mainRoleInit = true;
                this.loadReadyFun();
            }
            //设置血量
            role.roleData.MaxHp = role.roleData.CurHp = this.serverConfig.startHp;
        }
    }

    //场景加载完成
    public sceneChangeFun(ev: SceneVisualEvent) {
        if (ev.sceneID == this.sceneID && ev.isShow) {
            EventMgr.removeListener("scene_visual_change", this.sceneChangeFun, this);
            console.error(`黑夜大混战场景加载完毕 isShow : ${ev.isShow} , sceneID : ${ev.sceneID} , sceneType : ${ev.sceneType}`);
            this.sceneInit = true;
            this.loadReadyFun();

            //显示玩家头顶名称
            GamingManager.Instance.hpBarVisible = 2;
            UIOpenOrHideManager.Instance.OpenGamingView();
        }
    }

    public loadReadyFun() {
        //场景以及主角加载完成
        if (this.mainRoleInit && this.sceneInit) {
            //通知服务器 加载场景资源完成
            WebsocketTool.Instance.RoomManager_readyForGame();
            //设置相机看向目标参数
            SceneLoadManager.Instance.upDateCameraViewInfo();
        }
    }

    //创建玩家
    public initPlayers() {
        SceneLoadManager.Instance.getSceneConfig()
            .then((config) => {
                //加载服务器玩家列表
                let roleArr = JSON.parse(this.serverConfig.players);
                UiDataManager.changeFunctionData(BindKeyName.roelgming, roleArr);
                for (let key in roleArr) {
                    // console.error(`key:${key}`);
                    let roleData = roleArr[key];
                    let GUID = roleData.playerInfo.token;
                    let isMain = GUID == StageMgr.PlayerGUID;
                    let setPos = roleData.pos;
                    let roleInfo = new RoleAttrInfo();
                    roleInfo.roleType = RoleTypeEnum.Player;
                    roleInfo.GUID = GUID;
                    roleInfo.pos = setPos;
                    roleInfo.angle = config.roleAngle;
                    if (roleData.num != null) {
                        roleInfo.num = roleData.num;
                    }
                    roleInfo.defDiePerformance = GameDiePerformanceEnum.Die;
                    roleInfo.roleState = roleData.playerInfo.status;
                    if (isMain) {
                        this.selfNum = roleInfo.num.toString();
                    }
                    EventMgr.dispatchEvent("role_make", new EventGeneric<{ roleInfo: RoleAttrInfo }>({ roleInfo }));
                }
            });
    }

    //服务器调用 游戏状态改变
    private gameStateChangeFunc(ev: EventGeneric<{ gameState: GameState }>) {
        this.gameState = ev.data.gameState;
    }

    /** 游戏中玩家死亡 */
    private playerDeadFunc(list: string[]) {
        for (let guid of list) {
            this.playerDead(guid);
        }
    }

    //测试玩家被击飞,在控制台手动调用
    private testFly(num: string, offset: m4m.math.vector3, time: number) {
        console.error("玩家被击飞:", num, offset, time);
        let role = RoleMgr.getRoleByNum(num);
        m4m.math.vec3Add(role.roleDoll.model.localPosition, offset, offset);
        role.roleCtr.handleInput(RoleActInput.StrikeToFly, {
            dropPoint: offset,
            flyTime: time,
        });
    }

    //玩家已死亡 跳起落地处理
    private dieStateRoleJumpGroundFunc(guid) {
        let _role = RoleMgr.getRoleByGUID(guid);
        _role.roleCtr.handleInput(RoleActInput.Die);
    }

    //有玩家死亡
    private playerDead(guid: string) {
        //玩家
        let player = RoleMgr.getRoleByGUID(guid);
        player.roleData.inGameState = InGameStatus.inGameDead;

        //设置玩家状态为死亡状态
        if (guid == StageMgr.PlayerGUID) {
            this.playerState = MeleeGamePlayerState.dead;
            setTimeout(() => {
                ScoreboardManager.Instance.rank = 0;
                ScoreboardManager.Instance.showLostBoard();
            }, 2000);
        }
        //发送玩家死亡的消息
        UiDataManager.changeFunctionData(BindKeyName.playerDead, guid);
    }

    /** 服务器结算 */
    private gameResultFunc(ev: EventGeneric<{ resultData: ResultBase }>) {
        this.isResulted = true;
        //判断是否有未到达终点的玩家
        let losers = JSON.parse(ev.data.resultData.losers);
        let lifePlayer = MeleeGameManager.Instance.lifePlayer;
        //最后死亡的人数
        let deadCount = 0;
        for (let key in losers) {
            let token = losers[key].token;
            //在生还列表中
            let player = lifePlayer[token];
            if (player) {
                this.playerDead(token);
                delete lifePlayer[token];
                deadCount++;
            }
        }

        if (this.playerState == MeleeGamePlayerState.normal) {
            // console.error("你胜利了");
            let rank = 0;
            let winers = JSON.parse(ev.data.resultData.winers);
            let myToken = StageMgr.PlayerGUID;
            for (let key in winers) {
                let player = winers[key];
                if (player.token == myToken) {
                    rank = Number(key);
                }
            }
            setTimeout(() => {
                //弹出胜利面板
                RoleMgr.canMove(false);
                ScoreboardManager.Instance.rank = rank;
                ScoreboardManager.Instance.showWinBoard();
            }, 1500);
        }
    }

    //播放射击音效, 开播100毫秒内不允许再次播放
    private playGunshoot() {
        if (this.shootPlayTime <= 0) {
            this.shootPlayTime = 0.1;
            AudioPlayer.stop(AudioEnum.WoodenGunshoot);
            AudioPlayer.play(AudioEnum.WoodenGunshoot);
        }
    }
}