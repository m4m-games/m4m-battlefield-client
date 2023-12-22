import { newUiBase } from "PSDUI/newUiBase";
export class test extends newUiBase {
    public static Instance: test;
    public onInit(){
        if (this.onInite) {
            this.onInite();
        }
        //添加按钮事件
        this.button1_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.button1_btn_event, this);


    }
    //按钮事件
    private button1_btn_event(){if(this.button1_btn_btnEvent)this.button1_btn_btnEvent();};
    /** 的按钮事件*/
    public button1_btn_btnEvent:()=>any;

    //文字修改方法
    /**修改label 正在输入文字修改label文字方法*/
    public text1_lab_text(text:string){this.rect1_inp.text1_lab.label.text=text;}
    /**修改label 输入文字修改label文字方法*/
    public text2_lab_text(text:string){this.rect1_inp.text2_lab.label.text=text;}

 public uiName:string="test";

 /***/
 public gamebg_img:gamebg_img=new gamebg_img();
 /***/
 public button1_btn:button1_btn=new button1_btn();
 /**竖向滑动*/
 public rect1_inp:rect1_inp=new rect1_inp();
}
export class gamebg_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class button1_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
}
export class rect1_inp{
 public transform:m4m.framework.transform2D;
 public inputField:m4m.framework.inputField;
 /***/
 public inputbg_img:inputbg_img=new inputbg_img();
 /**正在输入文字*/
 public text1_lab:text1_lab=new text1_lab();
 /**输入文字*/
 public text2_lab:text2_lab=new text2_lab();
}
export class inputbg_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class text1_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class text2_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
