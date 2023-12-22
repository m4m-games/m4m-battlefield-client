import { cMap } from "Data/Map";
import { BattleListBase } from "BattleListBase";
import { CookieConfigBase } from "CookieConfigBase";
import { CookieGameData } from "CookieGameData";
import { DailyRank } from "DailyRank";
import { WeeklyRank } from "WeeklyRank";
import { MonthlyRank } from "MonthlyRank";
import { CookieDailyRank } from "CookieDailyRank";
import { CookieWeeklyRank } from "CookieWeeklyRank";
import { CookieMonthlyRank } from "CookieMonthlyRank";
import { DailyRankLast } from "DailyRankLast";
import { DailyRankLog } from "DailyRankLog";
import { WeeklyRankLast } from "WeeklyRankLast";
import { WeeklyRankLog } from "WeeklyRankLog";
import { MonthlyRankLast } from "MonthlyRankLast";
import { MonthlyRankLog } from "MonthlyRankLog";
import { CookieDailyRankLast } from "CookieDailyRankLast";
import { CookieDailyRankLog } from "CookieDailyRankLog";
import { CookieWeeklyRankLast } from "CookieWeeklyRankLast";
import { CookieWeeklyRankLog } from "CookieWeeklyRankLog";
import { CookieMonthlyRankLast } from "CookieMonthlyRankLast";
import { CookieMonthlyRankLog } from "CookieMonthlyRankLog";
import { DarkFightConfigBase } from "DarkFightConfigBase";
import { DialRiverConfigBase } from "DialRiverConfigBase";
import { DialRiverData } from "DialRiverData";
import { GameOpenSetting } from "GameOpenSetting";
import { GamesConfigBase } from "GamesConfigBase";
import { GamesTicketBase } from "GamesTicketBase";
import { GlassBridgerConfigBase } from "GlassBridgerConfigBase";
import { GlassBridgeData } from "GlassBridgeData";
import { GlassBridgePos } from "GlassBridgePos";
import { HallConfigBase } from "HallConfigBase";
import { ItemBase } from "ItemBase";
import { ItemData } from "ItemData";
import { ItemLog } from "ItemLog";
import { LoginLogBase } from "LoginLogBase";
import { MailData } from "MailData";
import { MarblesConfigBase } from "MarblesConfigBase";
import { MarblesData } from "MarblesData";
import { Notice } from "Notice";
import { PKConfigBase } from "PKConfigBase";
import { PlayerIcon } from "PlayerIcon";
import { ResultBase } from "ResultBase";
import { SettingBase } from "SettingBase";
import { SeverConfigBase } from "SeverConfigBase";
import { ShopList } from "ShopList";
import { ShopSet } from "ShopSet";
import { SquidGameConfigBase } from "SquidGameConfigBase";
import { TimeEvent } from "TimeEvent";
import { TotleRank } from "TotleRank";
import { CookieTotleRank } from "CookieTotleRank";
import { UserVarBase } from "UserVarBase";
import { WalletErrLog } from "WalletErrLog";
import { WalletLog } from "WalletLog";
import { WoodConfigBase } from "WoodConfigBase";
import { WoodSongData } from "WoodSongData";

