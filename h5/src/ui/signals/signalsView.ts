import { BindKeyName } from "Data/BindKeyName";
import { CommonUIUtils } from "Data/CommonUIUtils";
import { PingTimeManager } from "Net/PingTimeManager";
import { UiDataManager } from "PSDUI/UiDataManager";
import { uiLayerType } from "PSDUI/UiManager";
import { commTool } from "Tools/commTool";
import { FrameMgr } from "Tools/FrameMgr";
import { imgSpriteArrange } from "UIBase/imgSpriteArrange";
import { signals } from "./signals";
/*信号界面*/
export class signalsView extends signals {
    public uiLayer = uiLayerType.poplayer;
    public NetworkBindFun: any;
    public list: import("Net/PingTimeManager").NetworkQualityType;
    public proNumImg: imgSpriteArrange;
    public main: any;
    public datset: any;
    public listekas: boolean = true;
    public liste: number;
    public manxse: number = 0;
    /** 当前UI是否会影响场景玩家操作 */
    public influenceSceneAction: boolean = false;
    public onInit() {
        super.onInit();
        this.NetworkBindFun = this.NetworkFun.bind(this);
        UiDataManager.bindFunctionData(BindKeyName.Network, this.NetworkBindFun);
        this.signalbg.number_img.transform.visible = false;
        this.proNumImg = CommonUIUtils.getImgSpriteArrange(this.signalbg.number_img.image, m4m.framework.layoutOption.LEFT, m4m.framework.layoutOption.V_CENTER);
        this.time_lab.label.text = "Your network quality is poor and the game is performing abnormally, please switch to a better network.";
        this.time_lab.label.color = new m4m.math.color(1, 0, 0);
        this.time_lab.transform.visible = false;
        this.jianbianbg_img.transform.visible = false;
    }
    public NetworkFun(data) {
        this.list = PingTimeManager.Instance.getNetworkQuality();
        this.showlist(this.list);
        this.showdata(data);
    }
    public showlist(list) {
        if (list == 1) {
            let iconType = signalsView.Instance.uiName + ".atlas.json_signalg";
            this.signalbg.signal_img.image.sprite = CommonUIUtils.getSprite(iconType);
        } else if (list == 2) {
            let iconType = signalsView.Instance.uiName + ".atlas.json_signalo";
            this.signalbg.signal_img.image.sprite = CommonUIUtils.getSprite(iconType);
        } else {
            let iconType = signalsView.Instance.uiName + ".atlas.json_signalr";
            this.signalbg.signal_img.image.sprite = CommonUIUtils.getSprite(iconType);
            this.listeka(list);
        }
    }

    public showdata(data) {
        if (data <= 100) {
            this.proNumImg.setNum(data);
            let list = new m4m.math.color(0, 1, 0, 1);
            this.proNumImg.setColor(list);
            this.signalbg.ms_img.image.color = new m4m.math.color(0, 1, 0);
        } else if (data <= 200 && data > 100) {
            this.proNumImg.setNum(data);
            let list = new m4m.math.color(1, 1, 0, 1);
            this.proNumImg.setColor(list);
            this.signalbg.ms_img.image.color = new m4m.math.color(1, 1, 0);
        } else {
            this.proNumImg.setNum(data);
            let list = new m4m.math.color(1, 0, 0, 1);
            this.proNumImg.setColor(list);
            this.signalbg.ms_img.image.color = new m4m.math.color(1, 0, 0);
        }
        this.signalbg.ms_img.transform.setLayoutValue(m4m.framework.layoutOption.LEFT, this.proNumImg.transform.width + 3);
        this.signalbg.ms_img.transform.markDirty();
    }

    public carousel() {
        let listes = this.gamebg.transform.width + 300;
        let late: any;
        let listt: any;
        listt = Math.floor(listes);
        if (listt % 2 != 0) {
            late = listt + 1;
        } else {
            late = Math.floor(listes);
        }
        let count: any;
        let main: number;
        let manxse: number = 0;
        if (this.liste == 1) {
            manxse = 1;
        } else if (this.liste == 2) {
            manxse = 2;
        }
        if (this.main == null) {
            count = late - 2;
            this.main = count;
        } else {
            if (this.main != -600) {
                count = this.main - 2;
                this.main = count;
            } else {
                this.main = late;
                main = manxse + 1;
                this.liste = main;
            }
        }
        if (this.liste == 3) {
            FrameMgr.Remove(this.carousel, this);
            this.jianbianbg_img.transform.visible = false;
            this.time_lab.transform.visible = false;
            this.listekas = true;
            this.liste = 0;
        } else if (this.liste == 1) {
            this.jianbianbg_img.transform.visible = true;
            this.time_lab.transform.visible = true;
            this.listekas = false;
        }
        this.time_lab.transform.setLayoutValue(m4m.framework.layoutOption.LEFT, count);
        this.time_lab.transform.markDirty();
    }
    public listeka(list) {
        if (list == 3) {
            if (this.listekas == true) {
                this.jianbianbg_img.transform.visible = true;
                this.time_lab.transform.visible = true;
                FrameMgr.Add(this.carousel, this);
            }
        }
    }
}