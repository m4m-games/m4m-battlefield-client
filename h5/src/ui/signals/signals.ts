import { newUiBase } from "PSDUI/newUiBase";
export class signals extends newUiBase {
    public static Instance: signals;
    public onInit(){
        if (this.onInite) {
            this.onInite();
        }
        //添加按钮事件


    }
    //按钮事件

    //文字修改方法
    /**修改label 倒计时修改label文字方法*/
    public time_lab_text(text:string){this.time_lab.label.text=text;}

 public uiName:string="signals";

 /***/
 public gamebg:gamebg=new gamebg();
 public jianbianbg_img:jianbianbg_img=new jianbianbg_img();
 /**倒计时*/
 public time_lab:time_lab=new time_lab();
 public signalbg:signalbg=new signalbg();
}
export class gamebg{
 public transform:m4m.framework.transform2D;
}
export class jianbianbg_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class time_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class signalbg{
 public transform:m4m.framework.transform2D;
 public signal_img:signal_img=new signal_img();
 public number_img:number_img=new number_img();
 public ms_img:ms_img=new ms_img();
}
export class signal_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class number_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class ms_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