export class WsDataManager {
    public static BattleListBaseData: BattleListBase = new BattleListBase();
    public static CookieConfigBaseData: CookieConfigBase = new CookieConfigBase();
    public static CookieGameDataData: CookieGameData = new CookieGameData();
    public static DailyRankData: DailyRank = new DailyRank();
    public static WeeklyRankData: WeeklyRank = new WeeklyRank();
    public static MonthlyRankData: MonthlyRank = new MonthlyRank();
    public static CookieDailyRankData: CookieDailyRank = new CookieDailyRank();
    public static CookieWeeklyRankData: CookieWeeklyRank = new CookieWeeklyRank();
    public static CookieMonthlyRankData: CookieMonthlyRank = new CookieMonthlyRank();
    public static DailyRankLastData: DailyRankLast = new DailyRankLast();
    public static DailyRankLogData: DailyRankLog = new DailyRankLog();
    public static WeeklyRankLastData: WeeklyRankLast = new WeeklyRankLast();
    public static WeeklyRankLogData: WeeklyRankLog = new WeeklyRankLog();
    public static MonthlyRankLastData: MonthlyRankLast = new MonthlyRankLast();
    public static MonthlyRankLogData: MonthlyRankLog = new MonthlyRankLog();
    public static CookieDailyRankLastData: CookieDailyRankLast = new CookieDailyRankLast();
    public static CookieDailyRankLogData: CookieDailyRankLog = new CookieDailyRankLog();
    public static CookieWeeklyRankLastData: CookieWeeklyRankLast = new CookieWeeklyRankLast();
    public static CookieWeeklyRankLogData: CookieWeeklyRankLog = new CookieWeeklyRankLog();
    public static CookieMonthlyRankLastData: CookieMonthlyRankLast = new CookieMonthlyRankLast();
    public static CookieMonthlyRankLogData: CookieMonthlyRankLog = new CookieMonthlyRankLog();
    public static DarkFightConfigBaseData: DarkFightConfigBase = new DarkFightConfigBase();
    public static DialRiverConfigBaseData: DialRiverConfigBase = new DialRiverConfigBase();
    public static DialRiverDataData: DialRiverData = new DialRiverData();
    public static GameOpenSettingData: GameOpenSetting = new GameOpenSetting();
    public static GamesConfigBaseData: GamesConfigBase = new GamesConfigBase();
    public static GamesTicketBaseData: GamesTicketBase = new GamesTicketBase();
    public static GlassBridgerConfigBaseData: GlassBridgerConfigBase = new GlassBridgerConfigBase();
    public static GlassBridgeDataData: GlassBridgeData = new GlassBridgeData();
    public static GlassBridgePosData: GlassBridgePos = new GlassBridgePos();
    public static HallConfigBaseData: HallConfigBase = new HallConfigBase();
    public static ItemBaseData: ItemBase = new ItemBase();
    public static ItemDataData: ItemData = new ItemData();
    public static ItemLogData: ItemLog = new ItemLog();
    public static LoginLogBaseData: LoginLogBase = new LoginLogBase();
    public static MailDataData: MailData = new MailData();
    public static MarblesConfigBaseData: MarblesConfigBase = new MarblesConfigBase();
    public static MarblesDataData: MarblesData = new MarblesData();
    public static NoticeData: Notice = new Notice();
    public static PKConfigBaseData: PKConfigBase = new PKConfigBase();
    public static PlayerIconData: PlayerIcon = new PlayerIcon();
    public static ResultBaseData: ResultBase = new ResultBase();
    public static SettingBaseData: SettingBase = new SettingBase();
    public static SeverConfigBaseData: SeverConfigBase = new SeverConfigBase();
    public static ShopListData: ShopList = new ShopList();
    public static ShopSetData: ShopSet = new ShopSet();
    public static SquidGameConfigBaseData: SquidGameConfigBase = new SquidGameConfigBase();
    public static TimeEventData: TimeEvent = new TimeEvent();
    public static TotleRankData: TotleRank = new TotleRank();
    public static CookieTotleRankData: CookieTotleRank = new CookieTotleRank();
    public static UserVarBaseData: UserVarBase = new UserVarBase();
    public static WalletErrLogData: WalletErrLog = new WalletErrLog();
    public static WalletLogData: WalletLog = new WalletLog();
    public static WoodConfigBaseData: WoodConfigBase = new WoodConfigBase();
    public static WoodSongDataData: WoodSongData = new WoodSongData();

