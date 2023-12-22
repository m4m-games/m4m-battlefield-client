import { BindKeyName } from "Data/BindKeyName";
import { WaitRoomManager } from "Manager/WaitRoomManager";
import { WoodenPeopleManager } from "Manager/WoodenPeopleManager";
import { UiDataManager } from "PSDUI/UiDataManager";
import { txtbg } from "./txtbg";
/*等待人数界面*/
export class txtbgView extends txtbg {
    public list: any;
    public data: any;
    public max: any;
    public EyeVerifyBindFun: any;
    public ScenarioBindFun: any;
      /** 当前UI是否会影响场景玩家操作 */
      public influenceSceneAction: boolean = false;
    // public data: any[];
    public onInit() {
        super.onInit();
        this.list = WaitRoomManager.Instance.data;
        this.data = WoodenPeopleManager.Instance.data;
        this.max = WaitRoomManager.Instance.max;
        this.newMethod(this.list);
        this.onShow = this.onShowFun.bind(this);
        this.onHide = this.onHideFun.bind(this);
        this.onDispose = this.onDisposeFun.bind(this);
        this.EyeVerifyBindFun = this.EyeVerifyFun.bind(this);
        UiDataManager.bindFunctionData(BindKeyName.EyeVerify, this.EyeVerifyBindFun);
    }

    public onShowFun() {
    }
    public onHideFun() {

    }
    public onDisposeFun() {
        UiDataManager.unBindFunctionData(BindKeyName.EyeVerify, this.EyeVerifyBindFun);
    }

    public EyeVerifyFun(list) {
        this.newMethod(list);
    }
    private newMethod(list: any) {
        let data: any[] = [];
        for (let key in list) {
            let obj = { name: key };
            data.push(obj);
        }
        this.jianbianbg_img.text_lab.label.text = " WAITING FOR OTHER PLAYERS:" + `${data.length}/${this.max}`;
    }

}