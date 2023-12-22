import { StageMgr } from "Core/StageMgr";
import { BindKeyName } from "Data/BindKeyName";
import { CommonUIUtils } from "Data/CommonUIUtils";
import { ViewBaseData } from "Data/ViewBaseData";
import { GamingManager } from "Manager/GamingManager";
import { UIOpenOrHideManager } from "Manager/UIOpenOrHideManager";
import { WaitRoomManager } from "Manager/WaitRoomManager";
import { WoodenPeopleManager } from "Manager/WoodenPeopleManager";
import { PingTimeManager } from "Net/PingTimeManager";
import { UiDataManager } from "PSDUI/UiDataManager";
import { FrameMgr } from "Tools/FrameMgr";
import { gamingView } from "./gamingView";

export class gamingViewData implements ViewBaseData {
    private list: import("Net/PingTimeManager").NetworkQualityType;
    private listekas: boolean = true;
    private main: any = null;
    private NetworkBindFun: any;
    private max: any;
    public data: any;
    public playeData: any;
    public datatype: any;
    public lists: any[] = [];
    public youlist: any[] = [];
    public obj: any[] = [];
    public objset: any[] = [];
    public blone: boolean = false;
    private playerDeath: any;
    private GlassFun: Function;
    public dataType: any[] = [];
    public WoodFun: any;
    public listeat: number;
    public woodate: any[] = [];
    public tiems: any;
    public tygoFun: any;
    public listdata: any;
    public hoodleFun: any;
    public EyeVerifyBindFun: any;
    public listEye: any;
    public dataEye: any;
    public maxEye: any;
    public store: boolean = false;
    public gamingdataFun: any;
    public ScenarioBindFun: any;
    public rolegminaBindFun: any;

