import { newUiBase } from "PSDUI/newUiBase";
export class gaming extends newUiBase {
    public static Instance: gaming;
    public onInit(){
        if (this.onInite) {
            this.onInite();
        }
        //添加按钮事件
        this.leftbg.arrowbtn1_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.arrowbtn1_btn_event, this);
        this.leftbg.leftbg1.listbutton_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.listbutton_btn_event, this);

    }
    //按钮事件
    private arrowbtn1_btn_event(){if(this.arrowbtn1_btn_btnEvent)this.arrowbtn1_btn_btnEvent();};
    /**this.leftbg.arrowbtn1_btn.button 的按钮事件*/
    public arrowbtn1_btn_btnEvent:()=>any;
    private listbutton_btn_event(){if(this.listbutton_btn_btnEvent)this.listbutton_btn_btnEvent();};
    /**this.leftbg.leftbg1.listbutton_btn.button 的按钮事件*/
    public listbutton_btn_btnEvent:()=>any;

    //文字修改方法
    /**修改label 名字修改label文字方法*/
    public name_lab_text(text:string){this.statebg.name_lab.label.text=text;}
    /**修改label  this.leftbg.leftbg1.leftblack1_img.downbg_img.downlab1_lab.label 修改label文字方法*/
    public downlab1_lab_text(text:string){this.leftbg.leftbg1.leftblack1_img.downbg_img.downlab1_lab.label.text=text;}
    /**修改label  this.leftbg.leftbg1.leftblack1_img.downbg_img.leftdownblack_img.leftdownlab_lab.label 修改label文字方法*/
    public leftdownlab_lab_text(text:string){this.leftbg.leftbg1.leftblack1_img.downbg_img.leftdownblack_img.leftdownlab_lab.label.text=text;}
    /**修改label  this.leftbg.leftbg1.leftblack1_img.downbg_img.downlabbg.downlab2_lab.label 修改label文字方法*/
    public downlab2_lab_text(text:string){this.leftbg.leftbg1.leftblack1_img.downbg_img.downlabbg.downlab2_lab.label.text=text;}
    /**修改label  this.leftbg.leftbg1.leftblack1_img.downbg_img.downlabbg.downlab3_lab.label 修改label文字方法*/
    public downlab3_lab_text(text:string){this.leftbg.leftbg1.leftblack1_img.downbg_img.downlabbg.downlab3_lab.label.text=text;}
    /**修改label  this.leftbg.leftbg1.leftblack1_img.downbg_img.downlabbg.downlab4_lab.label 修改label文字方法*/
    public downlab4_lab_text(text:string){this.leftbg.leftbg1.leftblack1_img.downbg_img.downlabbg.downlab4_lab.label.text=text;}
    /**修改label 玩家名单修改label文字方法*/
    public lefttoplab_lab_text(text:string){this.leftbg.leftbg1.leftblack2_img.lefttopbg.lefttoplab_lab.label.text=text;}
    /**修改label 存活修改label文字方法*/
    public lefttoplab1_lab_text(text:string){this.leftbg.leftbg1.leftblack2_img.lefttopbg.lefttoprgbg.lefttoplab1_lab.label.text=text;}
    /**修改label 死亡修改label文字方法*/
    public lefttoplab2_lab_text(text:string){this.leftbg.leftbg1.leftblack2_img.lefttopbg.lefttoprgbg.lefttoplab2_lab.label.text=text;}
    /**修改label 死亡编号修改label文字方法*/
    public deathnumber_lab_text(text:string){this.leftbg.leftbg1.leftblack2_img.slide_scr.slidecontent.numberbg.deathnumber_lab.label.text=text;}
    /**修改label 存活编号修改label文字方法*/
    public alivenumber_lab_text(text:string){this.leftbg.leftbg1.leftblack2_img.slide_scr.slidecontent.numberbg.deathnumber_lab.alivenumber_lab.label.text=text;}
    /**修改label  this.rightbg1.ms_lab.label 修改label文字方法*/
    public ms_lab_text(text:string){this.rightbg1.ms_lab.label.text=text;}
    /**修改label 修改label文字方法*/
    public toplab1_lab_text(text:string){this.topbg.toplab1_lab.label.text=text;}
    /**修改label 修改label文字方法*/
    public time_lab_text(text:string){this.slideareabg.slideunit_scr.slideunitcontent.jianbianbg_img.time_lab.label.text=text;}

 public uiName:string="gaming";

 public gamingbg:gamingbg=new gamingbg();
 public redmask_img:redmask_img=new redmask_img();
 /***/
 public statebg:statebg=new statebg();
 public leftbg:leftbg=new leftbg();
 public rightbg1:rightbg1=new rightbg1();
 public topbg:topbg=new topbg();
 public slideareabg:slideareabg=new slideareabg();
}
export class gamingbg{
 public transform:m4m.framework.transform2D;
}
export class redmask_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class statebg{
 public transform:m4m.framework.transform2D;
 /***/
 public blood5_bar:blood5_bar=new blood5_bar();
 public bloodbg_img:bloodbg_img=new bloodbg_img();
 public blood3_img:blood3_img=new blood3_img();
 public blood2_img:blood2_img=new blood2_img();
 public blood1_img:blood1_img=new blood1_img();
 /**名字*/
 public name_lab:name_lab=new name_lab();
}
export class blood5_bar{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public progressbar:m4m.framework.progressbar;
 public blood5cut:blood5cut=new blood5cut();
}
export class blood5cut{
 public transform:m4m.framework.transform2D;
 /***/
 public blood4_img:blood4_img=new blood4_img();
}
export class blood4_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class bloodbg_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class blood3_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class blood2_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class blood1_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class name_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class leftbg{
 public transform:m4m.framework.transform2D;
 public arrowbtn1_btn:arrowbtn1_btn=new arrowbtn1_btn();
 public leftbg1:leftbg1=new leftbg1();
}
export class arrowbtn1_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
 public arrowbtn_img:arrowbtn_img=new arrowbtn_img();
}
export class arrowbtn_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class leftbg1{
 public transform:m4m.framework.transform2D;
 public leftblack1_img:leftblack1_img=new leftblack1_img();
 public leftblack2_img:leftblack2_img=new leftblack2_img();
 public listbutton_btn:listbutton_btn=new listbutton_btn();
}
export class leftblack1_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public downbg_img:downbg_img=new downbg_img();
}
export class downbg_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public downlab1_lab:downlab1_lab=new downlab1_lab();
 public leftdownblack_img:leftdownblack_img=new leftdownblack_img();
 public downlabbg:downlabbg=new downlabbg();
}
export class downlab1_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class leftdownblack_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public leftdownlab_lab:leftdownlab_lab=new leftdownlab_lab();
}
export class leftdownlab_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class downlabbg{
 public transform:m4m.framework.transform2D;
 public downlab2_lab:downlab2_lab=new downlab2_lab();
 public downlab3_lab:downlab3_lab=new downlab3_lab();
 public downlab4_lab:downlab4_lab=new downlab4_lab();
 public downcup_img:downcup_img=new downcup_img();
}
export class downlab2_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class downlab3_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class downlab4_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class downcup_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class leftblack2_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public lefttopbg:lefttopbg=new lefttopbg();
 /**名单滑动区域*/
 public slide_scr:slide_scr=new slide_scr();
}
export class lefttopbg{
 public transform:m4m.framework.transform2D;
 public leftblack_img:leftblack_img=new leftblack_img();
 /**玩家名单*/
 public lefttoplab_lab:lefttoplab_lab=new lefttoplab_lab();
 public lefttoprgbg:lefttoprgbg=new lefttoprgbg();
}
export class leftblack_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class lefttoplab_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class lefttoprgbg{
 public transform:m4m.framework.transform2D;
 /**存活*/
 public lefttoplab1_lab:lefttoplab1_lab=new lefttoplab1_lab();
 /**死亡*/
 public lefttoplab2_lab:lefttoplab2_lab=new lefttoplab2_lab();
 public lefttopr_img:lefttopr_img=new lefttopr_img();
 public lefttopg_img:lefttopg_img=new lefttopg_img();
}
export class lefttoplab1_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class lefttoplab2_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class lefttopr_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class lefttopg_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class slide_scr{
 public transform:m4m.framework.transform2D;
 public scrollRect:m4m.framework.scrollRect;
 public slidecontent:slidecontent=new slidecontent();
}
export class slidecontent{
 public transform:m4m.framework.transform2D;
 public numberbg:numberbg=new numberbg();
}
export class numberbg{
 public transform:m4m.framework.transform2D;
 /**死亡编号*/
 public deathnumber_lab:deathnumber_lab=new deathnumber_lab();
}
export class deathnumber_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
 /**存活编号*/
 public alivenumber_lab:alivenumber_lab=new alivenumber_lab();
}
export class alivenumber_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class listbutton_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
}
export class rightbg1{
 public transform:m4m.framework.transform2D;
 public signal_img:signal_img=new signal_img();
 public ms_lab:ms_lab=new ms_lab();
}
export class signal_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class ms_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class topbg{
 public transform:m4m.framework.transform2D;
 public topradbg_img:topradbg_img=new topradbg_img();
 /***/
 public toplab1_lab:toplab1_lab=new toplab1_lab();
}
export class topradbg_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class toplab1_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class slideareabg{
 public transform:m4m.framework.transform2D;
 /***/
 public slideunit_scr:slideunit_scr=new slideunit_scr();
}
export class slideunit_scr{
 public transform:m4m.framework.transform2D;
 public scrollRect:m4m.framework.scrollRect;
 public slideunitcontent:slideunitcontent=new slideunitcontent();
}
export class slideunitcontent{
 public transform:m4m.framework.transform2D;
 public jianbianbg_img:jianbianbg_img=new jianbianbg_img();
}
export class jianbianbg_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 /***/
 public time_lab:time_lab=new time_lab();
}
export class time_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
