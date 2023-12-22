import { UiEvent } from "../events/uiEvent";

/** 工具 自动生成该文件
 * 用于按配置预绑定 特定事件（例如 UI 头事件 、xxx 、xxxx）
*/
export class EventMapByAutoGen {
    //-------------------UI 头事件---------------------------
    /**
     * 面板固定格式
     * UI_xxx_Show  //面板显示
     * UI_xxx_Hide  //面板隐藏
     */
    public "UI_loadPage_Show": UiEvent = null;
    public "UI_loadPage_Hide": UiEvent = null;
    public "UI_mainPage_Show": UiEvent = null;
    public "UI_mainPage_Hide": UiEvent = null;

    //------------------------------------------------------
}