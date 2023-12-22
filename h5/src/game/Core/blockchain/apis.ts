export interface IBind1Params {
    addr: string;
    tid: string;
    sig?: string;
    platform: string;
    chain_name: string;
    pubkey?: string;
}
export interface IBindResultData {
    addr: string;
    tid: string;
    platform: string;
    content_id?: string;
}

//kQCX0QroaE8O8AYcj6_ZWpqkZ0njJQBzxcELld-x97Fyp0gc
export interface IGetBindResultParams {
    addr?: string;
    tid?: string;
}
export const CHAIN_NAME = "TONtest"
export const PLATFORM = "Telegram";
export class apis {
    public static get Instance(): apis {
        if (this._instance == null) {
            this._instance = new apis();
        }
        return this._instance;
    }

    // tslint:disable-next-line: member-ordering
    public axios: any;

    // tslint:disable-next-line: variable-name
    public gapIndex: number = 50;

    public async

    constructor() {
        this.axios = window["axios"];
    }
    private static _instance: apis;

    private API_HOST: string = 'https://apiv2-test.platwin.io/api/v1'

    public async bind1WithWeb3Proof(params: IBind1Params) {
        const url = `${this.API_HOST}/bind-addr`;
        let res = await this.axios.post(url, params, { headers: { authorization: "TG Robot Platwin Soda" } });
        if (res.error) { return false }
        return true;
    };

    public async getBindResult(params: IGetBindResultParams) {
        const url = `${this.API_HOST}/bind-attr?tid=${params.tid}`;
        const res = await this.axios.get(url);
        console.log("[core-account] getBindResult: ", params, res);
        if (res.error) return [];
        return res.data.data as IBindResultData[];
    }

    public async unbind(params: {
        addr: string;
        tid: string;
        sig?: string;
        pubkey?: string;
        platform?: string;
        chain_name?: string;
    }) {
        params.platform = PLATFORM;
        params.chain_name = CHAIN_NAME;
        const url = `${this.API_HOST}/unbind-addr`;
        const res = await this.axios.post(url, params, { headers: { authorization: "TG Robot Platwin Soda" } });
        console.debug("[core-account] unbindAddr: ", params, res);
        if (res.error) return false;
        return true;
    }
}