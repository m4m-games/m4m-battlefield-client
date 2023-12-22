import { newUiBase } from "PSDUI/newUiBase";
export class tutorialpc extends newUiBase {
    public static Instance: tutorialpc;
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
    /**修改label  this.title1_lab.label 修改label文字方法*/
    public title1_lab_text(text:string){this.title1_lab.label.text=text;}
    /**修改label  this.close_btn.close1_lab.label 修改label文字方法*/
    public close1_lab_text(text:string){this.close_btn.close1_lab.label.text=text;}
    /**修改label  this.textbg.mouse_lab.label 修改label文字方法*/
    public mouse_lab_text(text:string){this.textbg.mouse_lab.label.text=text;}
    /**修改label  this.textbg.direction_lab.label 修改label文字方法*/
    public direction_lab_text(text:string){this.textbg.direction_lab.label.text=text;}
    /**修改label  this.textbg.shift_lab.label 修改label文字方法*/
    public shift_lab_text(text:string){this.textbg.shift_lab.label.text=text;}
    /**修改label  this.textbg.space_lab.label 修改label文字方法*/
    public space_lab_text(text:string){this.textbg.space_lab.label.text=text;}

 public uiName:string="tutorialpc";

 public gamebg1_img:gamebg1_img=new gamebg1_img();
 public gamebg2_img:gamebg2_img=new gamebg2_img();
 public title1_lab:title1_lab=new title1_lab();
 public close_btn:close_btn=new close_btn();
 public textbg:textbg=new textbg();
}
export class gamebg1_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class gamebg2_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class title1_lab{
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
export class textbg{
 public transform:m4m.framework.transform2D;
 public mouse_lab:mouse_lab=new mouse_lab();
 public direction_lab:direction_lab=new direction_lab();
 public shift_lab:shift_lab=new shift_lab();
 public space_lab:space_lab=new space_lab();
}
export class mouse_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class direction_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class shift_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class space_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
