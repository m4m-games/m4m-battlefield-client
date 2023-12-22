
import { UserDataManager } from "./UserDataManager";
import { WaitRoomManager } from "./WaitRoomManager";
import { MeleeGameManager } from "./MeleeGameManager";
import { GamingManager } from "./GamingManager";
import { GameResultManager } from "./GameResultManager";
import { EnterGameManager } from "./EnterGameManager";
import { ConnectWalletManager } from "../Core/blockchain/ConnectWalletManager";
import { ConnectWalletTonkeeper } from "../Core/blockchain/ConnectWalletTonkeeper";

export class GameDataEventInitManager {
    public static init() {
        UserDataManager.Instance.init();
        //等待房间
        WaitRoomManager.Instance.init();
        //黑夜大混战游戏
        MeleeGameManager.Instance.init();

        GamingManager.Instance.init();

        GameResultManager.Instance.init();

        EnterGameManager.Instance.init();
        ConnectWalletManager.Instance.init();
        ConnectWalletTonkeeper.Instance.init();
    }
}