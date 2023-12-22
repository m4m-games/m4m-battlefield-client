import { PlatformType, PlatformUtil } from "Tools/PlatformUtil";
import { CHAIN_NAME, IBindResultData, PLATFORM, apis } from "./apis";

enum THEME {
    DARK = "DARK",
    LIGHT = "LIGHT"
}
enum CHAIN {
    MAINNET = "-239",
    TESTNET = "-3"
}
export class ConnectWalletTonkeeper {
    public address: any;
    public tonkeeper: any;
    public addressDisplay: string;
    public bType: PlatformType;
    public TonConnectUI: any;
    public TonWallet: any;
    public Telegram: any;
    public TonWeb: any;
    public bindData: IBindResultData[] = [];
    public tonwebsdk: any
    public static get Instance(): ConnectWalletTonkeeper {
        if (this._instance == null) {
            this._instance = new ConnectWalletTonkeeper();
        }
        return this._instance;
    }
    constructor() {
        // this.tonwebsdk = new this.TonWeb(new this.TonWeb.HttpProvider(NODE_API_URL, { apiKey: TONCENTER_API_KEY }));
        this.tonkeeper = window["TON_CONNECT_UI"];
        for (let ord = 0; ord <= 255; ord++) {
            let s2 = ord.toString(16);
            if (s2.length < 2) {
                s2 = "0" + s2;
            }
            this.toByteMap[s2] = ord;
        }

    }
    //m4m.__consTool.ConnectWalletTonkeeper.Instance.openHelp(e);
    public tid: string = '1';
    private static _instance: ConnectWalletTonkeeper;
    public init() {
        apis.Instance.getCurreny();
        this.TonWeb = window["TonWeb"];
        this.Telegram = window["Telegram"];
        this.Telegram.WebApp.initData;
        //console.error(window["TelegramWebviewProxy"]);
        //console.error(this.Telegram.WebApp.initData);
        let count = Object.keys(this.Telegram.WebApp.initDataUnsafe).length;
        if (count > 0) {
            this.tid = this.Telegram.WebApp.initDataUnsafe.user.id;
            console.error("this.tid", this.tid);
        }
    }

    public async loginAccount(fun: Function) {
        const walletConnectionSource = {
            universalLink: "https://app.tonkeeper.com/ton-connect",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
        };
        const TonConnectUIData = {
            manifestUrl: `https://twa.soton-test.sonet.one/tonconnect-manifest.json`,
            uiPreferences: { theme: THEME.LIGHT },
            walletsList: { wallets: ["Tonkeeper"] }
        }
        this.TonConnectUI = new this.tonkeeper.TonConnectUI(TonConnectUIData);
        const connector = this.TonConnectUI.connector;
        connector.onStatusChange(async (walletInfo: any) => {
            // update state/reactive variables to show updates in the ui
            console.error("update state/reactive variables to show updates in the ui")
        });
        // const universalLink = await connector.connect(walletConnectionSource);
        const connectWallet = await this.TonConnectUI.connectWallet();
        if (ConnectWalletTonkeeper.element != null) {
            ConnectWalletTonkeeper.element = null
            let childNode = m4m.framework.sceneMgr.app.container.childNodes[m4m.framework.sceneMgr.app.container.childNodes.length - 1];
            m4m.framework.sceneMgr.app.container.removeChild(childNode);
        }
        this.TonWallet = this.TonConnectUI.wallet;
        if (fun) {
            this.address = this.toUserFriendlyAddress(this.TonWallet.account.address, this.TonWallet.account.chain === CHAIN.TESTNET);
            // console.error("this.address", this.address);
            this.addressDisplay = this.address.substring(0, 4) + "..." + this.address.substr(-4);
            await this.handleBind();
            fun(this.address);
            fun = null;
        }
    }
    private static element: HTMLDivElement;

    private handleLogout() {
        this.TonConnectUI.disconnect();
    }



