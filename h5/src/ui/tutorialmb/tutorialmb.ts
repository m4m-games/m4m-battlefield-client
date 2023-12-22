import { newUiBase } from "PSDUI/newUiBase";
export class tutorialmb extends newUiBase {
    public static Instance: tutorialmb;
    public onInit(){
        if (this.onInite) {
            this.onInite();
        }
        //添加按钮事件
        this.close_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.close_btn_event, this);


    }
    //按钮事件
    private close_btn_event(){if(this.close_btn_btnEvent)this.close_btn_btnEvent();};
    /**this.close_btn.button 的按钮事件*/
    public close_btn_btnEvent:()=>any;

    //文字修改方法
    /**修改label  this.walkbg.walk3_lab.label 修改label文字方法*/
    public walk3_lab_text(text:string){this.walkbg.walk3_lab.label.text=text;}
    /**修改label  this.runbg.run3_lab.label 修改label文字方法*/
    public run3_lab_text(text:string){this.runbg.run3_lab.label.text=text;}
    /**修改label  this.jumpbg.jump1_lab.label 修改label文字方法*/
    public jump1_lab_text(text:string){this.jumpbg.jump1_lab.label.text=text;}
    /**修改label  this.close_btn.close1_lab.label 修改label文字方法*/
    public close1_lab_text(text:string){this.close_btn.close1_lab.label.text=text;}
    /**修改label  this.title1_lab.label 修改label文字方法*/
    public title1_lab_text(text:string){this.title1_lab.label.text=text;}

 public uiName:string="tutorialmb";

 public gamebg1_img:gamebg1_img=new gamebg1_img();
 public 底盘:底盘=new 底盘();
 public walkbg:walkbg=new walkbg();
 public runbg:runbg=new runbg();
 public jumpbg:jumpbg=new jumpbg();
 public close_btn:close_btn=new close_btn();
 public title1_lab:title1_lab=new title1_lab();
}
export class gamebg1_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class 底盘{
 public transform:m4m.framework.transform2D;
 public 摇杆:摇杆=new 摇杆();
}
export class 摇杆{
 public transform:m4m.framework.transform2D;
}
export class walkbg{
 public transform:m4m.framework.transform2D;
 public walk2_img:walk2_img=new walk2_img();
 public walk1_img:walk1_img=new walk1_img();
 public walk3_lab:walk3_lab=new walk3_lab();
}
export class walk2_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class walk1_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class walk3_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class runbg{
 public transform:m4m.framework.transform2D;
 public run2_img:run2_img=new run2_img();
 public run1_img:run1_img=new run1_img();
 public run3_lab:run3_lab=new run3_lab();
}
export class run2_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class run1_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class run3_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class jumpbg{
 public transform:m4m.framework.transform2D;
 public jump2_img:jump2_img=new jump2_img();
 public jump1_lab:jump1_lab=new jump1_lab();
}
export class jump2_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class jump1_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class close_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
 public close1_lab:close1_lab=new close1_lab();
}
export class close1_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class title1_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
