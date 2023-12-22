import { EventGeneric, EventMgr } from "eventMgr";
import { UiDataManager } from "PSDUI/UiDataManager";
import { SceneBase } from "SceneBase";
import { StageMgr } from "../Core/StageMgr";
import { BindKeyName } from "../Data/BindKeyName";
import { GamePlayType } from "../GameEnum";
import { GamePlayMgr } from "../gamePlays/GamePlayMgr";
import { HallConfigBaseEvent } from "../Net/DataEvents/HallConfigBaseEvent";
import { UserVarBaseEvent } from "../Net/DataEvents/UserVarBaseEvent";
import { WsDataManager } from "../Net/WsDataManager";
import { CameraViewInfo } from "../Role/CameraViewInfo";
import { RoleAttrInfo, RoleTypeEnum } from "../Role/RoleAttrInfo";
import { RoleMgr } from "../Role/RoleMgr";
import { SceneLoadManager } from "../Scene/SceneLoadManager";
import { GamingManager } from "./GamingManager";
import { UIOpenOrHideManager } from "./UIOpenOrHideManager";

//等待房间数据
export class WaitRoomManager {
    public static get Instance(): WaitRoomManager {
        if (this._instance == null) {
            this._instance = new WaitRoomManager();
        }
        return this._instance;
    }

    public data: any;

    public max: any;

    private static _instance: WaitRoomManager;

    //初始化
    public init() {
        // console.error(WsDataManager.UserVarBaseData);
        WsDataManager.HallConfigBaseData.addEventListener(HallConfigBaseEvent.Init, this.waitRoomInfoFun.bind(this));
        WsDataManager.HallConfigBaseData.addEventListener(HallConfigBaseEvent.players, this.addPlayersFun.bind(this));
    }
    private addPlayersFun(data) {
        //console.error(data);
        for (let key in data) {
            // console.log(`key:${i}`);
            let GUID = key;
            let roleData = data[key];
            if (roleData == null) {
                //移除玩家
                EventMgr.dispatchEvent("role_remove", { data: GUID });
            } else {
                //增加玩家
                this.addRole(GUID, roleData);
            }
        }
        let roleArr = JSON.parse(WsDataManager.HallConfigBaseData.players);
        // console.error("等待房间玩家列表数据", roleArr);
        this.data = roleArr;
        UiDataManager.changeFunctionData(BindKeyName.EyeVerify, roleArr);

    }

    private addRole(GUID: string, roleData) {
        SceneLoadManager.Instance.getSceneConfig()
            .then((config) => {
                let setPos = roleData.pos;
                let roleInfo = new RoleAttrInfo();
                roleInfo.roleType = RoleTypeEnum.Player;
                roleInfo.GUID = GUID;
                roleInfo.pos = setPos;
                roleInfo.angle = config.roleAngle;
                roleInfo.roleState = roleData.playerInfo.status;
                roleInfo.isInit = true;
                if (roleData.num != null) {
                    roleInfo.num = roleData.num;
                }
                //console.log(roleData.num);
                EventMgr.dispatchEvent("role_make", new EventGeneric<{ roleInfo: RoleAttrInfo }>({ roleInfo }));
            });
    }

    private waitRoomInfoFun() {
        //
        GamePlayMgr.ExitGame();
        //显示loading
        // UIOpenOrHideManager.Instance.OpenLoadingView();
        UIOpenOrHideManager.Instance.OpenTloadingView();
        //因大厅房间和单人大厅是同一场景
        EventMgr.addListener("role_makeSuccess", this.onMakeEnd, this);

        // console.error("等待房间数据更新", WsDataManager.HallConfigBaseData);

        this.max = WsDataManager.HallConfigBaseData.maxPlayer;

        let roleArr = JSON.parse(WsDataManager.HallConfigBaseData.players);
        // console.error("等待房间玩家列表数据", roleArr);
        this.data = roleArr;

        for (let key in roleArr) {
            let roleData = roleArr[key];
            // console.log(` &&& `,roleData);
            let GUID = roleData.playerInfo.token;
            let isMain = GUID == StageMgr.PlayerGUID;
            // let setPos = roleData.pos;
            // //玩家旋转角度
            // let rot = roleData.rot;
            // let roleInfo = new RoleAttrInfo();
            // roleInfo.roleType = RoleTypeEnum.Player;
            // roleInfo.GUID = GUID;
            // roleInfo.pos = setPos;
            // roleInfo.angle = rot;
            // roleInfo.roleState = roleData.playerInfo.status;
            if (isMain) {
                console.error("玩家ID " + GUID + " 进入等待房间");
            }
            // EventMgr.dispatchEvent("role_make", new EventGeneric<{ roleInfo: RoleAttrInfo }>({ roleInfo }));
            this.addRole(GUID, roleData);
        }
    }

    //角色创建完毕
    private onMakeEnd(ev: EventGeneric<string>) {
        if (ev.data == StageMgr.PlayerGUID) {
            console.error(ev.data, " 角色创建完毕 ", StageMgr.PlayerGUID);
            //如果是主角创建完成
            EventMgr.removeListener("role_makeSuccess", this.onMakeEnd, this);

            //设置相机看向目标参数
            SceneLoadManager.Instance.upDateCameraViewInfo();
            GamingManager.Instance.index = 1;
            UIOpenOrHideManager.Instance.OpenGamingView();
        }
    }
}