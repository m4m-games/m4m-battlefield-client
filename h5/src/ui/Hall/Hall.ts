import { newUiBase } from "PSDUI/newUiBase";
export class Hall extends newUiBase {
    public static Instance: Hall;
    public onInit(){
        if (this.onInite) {
            this.onInite();
        }
        //添加按钮事件
        this.socialiconbg.naver_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.naver_btn_event, this);
        this.socialiconbg.medium_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.medium_btn_event, this);
        this.socialiconbg.discord_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.discord_btn_event, this);
        this.socialiconbg.youtube_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.youtube_btn_event, this);
        this.socialiconbg.twitter_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.twitter_btn_event, this);
        this.socialiconbg.telegram_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.telegram_btn_event, this);
        this.bg1.leftblackbg_img.man1_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.man1_btn_event, this);
        this.bg1.bg3.rightblackbg_img.right2.email_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.email_btn_event, this);
        this.bg1.bg3.rightblackbg_img.right2.notice_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.notice_btn_event, this);
        this.bg1.bg3.rightblackbg_img.right2.gear_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.gear_btn_event, this);
        this.bg1.bg2.middlebg.functionbtn1_img.functionbtn2_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.functionbtn2_btn_event, this);
        this.bg1.bg2.menubg.menu1_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.menu1_btn_event, this);


    }
    //按钮事件
    private naver_btn_event(){if(this.naver_btn_btnEvent)this.naver_btn_btnEvent();};
    /**this.socialiconbg.naver_btn.button 的按钮事件*/
    public naver_btn_btnEvent:()=>any;
    private medium_btn_event(){if(this.medium_btn_btnEvent)this.medium_btn_btnEvent();};
    /**this.socialiconbg.medium_btn.button 的按钮事件*/
    public medium_btn_btnEvent:()=>any;
    private discord_btn_event(){if(this.discord_btn_btnEvent)this.discord_btn_btnEvent();};
    /**this.socialiconbg.discord_btn.button 的按钮事件*/
    public discord_btn_btnEvent:()=>any;
    private youtube_btn_event(){if(this.youtube_btn_btnEvent)this.youtube_btn_btnEvent();};
    /**this.socialiconbg.youtube_btn.button 的按钮事件*/
    public youtube_btn_btnEvent:()=>any;
    private twitter_btn_event(){if(this.twitter_btn_btnEvent)this.twitter_btn_btnEvent();};
    /**this.socialiconbg.twitter_btn.button 的按钮事件*/
    public twitter_btn_btnEvent:()=>any;
    private telegram_btn_event(){if(this.telegram_btn_btnEvent)this.telegram_btn_btnEvent();};
    /**this.socialiconbg.telegram_btn.button 的按钮事件*/
    public telegram_btn_btnEvent:()=>any;
    private man1_btn_event(){if(this.man1_btn_btnEvent)this.man1_btn_btnEvent();};
    /**this.bg1.leftblackbg_img.man1_btn.button 的按钮事件*/
    public man1_btn_btnEvent:()=>any;
    private email_btn_event(){if(this.email_btn_btnEvent)this.email_btn_btnEvent();};
    /**this.bg1.bg3.rightblackbg_img.right2.email_btn.button 的按钮事件*/
    public email_btn_btnEvent:()=>any;
    private notice_btn_event(){if(this.notice_btn_btnEvent)this.notice_btn_btnEvent();};
    /**this.bg1.bg3.rightblackbg_img.right2.notice_btn.button 的按钮事件*/
    public notice_btn_btnEvent:()=>any;
    private gear_btn_event(){if(this.gear_btn_btnEvent)this.gear_btn_btnEvent();};
    /**this.bg1.bg3.rightblackbg_img.right2.gear_btn.button 的按钮事件*/
    public gear_btn_btnEvent:()=>any;
    private functionbtn2_btn_event(){if(this.functionbtn2_btn_btnEvent)this.functionbtn2_btn_btnEvent();};
    /**this.bg1.bg2.middlebg.functionbtn1_img.functionbtn2_btn.button 的按钮事件*/
    public functionbtn2_btn_btnEvent:()=>any;
    private menu1_btn_event(){if(this.menu1_btn_btnEvent)this.menu1_btn_btnEvent();};
    /**this.bg1.bg2.menubg.menu1_btn.button 的按钮事件*/
    public menu1_btn_btnEvent:()=>any;

    //文字修改方法
    /**修改label  this.bg1.leftblackbg_img.player_lab.label 修改label文字方法*/
    public player_lab_text(text:string){this.bg1.leftblackbg_img.player_lab.label.text=text;}
    /**修改label 修改label文字方法*/
    public time_lab_text(text:string){this.bg1.bg3.slideareabg.slideunit_scr.slideunitcontent.jianbianbg_img.time_lab.label.text=text;}
    /**修改label  this.bg1.bg3.rightblackbg_img.rightbg1.ms_lab.label 修改label文字方法*/
    public ms_lab_text(text:string){this.bg1.bg3.rightblackbg_img.rightbg1.ms_lab.label.text=text;}
    /**修改label  this.bg1.bg2.middlebg.functionbtn1_img.functionbtn_lab.label 修改label文字方法*/
    public functionbtn_lab_text(text:string){this.bg1.bg2.middlebg.functionbtn1_img.functionbtn_lab.label.text=text;}
    /**修改label  this.bg1.bg2.menubg.menulab_lab.label 修改label文字方法*/
    public menulab_lab_text(text:string){this.bg1.bg2.menubg.menulab_lab.label.text=text;}

 public uiName:string="Hall";

 public bg:bg=new bg();
 public socialiconbg:socialiconbg=new socialiconbg();
 public bg1:bg1=new bg1();
}
export class bg{
 public transform:m4m.framework.transform2D;
}
export class socialiconbg{
 public transform:m4m.framework.transform2D;
 public naver_img:naver_img=new naver_img();
 public naver_btn:naver_btn=new naver_btn();
 public medium_img:medium_img=new medium_img();
 public medium_btn:medium_btn=new medium_btn();
 public discord_img:discord_img=new discord_img();
 public discord_btn:discord_btn=new discord_btn();
 public youtube_img:youtube_img=new youtube_img();
 public youtube_btn:youtube_btn=new youtube_btn();
 public twitter_img:twitter_img=new twitter_img();
 public twitter_btn:twitter_btn=new twitter_btn();
 public telegram_img:telegram_img=new telegram_img();
 public telegram_btn:telegram_btn=new telegram_btn();
}
export class naver_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class naver_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
}
export class medium_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class medium_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
}
export class discord_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class discord_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
}
export class youtube_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class youtube_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
}
export class twitter_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class twitter_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
}
export class telegram_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class telegram_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
}
export class bg1{
 public transform:m4m.framework.transform2D;
 public leftblackbg_img:leftblackbg_img=new leftblackbg_img();
 public bg3:bg3=new bg3();
 public bg2:bg2=new bg2();
}
export class leftblackbg_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public player_lab:player_lab=new player_lab();
 public man1_btn:man1_btn=new man1_btn();
}
export class player_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class man1_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
 public man_img:man_img=new man_img();
}
export class man_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class bg3{
 public transform:m4m.framework.transform2D;
 public slideareabg:slideareabg=new slideareabg();
 public rightblackbg_img:rightblackbg_img=new rightblackbg_img();
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
export class rightblackbg_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public line_img:line_img=new line_img();
 public right2:right2=new right2();
 public rightbg1:rightbg1=new rightbg1();
}
export class line_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class right2{
 public transform:m4m.framework.transform2D;
 public email1_img:email1_img=new email1_img();
 public email_btn:email_btn=new email_btn();
 public notice1_img:notice1_img=new notice1_img();
 public notice_btn:notice_btn=new notice_btn();
 public gear1_img:gear1_img=new gear1_img();
 public gear_btn:gear_btn=new gear_btn();
}
export class email1_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class email_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
}
export class notice1_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class notice_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
}
export class gear1_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class gear_btn{
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
export class bg2{
 public transform:m4m.framework.transform2D;
 public middlebg:middlebg=new middlebg();
 public menubg:menubg=new menubg();
}
export class middlebg{
 public transform:m4m.framework.transform2D;
 public functionbtn1_img:functionbtn1_img=new functionbtn1_img();
}
export class functionbtn1_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public functionbtn2_btn:functionbtn2_btn=new functionbtn2_btn();
 public functionbtn_lab:functionbtn_lab=new functionbtn_lab();
}
export class functionbtn2_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
}
export class functionbtn_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class menubg{
 public transform:m4m.framework.transform2D;
 public menu1_btn:menu1_btn=new menu1_btn();
 public menu_img:menu_img=new menu_img();
 public menulab_lab:menulab_lab=new menulab_lab();
 public arrow2_img:arrow2_img=new arrow2_img();
 public arrow1_img:arrow1_img=new arrow1_img();
}
export class menu1_btn{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
 public button:m4m.framework.button;
}
export class menu_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class menulab_lab{
 public transform:m4m.framework.transform2D;
 public label:m4m.framework.label;
}
export class arrow2_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
export class arrow1_img{
 public transform:m4m.framework.transform2D;
 public image:m4m.framework.image2D;
}