    public static BattleListBaseDataList = BattleListBase;
    public static CookieConfigBaseDataList = CookieConfigBase;
    public static CookieGameDataDataList = CookieGameData;
    public static DailyRankDataList = DailyRank;
    public static WeeklyRankDataList = WeeklyRank;
    public static MonthlyRankDataList = MonthlyRank;
    public static CookieDailyRankDataList = CookieDailyRank;
    public static CookieWeeklyRankDataList = CookieWeeklyRank;
    public static CookieMonthlyRankDataList = CookieMonthlyRank;
    public static DailyRankLastDataList = DailyRankLast;
    public static DailyRankLogDataList = DailyRankLog;
    public static WeeklyRankLastDataList = WeeklyRankLast;
    public static WeeklyRankLogDataList = WeeklyRankLog;
    public static MonthlyRankLastDataList = MonthlyRankLast;
    public static MonthlyRankLogDataList = MonthlyRankLog;
    public static CookieDailyRankLastDataList = CookieDailyRankLast;
    public static CookieDailyRankLogDataList = CookieDailyRankLog;
    public static CookieWeeklyRankLastDataList = CookieWeeklyRankLast;
    public static CookieWeeklyRankLogDataList = CookieWeeklyRankLog;
    public static CookieMonthlyRankLastDataList = CookieMonthlyRankLast;
    public static CookieMonthlyRankLogDataList = CookieMonthlyRankLog;
    public static DarkFightConfigBaseDataList = DarkFightConfigBase;
    public static DialRiverConfigBaseDataList = DialRiverConfigBase;
    public static DialRiverDataDataList = DialRiverData;
    public static GameOpenSettingDataList = GameOpenSetting;
    public static GamesConfigBaseDataList = GamesConfigBase;
    public static GamesTicketBaseDataList = GamesTicketBase;
    public static GlassBridgerConfigBaseDataList = GlassBridgerConfigBase;
    public static GlassBridgeDataDataList = GlassBridgeData;
    public static GlassBridgePosDataList = GlassBridgePos;
    public static HallConfigBaseDataList = HallConfigBase;
    public static ItemBaseDataList = ItemBase;
    public static ItemDataDataList = ItemData;
    public static ItemLogDataList = ItemLog;
    public static LoginLogBaseDataList = LoginLogBase;
    public static MailDataDataList = MailData;
    public static MarblesConfigBaseDataList = MarblesConfigBase;
    public static MarblesDataDataList = MarblesData;
    public static NoticeDataList = Notice;
    public static PKConfigBaseDataList = PKConfigBase;
    public static PlayerIconDataList = PlayerIcon;
    public static ResultBaseDataList = ResultBase;
    public static SettingBaseDataList = SettingBase;
    public static SeverConfigBaseDataList = SeverConfigBase;
    public static ShopListDataList = ShopList;
    public static ShopSetDataList = ShopSet;
    public static SquidGameConfigBaseDataList = SquidGameConfigBase;
    public static TimeEventDataList = TimeEvent;
    public static TotleRankDataList = TotleRank;
    public static CookieTotleRankDataList = CookieTotleRank;
    public static UserVarBaseDataList = UserVarBase;
    public static WalletErrLogDataList = WalletErrLog;
    public static WalletLogDataList = WalletLog;
    public static WoodConfigBaseDataList = WoodConfigBase;
    public static WoodSongDataDataList = WoodSongData;

    public static setData(className, data) {
        WsDataManager[className + "Data"].clone(data);
        WsDataManager[className + "Data"].dispatchEvent("Init", data);
    }
    public static changeDataList(className: string, data) {
        let getClass = WsDataManager[className + "DataList"];
        if (getClass) {
            let newMap = new cMap();
            for (const key in data) {
                newMap.set(key, data[key]);
            }
            getClass.list = newMap;
        }
        WsDataManager[className + "Data"].dispatchEvent("ChangeList", data);
    }
    public static changeData(className: string, proName: string, paramType: string, data) {
        let param = WsDataManager[className + "Data"][proName];
        switch (paramType) {
            case "list":
                if (!param) {
                    WsDataManager[className + "Data"][proName] = [];
                }
                for (const key in data) {
                    if (key >= param.length) {
                        WsDataManager[className + "Data"][proName].push(data[key]);
                    } else {
                        WsDataManager[className + "Data"][proName][key] = data[key];
                    }
                }
                break;
            case "map":
                let oldMap;
                if (WsDataManager[className + "Data"][proName]) {
                    oldMap = JSON.parse(WsDataManager[className + "Data"][proName]);
                } else {
                    oldMap = {};
                }
                for (const key in data) {
                    oldMap[key] = data[key];
                }
                WsDataManager[className + "Data"][proName] = JSON.stringify(oldMap);
                break;
            case "mapdel":
                let oldMapDel;
                if (WsDataManager[className + "Data"][proName]) {
                    oldMapDel = JSON.parse(WsDataManager[className + "Data"][proName]);
                } else {
                    oldMapDel = {};
                }
                for (const key in data) {
                    if (oldMapDel[key]) {
                        delete oldMapDel[key];
                    }
                }
                WsDataManager[className + "Data"][proName] = JSON.stringify(oldMapDel);
                break;
            default:
                WsDataManager[className + "Data"][proName] = data;
        }
        WsDataManager[className + "Data"].dispatchEvent(proName, data);
    }
}