import { cMap } from "Data/Map";
import { EventGeneric, EventMgr } from "eventMgr";
import { UiDataManager } from "PSDUI/UiDataManager";
import { CDManage } from "Time/CDManage";
import { StageMgr } from "../Core/StageMgr";
import { BindKeyName } from "../Data/BindKeyName";
import { GamePlayType, InGameStatus, PlayerStatus } from "../GameEnum";
import { GamePlayMgr } from "../gamePlays/GamePlayMgr";
import { WoodConfigBaseEvent } from "../Net/DataEvents/WoodConfigBaseEvent";
import { WoodSongDataEvent } from "../Net/DataEvents/WoodSongDataEvent";
import { WsDataManager } from "../Net/WsDataManager";
import { RoleServerInfo } from "../Role/RoleAttrInfo";
import { GameRunningCountdownManager } from "./GameRunningCountdownManager";
import { GameStartCountdownManager } from "./GameStartCountdownManager";
import { UIOpenOrHideManager } from "./UIOpenOrHideManager";

//木头人游戏数据
export class WoodenPeopleManager {
    //胜利玩家列表
    public winPlayer: string[] = [];
    //活着的玩家列表
    public lifePlayer: { [key: string]: any } = {};

    public static get Instance(): WoodenPeopleManager {
        if (this._instance == null) {
            this._instance = new WoodenPeopleManager();
        }
        return this._instance;
    }
    public data: any;
    private static _instance: WoodenPeopleManager;

    //初始化
    public init() {
        WsDataManager.WoodConfigBaseData.addEventListener(WoodConfigBaseEvent.Init, this.woodenPeopleInfoFun.bind(this));
        WsDataManager.WoodConfigBaseData.addEventListener(WoodConfigBaseEvent.players, this.playersInfoUpDateFun.bind(this));
        WsDataManager.WoodConfigBaseData.addEventListener(WoodConfigBaseEvent.gameTime, this.gameStartFun.bind(this));
        WsDataManager.WoodConfigBaseData.addEventListener(WoodConfigBaseEvent.countDown, this.countDownTimeUpdateFun.bind(this));
        WsDataManager.WoodSongDataData.addEventListener(WoodSongDataEvent.Init, this.soundTimeUpdateFun.bind(this));
    }

    //初始化所有玩家信息
    private initLifePlayer() {
        let players = JSON.parse(WsDataManager.WoodConfigBaseData.players);
        let role = {...players};
        this.lifePlayer = players;
        this.winPlayer.length = 0;
        UiDataManager.changeFunctionData(BindKeyName.Scenario, role);

    }

    private woodenPeopleInfoFun() {
        console.error("服务器消息: 木头人: 木头人游戏", WsDataManager.WoodConfigBaseData);
        this.initLifePlayer();

        //进入木头人游戏
        GamePlayMgr.RunGame(GamePlayType.woodenPeople);

        let generic = new EventGeneric<{ config: any }>();
        generic.data = { config: WsDataManager.WoodConfigBaseData };
        EventMgr.dispatchEvent("game_config", generic);
    }

