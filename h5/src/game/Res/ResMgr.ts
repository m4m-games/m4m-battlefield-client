import { ExcelDataMgr } from "Data/ExcelDataMgr";
import { cMap } from "Data/Map";
import { EventBase, EventMgr } from "eventMgr";
import { loadMgr } from "Loader/loadMgr";
import { TaskFun, TaskManager } from "Tools/TaskManager";
import { ConfigMgr } from "../Data/configMgr";
import { GameMgr } from "../GameMgr";

export class ResMgr {
    public static ExcelConfigClassList: any[];

    /** 表格配置bufferdata 字典 */
    public static ExcelConfigBufferMap: cMap<ArrayBuffer> = new cMap<ArrayBuffer>();
    public static seconedLcallBack: Function;
    public static assetmgr: m4m.framework.assetMgr;
    public static mainConfig: string;
    private static lReslist: string[] = [];
    private static isInit = false;

    //初始资源列表 注册
    private static setLoadUrls() {
        //this.lReslist.push(`xxx/xxxx`);
        //this.lReslist.push(`xxx/xxxx`);
        //this.lReslist.push(``);
        //this.lReslist.push(``);

    }

    public static init() {
        if (this.isInit) { return; }
        this.isInit = true;
        //设置列表
        this.setLoadUrls();
        //并行资源加载
        let pTaskArr: TaskFun[] = [];
        let len = ResMgr.lReslist.length;
        for (let i = 0; i < len; i++) {
            let url = ResMgr.lReslist[i];
            let t = this.getLoadTask(url);
            pTaskArr.push(t);
        }
        //单json 配置
        pTaskArr.push(this.loadConfigJsonTask.bind(this));    //配置加载 与 资源列表并行
        let loadParalleTask = TaskManager.parallelArray(pTaskArr);

        //串行任务，串行执行
        let funs = TaskManager.serial(this.loadShaderTask, this.loadExcalJSTask,
            this.loadExcelConfigTask.bind(this), loadParalleTask, this.configInitTask);
        //执行任务 并抛送事件
        funs(this.postEventTask);
    }

    private static getLoadTask(url: string) {
        let result: TaskFun = (cb) => {
            loadMgr.Instance.load(url, cb as any);
        };
        return result;
    }

    private static getLoadExcelTask(cfgName: string) {
        let url = `${GameMgr.ExcelConfigPath}${cfgName}.json`;
        let result: TaskFun = (cb) => {
            m4m.io.loadArrayBuffer(url, (bin, urlStr) => {
                this.ExcelConfigBufferMap.set(cfgName, bin);
                cb();
            });
        };
        return result;
    }

    //派发加载完成事件
    private static postEventTask() {
        EventMgr.dispatchEvent("res_dependent_loaded", new EventBase());
        // cb();
    }

    //加载Excel 的JS
    private static loadExcalJSTask(cb: Function) {
        ExcelDataMgr.initAllDataClass(cb);
    }

    //串行任务，串行执行
    private static loadExcelConfigTask(cb: Function) {
        //加载表格数据
        this.ExcelConfigClassList = m4m["__ExcDate__"].__list;
        let list = ResMgr.ExcelConfigClassList;
        let len = list.length;
        let pTaskArr: TaskFun[] = [];
        for (let i = 0; i < len; i++) {
            let classObj = list[i];
            let t = ResMgr.getLoadExcelTask(classObj.name);
            pTaskArr.push(t);
        }

        //并行处理
        let actFun = TaskManager.parallelArray(pTaskArr);
        actFun(cb);
    }

    //加载shader
    private static loadShaderTask(cb: Function) {
        let shaderURL = `${GameMgr.shaderPath}customShader/customShader.assetbundle.json`;
        loadMgr.Instance.load(shaderURL, () => {
            cb();
        });
    }

    //加载 json 配置
    private static loadConfigJsonTask(cb: Function) {
        // 非表格 JSON配置    (       游戏内用的excel导出的  base 数据   写上面的加载列表中  )
        const configs = [
            `${GameMgr.configPath}config.json`,
        ];

        Promise.all(configs.map((p) => this.loadText(p)))
            .then((v) => {
                let [main] = v;
                this.mainConfig = main;
                cb();
            });
    }

    private static loadText(path) {
        return new Promise((res: ((_: string) => void), rej) => {
            m4m.io.loadText(path, (txt) => {
                res(txt);
            });
        });
    }

    private static configInitTask(cb: Function) {
        ConfigMgr.init();

        cb();
    }

}