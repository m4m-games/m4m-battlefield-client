import { newUiBase } from "PSDUI/newUiBase";
export class txtbg extends newUiBase {
    public static Instance: txtbg;
    public onInit(){
        if (this.onInite) {
            this.onInite();
        }
        //添加按钮事件


    }
    //按钮事件

    //文字修改方法
    /**修改label  this.jianbianbg_img.text_lab.label 修改label文字方法*/
    public text_lab_text(text:string){this.jianbianbg_img.text_lab.label.text=text;}

 public uiName:string="txtbg";

 /***/
 public gamebg:gamebg=new gamebg();
 /***/
 public jianbianbg_img:jianbianbg_img=new jianbianbg_img();
}
export class gamebg{
 public transform:m4m.framework.transform2D;
}
export class jianbianbg_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public text_lab:text_lab=new text_lab();
}
export class text_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
