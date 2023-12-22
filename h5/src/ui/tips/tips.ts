import { newUiBase } from "PSDUI/newUiBase";
export class tips extends newUiBase {
    public static Instance: tips;
    public onInit(){
        if (this.onInite) {
            this.onInite();
        }
        //添加按钮事件
        this.heroallbg_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.heroallbg_btn_event, this);


    }
    //按钮事件
    private heroallbg_btn_event(){if(this.heroallbg_btn_btnEvent)this.heroallbg_btn_btnEvent();};
    /**this.heroallbg_btn.button 的按钮事件*/
    public heroallbg_btn_btnEvent:()=>any;

    //文字修改方法
    /**修改label 文字显示修改label文字方法*/
    public text2_lab_text(text:string){this.gamebg1_img.text2_lab.label.text=text;}
    /**修改label 文字显示修改label文字方法*/
    public text1_lab_text(text:string){this.gamebg2_img.text1_lab.label.text=text;}

 public uiName:string="tips";

 public heroallbg_btn:heroallbg_btn=new heroallbg_btn();
 /***/
 public gamebg1_img:gamebg1_img=new gamebg1_img();
 /***/
 public gamebg2_img:gamebg2_img=new gamebg2_img();
}
export class heroallbg_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
}
export class gamebg1_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 /**文字显示*/
 public text2_lab:text2_lab=new text2_lab();
}
export class text2_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class gamebg2_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 /**文字显示*/
 public text1_lab:text1_lab=new text1_lab();
}
export class text1_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
