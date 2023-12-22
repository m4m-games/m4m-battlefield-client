import { EventGeneric, EventMgr } from "eventMgr";
import { UiDataManager } from "PSDUI/UiDataManager";
import { CDManage } from "Time/CDManage";
import { StageMgr } from "../Core/StageMgr";
import { BindKeyName } from "../Data/BindKeyName";
import { GamePlayType, InGameStatus, PlayerMoveType, RoleActInput } from "../GameEnum";
import { GamePlayMgr } from "../gamePlays/GamePlayMgr";
import { DarkFightConfigBaseEvent } from "../Net/DataEvents/DarkFightConfigBaseEvent";
import { WsDataManager } from "../Net/WsDataManager";
import { RoleServerInfo } from "../Role/RoleAttrInfo";
import { RoleMgr } from "../Role/RoleMgr";
import { GameRunningCountdownManager } from "./GameRunningCountdownManager";
import { GameStartCountdownManager } from "./GameStartCountdownManager";
import { UIOpenOrHideManager } from "./UIOpenOrHideManager";

//黑夜混战游戏数据
export class MeleeGameManager {

    public static get Instance(): MeleeGameManager {
        if (this._instance == null) {
            this._instance = new MeleeGameManager();
        }
        return this._instance;
    }
    public lifePlayer: { [key: string]: any } = {};
    private static _instance: MeleeGameManager;
    //初始化
    public init() {
        WsDataManager.DarkFightConfigBaseData.addEventListener(DarkFightConfigBaseEvent.Init, this.meleeGamerInfoFun.bind(this));
        WsDataManager.DarkFightConfigBaseData.addEventListener(DarkFightConfigBaseEvent.players, this.playersInfoUpDateFun.bind(this));
        WsDataManager.DarkFightConfigBaseData.addEventListener(DarkFightConfigBaseEvent.gameTime, this.gameStartFun.bind(this));
        WsDataManager.DarkFightConfigBaseData.addEventListener(DarkFightConfigBaseEvent.countDown, this.countDownTimeUpdateFun.bind(this));
    }
    public meleeGamerInfoFun() {
        console.error("服务器消息: 黑夜大混战", WsDataManager.DarkFightConfigBaseData);
        this.initPlayer();

        //进入黑夜大混战
        GamePlayMgr.RunGame(GamePlayType.melee);
    }
    //初始化所有玩家信息
    private initPlayer() {
        //获取黑夜大混战
        let players = JSON.parse(WsDataManager.DarkFightConfigBaseData.players);
        let role = { ...players };
        this.lifePlayer = players;
        UiDataManager.changeFunctionData(BindKeyName.Scenario, role);
    }
    //玩家数据更新 (移动同步相关)
    private playersInfoUpDateFun(roleArr: { [key: string]: RoleServerInfo }) {
        //玩家死亡列表
        let playerDeadList: string[];
        for (let guid in roleArr) {
            // console.log(`key:${i}`);
            let posInfo = roleArr[guid];
            let roleServerInfo = new RoleServerInfo();

            roleServerInfo.GUID = guid;
            roleServerInfo.roleState = posInfo.playerInfo.status;
            roleServerInfo.inGameStatus = posInfo.playerInfo.inGameStatus;
            roleServerInfo.moveType = posInfo.moveType;
            roleServerInfo.moveTime = posInfo.moveTime;
            roleServerInfo.hp = posInfo.hp;

            if (posInfo.moveTime == -1) { //归位
                roleServerInfo.moveType = PlayerMoveType.homing;
                roleServerInfo.pos = m4m.poolv3();
                m4m.math.vec3Set(roleServerInfo.pos, posInfo.pos.x, posInfo.pos.y, posInfo.pos.z);
                roleServerInfo.pos.y = 0;
                EventMgr.dispatchEvent("role_Data_upDate", new EventGeneric<{ data: RoleServerInfo }>({ data: roleServerInfo }));
                continue;
            } else if (guid != StageMgr.PlayerGUID) { //其他玩家同步
                roleServerInfo.pos = m4m.poolv3();
                m4m.math.vec3Set(roleServerInfo.pos, posInfo.pos.x, posInfo.pos.y, posInfo.pos.z);
                if (posInfo.hitType == 1) {
                    //console.log("玩家:", RoleMgr.getRoleByGUID(guid).roleData.name, "发起了攻击");
                    let role = RoleMgr.getRoleByGUID(guid);
                    if(role){
                        role.roleCtr.handleInput(RoleActInput.Attack, role.roleCtr.state);   
                    }
                }
            }

            //判断玩家是死亡
            if (posInfo.playerInfo.inGameStatus == InGameStatus.inGameDead && this.lifePlayer[guid]) {
                if (!playerDeadList) {
                    playerDeadList = [guid];
                } else {
                    playerDeadList.push(guid);
                }
                delete this.lifePlayer[guid];
            }
            EventMgr.dispatchEvent("role_Data_upDate", new EventGeneric<{ data: RoleServerInfo }>({ data: roleServerInfo }));
        }
        //发送其他玩家死亡
        if (playerDeadList) {
            UiDataManager.changeFunctionData(BindKeyName.gamePlayerDead, playerDeadList);
            //EventMgr.dispatchEvent("game_Player_Dead", new EventGeneric<{ GUIDS: string[] }>({ GUIDS: playerDeadList }));
        }
    }
    //加载资源完成游戏开始时间同步
    private gameStartFun(data) {
        console.error("服务器消息: 服务器时间:", data);
        //更新服务器时间
        let serverTime = data;
        CDManage.Instance.setServerTime(serverTime);
    }
    //倒计时 开始时间先同步
    private countDownTimeUpdateFun(data) {
        console.error("服务器消息: 开始时间:", data);
        //停止之前的倒计时
        GameStartCountdownManager.Instance.stop();
        GameRunningCountdownManager.Instance.stop();
        //开始倒计时
        let countdownTime = WsDataManager.DarkFightConfigBaseData.countTime;
        GameStartCountdownManager.Instance.init(data, countdownTime, () => {
            // 进行游戏倒计时
            let runStartTime = WsDataManager.DarkFightConfigBaseData.countDown + WsDataManager.DarkFightConfigBaseData.countTime;
            let countdownTime2 = WsDataManager.DarkFightConfigBaseData.totleTime - 1000;
            GameRunningCountdownManager.Instance.init(runStartTime, countdownTime2);
        });
        UIOpenOrHideManager.Instance.HidetxtbgView();
    }
}