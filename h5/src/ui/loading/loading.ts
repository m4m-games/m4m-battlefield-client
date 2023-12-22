import { newUiBase } from "PSDUI/newUiBase";
export class loading extends newUiBase {
    public static Instance: loading;
    public onInit(){
        if (this.onInite) {
            this.onInite();
        }
        //添加按钮事件


    }
    //按钮事件

    //文字修改方法

 public uiName:string="loading";

 /***/
 public gamebg_img:gamebg_img=new gamebg_img();
 public title1_img:title1_img=new title1_img();
 public title2_img:title2_img=new title2_img();
}
export class gamebg_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class title1_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class title2_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
