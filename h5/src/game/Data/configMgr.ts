import { ioTool } from "Tools/ioTool";
import { ResMgr } from "../Res/ResMgr";

export class ConfigMgr {

    public static preKey: number[];
    public static token: number[];
    public static reqVisInfo: number[];//请求 版本信息 数据结构
    public static reqLoginMsg: number[];//请求登录
    public static init() {
        //json 配置初始化
        let conf = ResMgr.mainConfig;
        let obj = JSON.parse(conf);
        this.setConf(obj);

        //excel 解析
        let len = ResMgr.ExcelConfigClassList.length;
        for (let i = 0; i < len; i++) {
            let classObj = ResMgr.ExcelConfigClassList[i];
            try {
                let bd = ResMgr.ExcelConfigBufferMap.get(classObj.name);
                if (bd) {
                    let bytes = new ioTool();
                    bytes.write(new Uint8Array(bd));
                    classObj.parseData(bytes);
                    bytes.dispose();
                }
            } catch (er) {
                console.error(`${classObj.name} 表解析错误！！！`);
            }
        }
    }

    public static setConf(obj: object) {
        for (let k in obj) {
            // console.error(obj[k]);
            ConfigMgr[k] = obj[k];
        }
    }

    public static print() {
        let c = {};
        for (let k in ConfigMgr) {
            c[k] = ConfigMgr[k];
        }
        console.error(`${JSON.stringify(c)}`);
    }

}
