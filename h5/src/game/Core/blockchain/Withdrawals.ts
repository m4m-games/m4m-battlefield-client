
export const isMainnet = false;
export const TonWeb = window["TonWeb"]
export const tonweb = isMainnet ?
    new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', { apiKey: 'YOUR_MAINNET_API_KEY' })) :
    new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', { apiKey: '0b6ec5b0242bd7bdd6c24a2dc2cf1c8246713a5adefddbd09fb4c69608ecd901' }));
export const BN = TonWeb.utils.BN;
export class Deposits {
    public static get Instance(): Deposits {
        if (this._instance == null) {
            this._instance = new Deposits();
        }
        return this._instance;
    }
    private static _instance: Deposits;
    public TonWeb: any;
    public tonwebsdk: any
    constructor() {
        this.TonWeb = window["TonWeb"];
        // this.tonwebsdk = new this.TonWeb(new this.TonWeb.HttpProvider(NODE_API_URL, { apiKey: TONCENTER_API_KEY }));
    }


}