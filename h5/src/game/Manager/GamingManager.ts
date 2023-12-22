import { UiDataManager } from "PSDUI/UiDataManager";
import { BindKeyName } from "../Data/BindKeyName";

export class GamingManager {
    static get Instance() {
        if (this._instance == null) {
            this._instance = new GamingManager();
        }
        return this._instance;
    }
    //头顶血条显示类型 0 不显示, 1 只显示自己, 2 全都显示
    public hpBarVisible: number = 0;
    public data: any[] = [];
    public index: any;
    public datatype: any;
    private static _instance: GamingManager;
    private EyeVerifyBindFun: any;
    private roelgmaingBindFun: any;
    public init() {
        this.roelgmaingBindFun = this. roelgmaingFun.bind(this);
        UiDataManager.bindFunctionData(BindKeyName.roelgming, this.roelgmaingBindFun);
    }

    public roelgmaingFun(list){
        this.data.length = 0;
        this.datatype = null;
        for (let key in list) {
            let obj = list[key];
            this.datatype = list;
            this.data.push(obj);
        }
    }

    public dispose() {
        this.data.length = 0;
        this.datatype = null;
    }
}