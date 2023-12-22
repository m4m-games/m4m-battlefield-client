import { newUiBase } from "PSDUI/newUiBase";


export namespace Steer {
    export class Steer extends newUiBase {
        public static Instance: Steer;
        public onInit(){
            if (this.onInite) {
                this.onInite();
            }
            //添加按钮事件
            this.gamingbg.titlebg_btn.button.addListener(m4m.event.UIEventEnum.PointerClick,this.titlebg_btn_event, this);


        }
        //按钮事件
        private titlebg_btn_event(){if(this.titlebg_btn_btnEvent)this.titlebg_btn_btnEvent();};
        /**this.gamingbg.titlebg_btn.button 的按钮事件*/
        public titlebg_btn_btnEvent: ()=>any;

        //文字修改方法
        /**修改label 修改label文字方法*/
        public title_lab_text(text: string){this.gamingbg.titlebg_btn.title_lab.label.text=text;}
        /**修改label 标题修改label文字方法*/
        public title2_lab_text(text: string){this.gamingbg.titlebg1_img.title2_lab.label.text=text;}
        /**修改label  this.gamingbg.title1_lab.label 修改label文字方法*/
        public title1_lab_text(text: string){this.gamingbg.title1_lab.label.text=text;}

        public uiName:string="Steer";

        public bg_img: bg_img = new bg_img();
        public loog_img: loog_img = new loog_img();
        public gamingbg: gamingbg = new gamingbg();
    }
    export class bg_img {
        public transform: m4m.framework.transform2D;
        public image: m4m.framework.image2D;
    }
    export class loog_img {
        public transform: m4m.framework.transform2D;
        public image: m4m.framework.image2D;
    }
    export class gamingbg {
        public transform: m4m.framework.transform2D;
        public bg00_img: bg00_img = new bg00_img();
        public titlebg_btn: titlebg_btn = new titlebg_btn();
        public titlebg1_img: titlebg1_img = new titlebg1_img();
        public title1_lab: title1_lab = new title1_lab();
    }
    export class bg00_img {
        public transform: m4m.framework.transform2D;
        public image: m4m.framework.image2D;
    }
    export class titlebg_btn {
        public transform: m4m.framework.transform2D;
        public image: m4m.framework.image2D;
        public button: m4m.framework.button;
        /***/
        public title_lab: title_lab = new title_lab();
    }
    export class title_lab {
        public transform: m4m.framework.transform2D;
        public label: m4m.framework.label;
    }
    export class titlebg1_img {
        public transform: m4m.framework.transform2D;
        public image: m4m.framework.image2D;
        public steer_img: steer_img = new steer_img();
        public steer1_img: steer1_img = new steer1_img();
        /**标题*/
        public title2_lab: title2_lab = new title2_lab();
    }
    export class steer_img {
        public transform: m4m.framework.transform2D;
        public image: m4m.framework.image2D;
    }
    export class steer1_img {
        public transform: m4m.framework.transform2D;
        public image: m4m.framework.image2D;
    }
    export class title2_lab {
        public transform: m4m.framework.transform2D;
        public label: m4m.framework.label;
    }
    export class title1_lab {
        public transform: m4m.framework.transform2D;
        public label: m4m.framework.label;
    }

}