import { newUiBase } from "PSDUI/newUiBase";
export class rocker extends newUiBase {
    public static Instance: rocker;
    public onInit(){
        if (this.onInite) {
            this.onInite();
        }
        //添加按钮事件
        this.buttonb2_img.buttona1_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.buttona1_btn_event, this);
        this.buttonb2_img.knifea_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.knifea_btn_event, this);
        this.buttonb2_img.bara_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.bara_btn_event, this);
        this.buttonb_img.buttona_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.buttona_btn_event, this);
        this.rockbg_img.rock_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.rock_btn_event, this);


    }
    //按钮事件
    private buttona1_btn_event(){if(this.buttona1_btn_btnEvent)this.buttona1_btn_btnEvent();};
    /**this.buttonb2_img.buttona1_btn.button 的按钮事件*/
    public buttona1_btn_btnEvent:()=>any;
    private knifea_btn_event(){if(this.knifea_btn_btnEvent)this.knifea_btn_btnEvent();};
    /**this.buttonb2_img.knifea_btn.button 的按钮事件*/
    public knifea_btn_btnEvent:()=>any;
    private bara_btn_event(){if(this.bara_btn_btnEvent)this.bara_btn_btnEvent();};
    /**this.buttonb2_img.bara_btn.button 的按钮事件*/
    public bara_btn_btnEvent:()=>any;
    private buttona_btn_event(){if(this.buttona_btn_btnEvent)this.buttona_btn_btnEvent();};
    /**this.buttonb_img.buttona_btn.button 的按钮事件*/
    public buttona_btn_btnEvent:()=>any;
    private rock_btn_event(){if(this.rock_btn_btnEvent)this.rock_btn_btnEvent();};
    /**this.rockbg_img.rock_btn.button 的按钮事件*/
    public rock_btn_btnEvent:()=>any;

    //文字修改方法
    /**修改label  this.buttonb2_img.cd_lab.label 修改label文字方法*/
    public cd_lab_text(text:string){this.buttonb2_img.cd_lab.label.text=text;}

 public uiName:string="rocker";

 public buttonb2_img:buttonb2_img=new buttonb2_img();
 public buttonb_img:buttonb_img=new buttonb_img();
 public rockbg_img:rockbg_img=new rockbg_img();
}
export class buttonb2_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public buttona1_btn:buttona1_btn=new buttona1_btn();
 public knifeb_img:knifeb_img=new knifeb_img();
 public knifea_btn:knifea_btn=new knifea_btn();
 public barb_img:barb_img=new barb_img();
 public bara_btn:bara_btn=new bara_btn();
 /***/
 public barcd_img:barcd_img=new barcd_img();
 public cd_lab:cd_lab=new cd_lab();
}
export class buttona1_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
}
export class knifeb_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class knifea_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
}
export class barb_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class bara_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
}
export class barcd_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class cd_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class buttonb_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public buttona_btn:buttona_btn=new buttona_btn();
}
export class buttona_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
}
export class rockbg_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public rock_btn:rock_btn=new rock_btn();
}
export class rock_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
}
