//弹出提示框 数据
export class UITipManager {
    static get Instance() {
        if (this._instance == null) {
            this._instance = new UITipManager();
        }
        return this._instance;
    }
    public tipsData: any;
    public tipPanelText: string = "";
    public callBackFun: Function;
    public type: TipPanelType;
    private static _instance: UITipManager;
}

export enum TipPanelType {
    rest = 0, // 其他 灰色背景可以关闭
    mistake = 1, //错误 灰色背景不可以关闭
}