    public constructor() {
        this.listEye = WaitRoomManager.Instance.data;
        this.dataEye = WoodenPeopleManager.Instance.data;
        this.maxEye = WaitRoomManager.Instance.max;
        this.playeData = this.playeDataFun.bind(this);
        this.playerDeath = this.roleDeathFun.bind(this);
        this.GlassFun = this.GlassIntegralFun.bind(this);
        this.WoodFun = this.WoodIntegralFun.bind(this);
        this.tygoFun = this.tugOfWarProFun.bind(this);
        this.hoodleFun = this.hoodleItegralFun.bind(this);
        this.EyeVerifyBindFun = this.EyeVerifyFun.bind(this);
        UiDataManager.bindFunctionData(BindKeyName.gamePlayerDead, this.playeData);
        UiDataManager.bindFunctionData(BindKeyName.RoleDeath, this.playerDeath);
        UiDataManager.bindFunctionData(BindKeyName.GlassIntegral, this.GlassFun);
        UiDataManager.bindFunctionData(BindKeyName.WoodIntegral, this.WoodFun);
        UiDataManager.bindFunctionData(BindKeyName.SugarIntegral, this.WoodFun);
        UiDataManager.bindFunctionData(BindKeyName.TugIntegral, this.tygoFun);
        UiDataManager.bindFunctionData(BindKeyName.HoodleIntegral, this.hoodleFun);
        UiDataManager.bindFunctionData(BindKeyName.EyeVerify, this.EyeVerifyBindFun);
        let g_this = gamingView.Instance;
        this.data = GamingManager.Instance.data;
        this.datatype = GamingManager.Instance.datatype;
        this.listdata = GamingManager.Instance.datatype;
        // 信号
        //console.log(this.listdata);
        this.max = WaitRoomManager.Instance.max;
        this.NetworkBindFun = this.NetworkFun.bind(this);
        UiDataManager.bindFunctionData(BindKeyName.Network, this.NetworkBindFun);
        // g_this.slideareabg.slideunit_scr.slideunitcontent.jianbianbg_img.time_lab.label.fontsize = 15;
        g_this.time_lab_text("Your network quality is poor and the game is performing abnormally, please switch to a better network.");
        // this.jianbianbg_img.time_lab.label.text = "Your network quality is poor and the game is performing abnormally, please switch to a better network.";
        g_this.slideareabg.slideunit_scr.slideunitcontent.jianbianbg_img.time_lab.label.color = new m4m.math.color(1, 0, 0);
        g_this.slideareabg.slideunit_scr.slideunitcontent.jianbianbg_img.time_lab.transform.visible = false;
        g_this.slideareabg.slideunit_scr.slideunitcontent.jianbianbg_img.transform.visible = false;
        // console.log(this.data);
        // console.log(GamingManager.Instance.data);
        g_this.rightbg1.transform.visible = false;
        this.newMethods();

    }
    public EyeVerifyFun(listte) {
        this.newMethod(listte);
    }
    public newMethod(listte: any) {
        gamingView.Instance.topbg.transform.visible = true;
        let data: any[] = []
        for (let key in listte) {
            let obj = listte[key];
            data.push(obj);
            this.datatype = listte;
            this.listdata = listte;
            this.data = data;
        }
        if (data) {
            gamingView.Instance.topbg.toplab1_lab.label.text = " WAITING FOR OTHER PLAYERS:" + `${data.length}/${this.maxEye}`;
            if (this.data.length == this.maxEye) {
                if (gamingView.Instance.mygrid == null && gamingView.Instance.rnygrid == null) {
                    // console.log(this.data);
                    gamingView.Instance.topbg.transform.visible = false;
                    this.newMethods();
                }
            }

        }
    }
    private newMethods() {
        let temp: any;
        for (let i = 0; i < this.data.length - 1; i++) {
            for (let j = 0; j < this.data.length - 1 - i; j++) {
                if (Number(this.data[j].num) > Number(this.data[j + 1].num)) {
                    temp = this.data[j + 1];
                    this.data[j + 1] = this.data[j];
                    this.data[j] = temp;
                }
            }
        }
        this.data.forEach((s) => {
            this.obj.push({ name: s, type: false });
        });
        if (this.data.length != 0) {

            // console.log(this.data);
            if (gamingView.Instance.mygrid == null && gamingView.Instance.rnygrid == null) {
                gamingView.Instance.oninfogamingGrid();
                gamingView.Instance.oninforankinglist();
            }
            gamingView.Instance.mygListModel.setSource(this.obj);
            gamingView.Instance.mygrid.setListModel(gamingView.Instance.mygListModel);
            if (this.obj.length > 50) {
                gamingView.Instance.leftbg.leftbg1.leftblack2_img.slide_scr.slidecontent.transform.height = gamingView.Instance.mygrid.getHeight();
                gamingView.Instance.leftbg.leftbg1.leftblack2_img.slide_scr.slidecontent.transform.markDirty();
            }
            // gamingView.Instance.leftblack();
        }
    }
    //单人或多人死亡数据
    public playeDataFun(list) {
        if (list) {
            // console.log(list);
            list.forEach((v) => {
                this.lists.push(v);
            });
            let dataType: any;
            let obj: any[] = [];
            for (let key in this.datatype) {
                for (let i = 0; i < this.lists.length; i++) {
                    let s = this.lists[i];
                    if (s == StageMgr.PlayerGUID) {
                        this.store = true
                    } else {
                        this.store = false;
                    }
                    if (key == s) {
                        obj.push({ name: this.datatype[key], type: true });
                        this.Guimanletdata(obj);
                        this.blone = true;
                        break;
                    } else {
                        this.blone = false;
                    }
                }
                if (this.blone == false) {
                    obj.push({ name: this.datatype[key], type: false });
                }
                dataType = obj;
            }
            if (dataType) {
                let temp: any;
                for (let i = 0; i < dataType.length - 1; i++) {
                    for (let j = 0; j < dataType.length - 1 - i; j++) {
                        if (Number(dataType[j].name.num) > Number(dataType[j + 1].name.num)) {
                            temp = dataType[j + 1];
                            dataType[j + 1] = dataType[j];
                            dataType[j] = temp;
                        }
                    }
                }
                gamingView.Instance.mygListModel.setSource(dataType);
                gamingView.Instance.mygrid.setListModel(gamingView.Instance.mygListModel);
                if (dataType.length > 50) {
                    gamingView.Instance.leftbg.leftbg1.leftblack2_img.slide_scr.slidecontent.transform.height = gamingView.Instance.mygrid.getHeight();
                    gamingView.Instance.leftbg.leftbg1.leftblack2_img.slide_scr.slidecontent.transform.markDirty();
                }
            }
        }
    }
    //玻璃桥死亡分数消失
    private Guimanletdata(obj: any[]) {
        if (this.objset.length != 0) {
            for (let e = 0; e < obj.length; e++) {
                for (let j = 0; j < this.objset.length; j++) {
                    if (this.objset[j].num == obj[e].name.num) {
                        if (obj[e].type == true) {
                            this.objset.splice(j, 1);
                            this.objset.forEach((item, index) => {
                                item.index = index;
                            });
                            if (obj[e].name.playerInfo.token == StageMgr.PlayerGUID) {
                                gamingView.Instance.downlab1_lab_text("");
                            }
                            gamingView.Instance.rnygrListModel.setSource(this.objset);
                            gamingView.Instance.rnygrid.setListModel(gamingView.Instance.rnygrListModel);
                        }
                    }
                }
            }
            for (let s = 0; s < obj.length; s++) {
                for (let l = 0; l < this.dataType.length; l++) {
                    if (this.dataType[l].userToken && obj[s].name.playerInfo.token) {
                        if (obj[s].name.playerInfo.token == this.dataType[l].userToken) {
                            if (obj[s].type == true) {
                                this.dataType.splice(l, 1);
                            }
                        }
                    }
                }
            }
            //console.log("this.dataType", this.dataType);
            // console.log("this.dataType", this.dataType);
        }
    }
    //集体死亡数据
    private roleDeathFun(list) {
        let dataType: any;
        let obj: any[] = [];
        for (let key in this.datatype) {
            for (let s in list) {
                let liste = list[s];
                if (key == liste.token) {
                    obj.push({ name: this.datatype[key], type: true });
                    this.blone = true;
                    break;
                } else {
                    this.blone = false;
                }
            }
            if (this.blone == false) {
                obj.push({ name: this.datatype[key], type: false });
            }
            dataType = obj;
        }
        let temp: any;
        for (let i = 0; i < dataType.length - 1; i++) {
            for (let j = 0; j < dataType.length - 1 - i; j++) {
                if (dataType[j].name.num > dataType[j + 1].name.num) {
                    temp = dataType[j + 1];
                    dataType[j + 1] = dataType[j];
                    dataType[j] = temp;
                }
            }
        }
        gamingView.Instance.downlab1_lab_text("");
        gamingView.Instance.mygListModel.setSource(dataType);
        gamingView.Instance.mygrid.setListModel(gamingView.Instance.mygListModel);
        if (dataType.length > 40) {
            gamingView.Instance.leftbg.leftbg1.leftblack2_img.slide_scr.slidecontent.transform.height = gamingView.Instance.mygrid.getHeight();
            gamingView.Instance.leftbg.leftbg1.leftblack2_img.slide_scr.slidecontent.transform.markDirty();
        }


    }
    //玻璃桥数据积分榜数据
    public GlassIntegralFun(data) {
        // console.log(this.listdata);
        if (data) {
            this.objset.length = 0;
            if (data.userToken && data.point != 99) {
                this.dataType.push(data);
            }
            for (let i = 0; i < this.dataType.length; i++) {
                let liste = this.dataType[i];
                for (let key in this.listdata) {
                    if (key == liste.userToken) {
                        if (Math.floor(liste.point / 100) != 0) {
                            let lista = new Integrlse();
                            lista.num = this.listdata[key].num;
                            lista.timeintegr = "Score: " + Math.floor(liste.point / 100);
                            lista.time = liste.point
                            this.objset.push(lista)
                        }
                        if (liste.userToken == StageMgr.PlayerGUID) {
                            gamingView.Instance.downlab1_lab_text("Your score:" + Math.floor(liste.point / 100));
                        }
                    }
                }
            }
            if (this.objset.length > 1) {
                for (let i = 0; i < this.objset.length; i++) {
                    let s = 1;
                    for (let j = 0; j < this.objset.length; j++) {
                        if (this.objset[j + s]) {
                            if (Number(this.objset[i].num) == Number(this.objset[j + s].num)) {
                                if (this.objset[i].time > this.objset[j + s].time) {
                                    this.objset.splice(j + s, 1);
                                } else {
                                    if (this.objset[i].time != this.objset[j + s].time) {
                                        this.objset.splice(i, 1);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (this.dataType.length > 1) {
                for (let i = 0; i < this.dataType.length - 1; i++) {
                    let s = 1;
                    for (let j = 0; j < this.dataType.length; j++) {
                        if (this.dataType[j + s]) {
                            if (this.dataType[i].userToken == this.dataType[j + s].userToken) {
                                if (this.dataType[i].point > this.dataType[j + s].point) {
                                    this.dataType.splice(j + s, 1);
                                } else {
                                    if (this.dataType[i].point != this.dataType[j + s].point) {
                                        this.dataType.splice(i, 1);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            let temp: any;
            for (let i = 0; i < this.objset.length - 1; i++) {
                for (let j = 0; j < this.objset.length - 1 - i; j++) {
                    if (this.objset[j + 1].time > 1) {
                        if (this.objset[j].time < this.objset[j + 1].time) {
                            temp = this.objset[j + 1];
                            this.objset[j + 1] = this.objset[j];
                            this.objset[j] = temp;
                        }
                    }
                }
            }
            this.objset.forEach((item, index) => {
                item.index = index;
            });
            gamingView.Instance.rnygrListModel.setSource(this.objset);
            gamingView.Instance.rnygrid.setListModel(gamingView.Instance.rnygrListModel);
        }
    }
    //木头人和糖饼积分榜数据
    public WoodIntegralFun(data) {
        if (data) {
            this.youlist.push(data[0]);
            let atesae: any[] = [];
            for (let i = 0; i < this.youlist.length; i++) {
                let liste = this.youlist[i];
                let lisetat = liste.pingTime / 1000;
                let lista = new Integrlse();
                lista.num = liste.num;
                lista.timeintegr = "Finish time: " + lisetat.toFixed(2) + " S";
                lista.time = lisetat.toFixed(2);
                atesae.push(lista);
                if (liste.playerInfo.token == StageMgr.PlayerGUID) {
                    gamingView.Instance.downlab1_lab_text("Your score:" + lisetat.toFixed(2) + " S");
                }
                lista = null;
            }
            let temp: any;
            for (let i = 0; i < atesae.length - 1; i++) {
                for (let j = 0; j < atesae.length - 1 - i; j++) {
                    if (Number(atesae[j].time) > Number(atesae[j + 1].time)) {
                        temp = atesae[j + 1];
                        atesae[j + 1] = atesae[j];
                        atesae[j] = temp;
                    }
                }
            }

            atesae.forEach((item, index) => {
                item.index = index;
            });
            gamingView.Instance.rnygrListModel.setSource(atesae);
            gamingView.Instance.rnygrid.setListModel(gamingView.Instance.rnygrListModel);
        }
    }
    //拔河积分榜数据
    public tugOfWarProFun(data) {
        if (data) {
            if (data.usersPoint) {
                let ates: any[] = [];
                let tesal = JSON.parse(data.usersPoint);
                for (let key in this.listdata) {
                    for (let k in tesal) {
                        if (key == k) {
                            let lista = new Integrlse();
                            lista.num = this.listdata[k].num;
                            lista.timeintegr = "Score: " + tesal[k];
                            lista.time = tesal[k];
                            //lista.count =
                            ates.push(lista);
                            lista = null;
                        }
                        if (key == StageMgr.PlayerGUID) {
                            gamingView.Instance.downlab1_lab_text("Your score:" + tesal[key].toString());
                        }
                    }
                }
                let temp: any;
                for (let i = 0; i < ates.length - 1; i++) {
                    for (let j = 0; j < ates.length - 1 - i; j++) {
                        if (Number(ates[j].time) < Number(ates[j + 1].time)) {
                            temp = ates[j + 1];
                            ates[j + 1] = ates[j];
                            ates[j] = temp;
                        }
                    }
                }
                ates.forEach((item, index) => {
                    item.index = index;
                });
                gamingView.Instance.rnygrListModel.setSource(ates);
                gamingView.Instance.rnygrid.setListModel(gamingView.Instance.rnygrListModel);
            }
        }
    }
    //弹珠积分榜数据
    public hoodleItegralFun(data) {
        if (data.dropPoint) {
            if (data.OddNumber) {
                let atesae: any[] = []
                let lista = new Integrlse();
                lista.num = "Marbles in the judging";
                lista.timeintegr = "  area:" + data.OddNumber;
                lista.time = data.OddNumber;
                lista.count = "1";
                atesae.push(lista);
                gamingView.Instance.rnygrListModel.setSource(atesae);
                gamingView.Instance.rnygrid.setListModel(gamingView.Instance.rnygrListModel);
            }
        }
    }
    public dispose() {
        UiDataManager.unBindFunctionData(BindKeyName.gamePlayerDead, this.playeData);
        UiDataManager.unBindFunctionData(BindKeyName.RoleDeath, this.playerDeath);
        UiDataManager.unBindFunctionData(BindKeyName.GlassIntegral, this.GlassFun);
        UiDataManager.unBindFunctionData(BindKeyName.WoodIntegral, this.WoodFun);
        UiDataManager.unBindFunctionData(BindKeyName.SugarIntegral, this.WoodFun);
        UiDataManager.unBindFunctionData(BindKeyName.TugIntegral, this.tygoFun);
        UiDataManager.unBindFunctionData(BindKeyName.EyeVerify, this.EyeVerifyBindFun);
        GamingManager.Instance.dispose();
        this.dataType.length = 0;
        this.objset.length = 0;
        this.obj.length = 0;
        this.youlist.length = 0;
        this.data = null;
        this.listdata = null;
    }
    // 信号
    public NetworkFun(data) {
        gamingView.Instance.rightbg1.transform.visible = true;
        this.list = PingTimeManager.Instance.getNetworkQuality();
        this.showlist(this.list);
        this.showdata(data);
    }
    public showlist(list) {
        let g_this = gamingView.Instance;
        if (list == 1) {
            let iconType = gamingView.Instance.uiName + ".atlas.json_signalg";
            g_this.rightbg1.signal_img.image.sprite = CommonUIUtils.getSprite(iconType);
        } else if (list == 2) {
            let iconType = gamingView.Instance.uiName + ".atlas.json_signalo";
            g_this.rightbg1.signal_img.image.sprite = CommonUIUtils.getSprite(iconType);
        } else {
            let iconType = gamingView.Instance.uiName + ".atlas.json_signalr";
            g_this.rightbg1.signal_img.image.sprite = CommonUIUtils.getSprite(iconType);
            this.listeka(list);
        }
    }
    public listeka(list) {
        let g_this = gamingView.Instance;
        if (list == 3) {
            if (this.listekas == true) {
                g_this.slideareabg.slideunit_scr.slideunitcontent.jianbianbg_img.transform.visible = true;
                g_this.slideareabg.slideunit_scr.slideunitcontent.jianbianbg_img.time_lab.transform.visible = true;
                FrameMgr.Add(this.carousel, this);
            }
        }
    }
    public carousel() {
        let g_this = gamingView.Instance;
        let listes = g_this.slideareabg.transform.width + 500;
        let listt: any;
        let late: any;
        listt = Math.floor(listes);
        if (listt % 2 != 0) {
            late = listt + 1;
        } else {
            late = Math.floor(listes);
        }
        let count;
        if (this.main == null) {
            count = late - 2;
            this.main = count;
        } else {
            if (this.main != -600) {
                count = this.main - 2;
                this.main = count;
                this.listekas = false
            } else {
                this.main = late;
                FrameMgr.Remove(this.carousel, this);
                g_this.slideareabg.slideunit_scr.slideunitcontent.jianbianbg_img.transform.visible = false;
                g_this.slideareabg.slideunit_scr.slideunitcontent.jianbianbg_img.time_lab.transform.visible = false;
                this.listekas = true;
            }
        }
        g_this.slideareabg.slideunit_scr.slideunitcontent.jianbianbg_img.time_lab.transform.setLayoutValue(m4m.framework.layoutOption.LEFT, count);
        g_this.slideareabg.slideunit_scr.slideunitcontent.jianbianbg_img.time_lab.transform.markDirty();
    }
    public showdata(data) {
        let g_this = gamingView.Instance;
        if (data <= 100) {
            g_this.ms_lab_text(data + "ms");
            g_this.rightbg1.ms_lab.label.color = new m4m.math.color(0, 1, 0, 1);
        } else if (data <= 200 && data > 100) {
            g_this.ms_lab_text(data + "ms");
            g_this.rightbg1.ms_lab.label.color = new m4m.math.color(1, 1, 0, 1);
        } else {
            g_this.ms_lab_text(data + "ms");
            g_this.rightbg1.ms_lab.label.color = new m4m.math.color(1, 0, 0, 1);
        }
    }
}
export class Integrlse {
    count: string;
    num: string;
    timeintegr: string;
    time: string
}