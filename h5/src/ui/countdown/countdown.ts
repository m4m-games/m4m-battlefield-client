import { newUiBase } from "PSDUI/newUiBase";
export class countdown extends newUiBase {
    public static Instance: countdown;
    public onInit(){
        if (this.onInite) {
            this.onInite();
        }
        //添加按钮事件
        this.bg00_img.buttonbg.button1_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.button1_btn_event, this);
        this.bg00_img.buttonbg.button2_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.button2_btn_event, this);


    }
    //按钮事件
    private button1_btn_event(){if(this.button1_btn_btnEvent)this.button1_btn_btnEvent();};
    /**this.bg00_img.buttonbg.button1_btn.button 的按钮事件*/
    public button1_btn_btnEvent:()=>any;
    private button2_btn_event(){if(this.button2_btn_btnEvent)this.button2_btn_btnEvent();};
    /** 的按钮事件*/
    public button2_btn_btnEvent:()=>any;

    //文字修改方法
    /**修改label 修改label文字方法*/
    public title_lab_text(text:string){this.bg00_img.title_lab.label.text=text;}
    /**修改label 修改label文字方法*/
    public point_lab_text(text:string){this.bg00_img.textbg.point_lab.label.text=text;}
    /**修改label 修改label文字方法*/
    public rank_lab_text(text:string){this.bg00_img.textbg.rank_lab.label.text=text;}
    /**修改label 修改label文字方法*/
    public btntext1_lab_text(text:string){this.bg00_img.buttonbg.button1_btn.btntext1_lab.label.text=text;}
    /**修改label 修改label文字方法*/
    public btntext2_lab_text(text:string){this.bg00_img.buttonbg.button2_btn.btntext2_lab.label.text=text;}

 public uiName:string="countdown";

 public bg:bg=new bg();
 public bg1:bg1=new bg1();
 public bg00_img:bg00_img=new bg00_img();
}
export class bg{
 public transform:m4m.framework.transform2D;
}
export class bg1{
 public transform:m4m.framework.transform2D;
}
export class bg00_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 /***/
 public title_lab:title_lab=new title_lab();
 public textbg:textbg=new textbg();
 public buttonbg:buttonbg=new buttonbg();
}
export class title_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class textbg{
 public transform:m4m.framework.transform2D;
 /***/
 public point_lab:point_lab=new point_lab();
 /***/
 public rank_lab:rank_lab=new rank_lab();
}
export class point_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class rank_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class buttonbg{
 public transform:m4m.framework.transform2D;
 public button1_btn:button1_btn=new button1_btn();
 /***/
 public button2_btn:button2_btn=new button2_btn();
}
export class button1_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
 /***/
 public btntext1_lab:btntext1_lab=new btntext1_lab();
}
export class btntext1_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class button2_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
 /***/
 public btntext2_lab:btntext2_lab=new btntext2_lab();
}
export class btntext2_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
