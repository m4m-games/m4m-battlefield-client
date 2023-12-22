import { LoaderLibManager } from "Loader/LoaderLibManager";
import { miniAPIType, miniGame } from "Tools/miniGame";
import { EventMgr } from "./eventMgr";
import { EventMapByAutoGen } from "./eventType/eventMapByAutoGen";

/** 连接 UI 初始化 事件 */
class UiLink {
    /** 处理 UI 的列表 */
    private static UIListStr = "__>#[\"loadPage\"]#<__";
    private static UIList: string[] = [];

    private static getEventKey(UIName: string) {
        return `UI_${UIName}_Show`;
    }

    /** 检查UI 事件 初始化 */
    private static ckUIShowEventExit() {
        let arr = this.UIList;
        let temp = new EventMapByAutoGen();   //方便遍历 定义的事件字段
        for (let i = 0, len = arr.length; i < len; i++) {
            let eventKey = this.getEventKey(arr[i]);
            if (!(eventKey in temp)) {
                console.error(`UI ${arr[i]} 没有在 eventMap 中定义 ${eventKey} 事件！`);
            }
        }
    }

    // /** 微信处理方法 */
    // private static wxFun() {
    //     let arr = this.UIList;

    //     for (let i = 0, len = arr.length; i < len; i++) {
    //         let uiName = arr[i];
    //         let eventKey = this.getEventKey(uiName);

    //         let temp = {
    //             loadJsFun() {
    //                 //取消监听
    //                 EventMgr.removeListener(eventKey as any, temp.loadJsFun, temp);

    //                 //加载JS
    //                 console.log(`开始加载 分包代码 ${uiName}.js`);

    //                 //加载UI JS分包
    //                 let loadTask = m4m["__wx__"].loadSubpackage({
    //                     name: uiName, // name 可以填 name 或者 root
    //                     success(res) {
    //                         // 分包加载成功后通过 success 回调
    //                         window["System"].init();
    //                         //再次派事件
    //                         EventMgr.dispatchEvent(eventKey as any, null);
    //                     },
    //                     fail(res) {
    //                         // 分包加载失败通过 fail 回调
    //                         console.error(`UI Subpackage load fail ${uiName}`);
    //                     },
    //                 });
    //             },
    //         };

    //         EventMgr.addListener(eventKey as any, temp.loadJsFun, temp);
    //     }
    // }

    // /** qq处理方法 */
    // public static qqFun() {

    // }

    /** h5处理方法 */
    public static h5Fun() {
        let arr = this.UIList;

        for (let i = 0, len = arr.length; i < len; i++) {
            let uiName = arr[i];
            let eventKey = this.getEventKey(uiName);

            let temp = {
                loadJsFun() {
                    //取消监听
                    EventMgr.removeListener(eventKey as any, temp.loadJsFun, temp);

                    //加载JS
                    console.log(`开始加载 分包代码 ${uiName}.js`);

                    //加载UI JS分包
                    let libStr = miniGame.miniType == miniAPIType.none ? `lib/node_modules/@types/${uiName}.js` : uiName;
                    let loadFun = miniGame.miniType == miniAPIType.none ? LoaderLibManager.Instance.addLib : LoaderLibManager.Instance.addSubpackage;
                    loadFun = loadFun.bind(LoaderLibManager.Instance);
                    loadFun(libStr, (isSucc) => {
                        if (!isSucc) {
                            console.error(`UI Subpackage load fail ${uiName}`);
                            return;
                        }

                        // 分包加载成功后通过 success 回调
                        window["System"].init();
                        //再次派事件
                        EventMgr.dispatchEvent(eventKey as any, null);
                    });
                },
            };

            EventMgr.addListener(eventKey as any, temp.loadJsFun, temp);
        }
    }

    public static init() {
        let prefixLen = 4;
        let len = this.UIListStr.length;
        let str = this.UIListStr.substring(prefixLen, len - prefixLen);
        this.UIList = JSON.parse(str);
        //
        this.ckUIShowEventExit();

        this.h5Fun();

        // //------------------
        // if (m4m["__wx__"]) {
        //     this.wxFun();
        // } else if (m4m["__qq__"]) {
        //     this.qqFun();
        // } else {
        //     this.h5Fun();
        // }

    }
}

//初始化
UiLink.init();