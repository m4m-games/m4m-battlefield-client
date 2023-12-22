import { newUiBase } from "PSDUI/newUiBase";


export namespace tloading {
    export class tloading extends newUiBase {
        public static Instance: tloading;
        public onInit(){
            if (this.onInite) {
                this.onInite();
            }
            //添加按钮事件


        }
        //按钮事件

        //文字修改方法
        /**修改label  this.loog_img.title1_lab.label 修改label文字方法*/
        public title1_lab_text(text: string){this.loog_img.title1_lab.label.text=text;}

        public uiName:string="tloading";

        public bg_img: bg_img = new bg_img();
        public loog_img: loog_img = new loog_img();
    }
    export class bg_img {
        public transform: m4m.framework.transform2D;
        public image: m4m.framework.image2D;
    }
    export class loog_img {
        public transform: m4m.framework.transform2D;
        public image: m4m.framework.image2D;
        public gamingbg: gamingbg = new gamingbg();
        /**加载进度条*/
        public loadbg_bar: loadbg_bar = new loadbg_bar();
        public title1_lab: title1_lab = new title1_lab();
    }
    export class gamingbg {
        public transform: m4m.framework.transform2D;
    }
    export class loadbg_bar {
        public transform: m4m.framework.transform2D;
        public image: m4m.framework.image2D;
        public progressbar: m4m.framework.progressbar;
        public loadbgcut: loadbgcut = new loadbgcut();
    }
    export class loadbgcut {
        public transform: m4m.framework.transform2D;
        /**加载进度条*/
        public load1_img: load1_img = new load1_img();
    }
    export class load1_img {
        public transform: m4m.framework.transform2D;
        public image: m4m.framework.image2D;
    }
    export class title1_lab {
        public transform: m4m.framework.transform2D;
        public label: m4m.framework.label;
    }

}