    private openHelp(url) {
        if (ConnectWalletTonkeeper.element == null) {
            ConnectWalletTonkeeper.element = document.createElement("div");
            m4m.framework.sceneMgr.app.container.append(ConnectWalletTonkeeper.element);
            ConnectWalletTonkeeper.element.style.width = "100%";
            ConnectWalletTonkeeper.element.style.height = "100%";
            ConnectWalletTonkeeper.element.style.position = "absolute";
            ConnectWalletTonkeeper.element.style.left = "50%";
            ConnectWalletTonkeeper.element.style.top = "50%";
            ConnectWalletTonkeeper.element.style.transform = "translate(-50%, -50%)";
            ConnectWalletTonkeeper.element.innerHTML = `
            <div style="width: 100%;height: 25px;background: #ffffff">
                <div style="float: left;margin-left: 8px;">Tonkeeper</div>
                <div id="closeIframeBtn" style="float: right;margin-right: 8px;">X</div>
            </div>
            <iframe src="${url}" style="width: calc(100% - 4px);height: calc(100% - 25px)"></iframe>
            `;
            setTimeout(() => {
                let div = document.getElementById("closeIframeBtn");
                div.addEventListener("click", () => {
                    ConnectWalletTonkeeper.element = null;
                    let childNode = m4m.framework.sceneMgr.app.container.childNodes[m4m.framework.sceneMgr.app.container.childNodes.length - 1];
                    m4m.framework.sceneMgr.app.container.removeChild(childNode);
                    // console.error("关闭子窗体");
                })
            }, 1);
        }
    }

    public bind1WithWeb3Proof(params: {
        address: string;
        appid: string;
        sig?: string;
        pubkey?: string;
        // chain_name: string;
    }) {
        const { address, appid, sig, pubkey } = params;
        return apis.Instance.bind1WithWeb3Proof({
            addr: address,
            platform: PLATFORM,
            tid: appid,
            sig: sig,
            pubkey: pubkey,
            chain_name: CHAIN_NAME,
        });
    }


    public async handleBind() {
        // console.error("handleBind")

        const params = {
            tid: this.tid, //
        };
        const resultData: IBindResultData[] = await apis.Instance.getBindResult(params);
        if (resultData.length == 0) {
            const res = await this.bind1WithWeb3Proof({
                address: this.address,
                appid: this.tid!,
            });
            // console.error("handleBind", res)
            if (res) {
                //console.error(`TON address "${this.addressDisplay}" has been bound to your Telegram account.`);
                this.getBind(); //refresh page
            } else {
                // message.error("Bind failed.");
                //console.error("Bind faile.");
            }
        }
    }

    public async getBind() {
        // console.error("getBindResult");
        const params = {
            // addr: address,
            tid: this.tid, //
        };
        const res: IBindResultData[] = await apis.Instance.getBindResult(params);
        if (res.length === 0) {
            console.log(res);
        } else {
            this.bindData = res
            if (Object.keys(res).length > 0) {
                const item = res.find(
                    (item) =>
                        item.addr !== this.address &&
                        item.platform === PLATFORM &&
                        item.tid === this.tid
                );
                if (item) {
                    console.error(`You've bound your wallet to ${item.addr} please unbind first!`);
                }
                if (!item) {
                    const item2 = res.find(
                        (item) =>
                            item.addr === this.address &&
                            item.platform === PLATFORM &&
                            item.tid === this.tid
                    );
                }
            }
        }
    }

    public async handleUnbind() {
        for (const item of this.bindData) {
            const res = await apis.Instance.unbind({
                addr: item.addr,
                tid: this.tid!,
            });
        }
    }


