import { newUiBase } from "PSDUI/newUiBase";
export class connect extends newUiBase {
    public static Instance: connect;
    public onInit(){
        if (this.onInite) {
            this.onInite();
        }
        //添加按钮事件
        this.gamebg4_img.connect1_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.connect1_btn_event, this);
        this.gamebg4_img.cancle_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.cancle_btn_event, this);


    }
    //按钮事件
    private connect1_btn_event(){if(this.connect1_btn_btnEvent)this.connect1_btn_btnEvent();};
    /**this.gamebg4_img.connect1_btn.button 的按钮事件*/
    public connect1_btn_btnEvent:()=>any;
    private cancle_btn_event(){if(this.cancle_btn_btnEvent)this.cancle_btn_btnEvent();};
    /**this.gamebg4_img.cancle_btn.button 的按钮事件*/
    public cancle_btn_btnEvent:()=>any;

    //文字修改方法
    /**修改label  this.gamebg4_img.connect1_btn.connecttext1_lab.label 修改label文字方法*/
    public connecttext1_lab_text(text:string){this.gamebg4_img.connect1_btn.connecttext1_lab.label.text=text;}
    /**修改label  this.gamebg4_img.connect1_btn.text2_lab.label 修改label文字方法*/
    public text2_lab_text(text:string){this.gamebg4_img.connect1_btn.text2_lab.label.text=text;}
    /**修改label  this.gamebg4_img.cancle_btn.cancletext1_lab.label 修改label文字方法*/
    public cancletext1_lab_text(text:string){this.gamebg4_img.cancle_btn.cancletext1_lab.label.text=text;}
    /**修改label  this.gamebg4_img.cancle_btn.text1_lab.label 修改label文字方法*/
    public text1_lab_text(text:string){this.gamebg4_img.cancle_btn.text1_lab.label.text=text;}

 public uiName:string="connect";

 public gamebg3_img:gamebg3_img=new gamebg3_img();
 public gamebg4_img:gamebg4_img=new gamebg4_img();
}
export class gamebg3_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class gamebg4_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public connect1_btn:connect1_btn=new connect1_btn();
 public cancle_btn:cancle_btn=new cancle_btn();
 /***/
 public buttonbg:buttonbg=new buttonbg();
}
export class connect1_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
 public connecttext1_lab:connecttext1_lab=new connecttext1_lab();
 public text2_lab:text2_lab=new text2_lab();
}
export class connecttext1_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class text2_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class cancle_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
 public cancletext1_lab:cancletext1_lab=new cancletext1_lab();
 public text1_lab:text1_lab=new text1_lab();
}
export class cancletext1_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class text1_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class buttonbg{
 public transform:m4m.framework.transform2D;
 public button1_img:button1_img=new button1_img();
}
export class button1_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public icon_img:icon_img=new icon_img();
}
export class icon_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