    //玩家数据更新 (移动同步相关)
    private playersInfoUpDateFun(info) {
        //玩家死亡列表
        let playerDeadList: string[];

        //胜利玩家列表
        let playerWinList: string[];

        let roleArr = info;
        // console.error("玩家数据更新", roleArr);
        for (let key in roleArr) {
            // console.log(`key:${i}`);
            let GUID = key;
            let posInfo = roleArr[key];
            let isMain = GUID == StageMgr.PlayerGUID;
            let roleServerInfo = new RoleServerInfo();
            if (isMain) {
                //
                // console.error("主玩家数据",posInfo);
            } else {
                let str = posInfo.pos;
                let pos = m4m.poolv3();
                pos.x = str.x;
                pos.y = str.y;
                pos.z = str.z;
                roleServerInfo.pos = pos;
                //到目标点用的时间
                let moveTime = posInfo.moveTime;
                roleServerInfo.moveTime = moveTime;
                //移动类型  走  跑  跳 等
                let moveType = posInfo.moveType;
                roleServerInfo.moveType = moveType;
            }
            roleServerInfo.GUID = GUID;
            roleServerInfo.roleState = posInfo.playerInfo.status;
            roleServerInfo.inGameStatus = posInfo.playerInfo.inGameStatus;
            let data = roleServerInfo;
            // 
            EventMgr.dispatchEvent("role_Data_upDate", new EventGeneric<{ data: RoleServerInfo }>({ data }));

            //判断玩家是死亡
            if (posInfo.playerInfo.inGameStatus == InGameStatus.inGameDead && this.lifePlayer[GUID]) {
                if (!playerDeadList) {
                    playerDeadList = [GUID];
                } else {
                    playerDeadList.push(GUID);
                }
                delete this.lifePlayer[GUID];
            } else if (posInfo.playerInfo.inGameStatus == InGameStatus.inGameWin && this.winPlayer.indexOf(GUID) == -1) { //判断玩家是否胜利
                if (!playerWinList) {
                    playerWinList = [posInfo];
                } else {
                    playerWinList.push(posInfo);
                }
                this.winPlayer.push(GUID);
            }
        }

        //发送其他玩家死亡
        if (playerDeadList) {
            UiDataManager.changeFunctionData(BindKeyName.gamePlayerDead, playerDeadList);
            //EventMgr.dispatchEvent("game_Player_Dead", new EventGeneric<{ GUIDS: string[] }>({ GUIDS: playerDeadList }));
        }
        //发送其他玩家胜利
        if (playerWinList) {
            UiDataManager.changeFunctionData(BindKeyName.WoodIntegral, playerWinList);
        }
    }

    //加载资源完成游戏开始时间同步
    private gameStartFun(data) {
        console.error("服务器消息: 木头人: 服务器时间:", data);
        //更新服务器时间
        let serverTime = data;
        CDManage.Instance.setServerTime(serverTime);
        // let generic = new EventGeneric<{ time: number }>();
        // generic.data = { time: serverTime };
        // EventMgr.dispatchEvent("Wooden_serverTime", generic);
    }

    //倒计时 开始时间先同步
    private countDownTimeUpdateFun(data) {
        console.error("服务器消息: 木头人: 开始时间:", data);

        //停止之前的倒计时
        GameStartCountdownManager.Instance.stop();
        GameRunningCountdownManager.Instance.stop();
        //开始倒计时
        let countdownTime = WsDataManager.WoodConfigBaseData.countTime;
        GameStartCountdownManager.Instance.init(data, countdownTime, () => {
            // 进行游戏倒计时
            let runStartTime = WsDataManager.WoodConfigBaseData.countDown + WsDataManager.WoodConfigBaseData.countTime;
            let countdownTime2 = WsDataManager.WoodConfigBaseData.totleTime - 1000;
            GameRunningCountdownManager.Instance.init(runStartTime, countdownTime2);
        });
    }

    //声音 开始 和 停止
    private soundTimeUpdateFun() {
        if (WsDataManager.WoodSongDataData.playSound != 0) {
            // console.error("服务器消息: 音效id:", WsDataManager.WoodSongDataData.playSound, "开始时间:", WsDataManager.WoodSongDataData.playSoundTime);
            EventMgr.dispatchEvent("game_wooden_audioTime", {
                data: {
                    playSound: WsDataManager.WoodSongDataData.playSound,
                    playSoundTime: WsDataManager.WoodSongDataData.playSoundTime,
                },
            });
        } else {
            // console.error("服务器消息: 音效结束时间:", WsDataManager.WoodSongDataData.stopSoundTime);
            EventMgr.dispatchEvent("game_wooden_audioStopTime", {
                data: {
                    stopSoundTime: WsDataManager.WoodSongDataData.stopSoundTime,
                },
            });
        }
    }
}