    public bounceableTag = 17;
    public testOnlyTag = 128;
    private toUserFriendlyAddress(hexAddress, testOnly = false) {
        const { wc, hex } = this.parseHexAddress(hexAddress);
        let tag = this.bounceableTag;
        if (testOnly) {
            tag |= this.testOnlyTag;
        }
        const addr = new Int8Array(34);
        addr[0] = tag;
        addr[1] = wc;
        addr.set(hex, 2);
        const addressWithChecksum = new Uint8Array(36);
        addressWithChecksum.set(addr);
        addressWithChecksum.set(this.crc16(addr), 34);
        let addressBase64 = this.encode(addressWithChecksum);
        return addressBase64.replace(/\+/g, "-").replace(/\//g, "_");
    }

    private parseHexAddress(hexAddress) {
        if (!hexAddress.includes(":")) {
            throw new Error(`Wrong address ${hexAddress}. Address must include ":".`);
        }
        const parts = hexAddress.split(":");
        if (parts.length !== 2) {
            throw new Error(`Wrong address ${hexAddress}. Address must include ":" only once.`);
        }
        const wc = parseInt(parts[0]);
        if (wc !== 0 && wc !== -1) {
            throw new Error(`Wrong address ${hexAddress}. WC must be eq 0 or -1, but ${wc} received.`);
        }
        const hex = parts[1];
        if ((hex === null || hex === void 0 ? void 0 : hex.length) !== 64) {
            throw new Error(`Wrong address ${hexAddress}. Hex part must be 64bytes length, but ${hex === null || hex === void 0 ? void 0 : hex.length} received.`);
        }
        return {
            wc,
            hex: this.hexToBytes(hex)
        };
    }
    public toByteMap = {};
    public hexToBytes(hex) {
        hex = hex.toLowerCase();
        const length2 = hex.length;
        if (length2 % 2 !== 0) {
            throw new Error("Hex string must have length a multiple of 2: " + hex);
        }
        const length = length2 / 2;
        const result = new Uint8Array(length);
        for (let i2 = 0; i2 < length; i2++) {
            const doubled = i2 * 2;
            const hexSubstring = hex.substring(doubled, doubled + 2);
            if (!this.toByteMap.hasOwnProperty(hexSubstring)) {
                throw new Error("Invalid hex character: " + hexSubstring);
            }
            result[i2] = this.toByteMap[hexSubstring];
        }
        return result;
    }

    public crc16(data) {
        const poly = 4129;
        let reg = 0;
        const message: any = new Uint8Array(data.length + 2);
        message.set(data);
        for (let byte of message) {
            let mask = 128;
            while (mask > 0) {
                reg <<= 1;
                if (Number(byte) & mask) {
                    reg += 1;
                }
                mask >>= 1;
                if (reg > 65535) {
                    reg &= 65535;
                    reg ^= poly;
                }
            }
        }
        return new Uint8Array([Math.floor(reg / 256), reg % 256]);
    }

    public encode(value, urlSafe = false) {
        let uint8Array;
        if (value instanceof Uint8Array) {
            uint8Array = value;
        } else {
            if (typeof value !== "string") {
                value = JSON.stringify(value);
            }
            uint8Array = this.decodeUTF8(value);
        }
        return this.encodeUint8Array(uint8Array, urlSafe);
    }
    public decodeUTF8(s2) {
        if (typeof s2 !== "string")
            throw new TypeError("expected string");
        var i2, d = unescape(encodeURIComponent(s2)), b = new Uint8Array(d.length);
        for (i2 = 0; i2 < d.length; i2++)
            b[i2] = d.charCodeAt(i2);
        return b;
    };

    public encodeUint8Array(value, urlSafe) {
        const encoded = this.encodeBase64(value);
        if (!urlSafe) {
            return encoded;
        }
        return encodeURIComponent(encoded);
    }

    public encodeBase64(arr) {
        var i2, s2 = [], len = arr.length;
        for (i2 = 0; i2 < len; i2++)
            s2.push(String.fromCharCode(arr[i2]));
        return btoa(s2.join(""));
    }

    public async sendTransaction(tx: { value: string; to: string; state_init?: string; payload?: string; }, text: string) {
        try {
            let num = this.TonWeb.utils.toNano(tx.value).toString()
            const _tx = {
                validUntil: Date.now() + 5 * 60 * 1000,
                network: CHAIN.MAINNET,
                messages: [
                    {
                        address: tx.to,
                        amount: num,
                        stateInit: tx.state_init || undefined,
                        payload: tx.payload || undefined,
                        text: text,
                    },
                ],
            }
            const resp = await this.TonConnectUI.sendTransaction(_tx);
            console.error("tonkeeper resp: ", resp.boc);
            if (ConnectWalletTonkeeper.element != null) {
                ConnectWalletTonkeeper.element = null
                let childNode = m4m.framework.sceneMgr.app.container.childNodes[m4m.framework.sceneMgr.app.container.childNodes.length - 1];
                m4m.framework.sceneMgr.app.container.removeChild(childNode);
            }
            return resp
        } catch (e) {
            console.error("error", e);
        }
    }

    public async send() {
        let _tx = {
            value: "0.001",
            to: "EQAHlOFkEWgc4NcS5TK7z08u75GdFkXL6p5kx_mjOQONrybr",
            state_init: undefined,
            payload: undefined
        }
        return await this.sendTransaction(_tx, "Transfer token");
    }
}




