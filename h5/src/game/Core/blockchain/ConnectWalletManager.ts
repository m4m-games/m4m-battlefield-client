import { UIOpenOrHideManager } from "../../Manager/UIOpenOrHideManager";
import { UITipManager } from "../../Manager/UITipManager";

export class ConnectWalletManager {
    public address: any;
    public Telegram: any;
    public static get Instance(): ConnectWalletManager {
        if (this._instance == null) {
            this._instance = new ConnectWalletManager();
        }
        return this._instance;
    }
    constructor() {
        this.M4M_SDK = window["M4M"];
    }

    public init() {
        this.Telegram = window["Telegram"];
        this.Telegram.WebApp.initData;
    }

    public loginToken(callBackFun: Function) {
        let count = Object.keys(this.Telegram.WebApp.initDataUnsafe).length;
        if (count <= 0) {
            var searchParams = new URLSearchParams(window.location.search);
            var userId = searchParams.get("user_id");
            var accessToken = searchParams.get("access_token");
            callBackFun(userId);
        } else if (count > 0) {
            callBackFun(this.Telegram.WebApp.initDataUnsafe.user.id)
        }
    }

    private static _instance: ConnectWalletManager;
    private wallet: any;
    private M4M_SDK: any;
    public onAccountsChanged(accounts) {
        console.log("onAccountsChanged callback: ", accounts);
        console.log("Switch wallet");
    }

    public onChainChanged(chainId) {
        console.log("onChainChanged callback: ", chainId);
    }

    public onDisconnect(error) {
        console.log("onDisconnect callback: ", error);
        this.M4M_SDK.disconnect();
    }

    public onError(error) {
        console.log("onError callback: ", error);
        console.log(error);
    }
    // 销毁钱包
    public async destroy() {
        await this.wallet?.destroy?.();
        this.wallet = null;
    }

    //是否连上钱包
    public async IsMetaMaskLinked() {
        const accounts = await this.wallet.getAccounts(false);
        if (accounts?.[0]) {
            // console.log("连上了钱包");
            return true;
            // tslint:disable-next-line: unnecessary-else
        } else {
            // console.log("未连上钱包");
            return false;
        }
    }
    //登录账户
    public loginAccount(callBackFun: Function) {
        // tslint:disable-next-line: newline-per-chained-call
        this.M4M_SDK.login(this.M4M_SDK.Connector_Types.Injected).then((res) => {
            console.log(res);// res  钱包对字符串的签名。后面可以发到后端进行验证，发放session cookie或者jwt
            this.M4M_SDK.connect({
                handleAccountsChanged: this.onAccountsChanged,
                handleChainChanged: this.onChainChanged,
                handleDisconnect: this.onDisconnect,
                handleError: this.onError,
            });
            // tslint:disable-next-line: newline-per-chained-call
            this.M4M_SDK.getInfo()
                // tslint:disable-next-line: no-shadowed-variable
                .then(async (res) => {
                    // res.address 钱包地址
                    this.address = res.address;
                    if (callBackFun) {
                        callBackFun(res);
                    }
                    if (res.chainId !== 80001) {
                        // tslint:disable-next-line: newline-per-chained-call
                        return this.M4M_SDK.switchNetwork().then(() => { });
                    }
                });
            // tslint:disable-next-line: newline-per-chained-call
        }).catch((error) => {
            console.log("签名错误信息", error);
            if (error.code == 4001) {
                UITipManager.Instance.tipPanelText = "Sorry, signature authorization failed";
                UIOpenOrHideManager.Instance.OpenTipsTCView();
            }
        });
    }
}