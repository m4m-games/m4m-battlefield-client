import { EventMapByAutoGen } from "./eventType/eventMapByAutoGen";
import { EventMapScene } from "./eventType/eventMapScene";
import { EventMapUI } from "./eventType/eventMapUI";

export type eventTypes = EventMapScene & EventMapUI & EventMapByAutoGen;   //事件定义拆分

/** 基础事件对象 */
export class EventBase {
    /** 数据 */
    public data: any;
    constructor(_data: any = null) {
        this.data = _data;
    }
}

/** 泛型参数 事件 */
export class EventGeneric<T> extends EventBase {
    public data: T;
    constructor(_data: T = null) {
        super(_data);
    }
}

class EventDispatcher extends m4m.AEvent {
}

/** 游戏事件管理类 */
export class EventMgr {
    private static eventDisp = new EventDispatcher();

    /**
     * 派发事件
     * @param eventType
     * @param ev
     */
    public static dispatchEvent<K extends keyof eventTypes>(eventType: K, ev: eventTypes[K]) {
        this.eventDisp.Emit(eventType, ev);
    }

    /**
     * 添加事件监听
     * @param eventType 
     * @param listener 
     * @param thisArg 
     */
    public static addListener<K extends keyof eventTypes>(eventType: K, listener: (ev: eventTypes[K]) => any, thisArg: any) {
        this.eventDisp.On(eventType, listener, thisArg);
    }

    /**
     * 移除事件监听
     * @param eventType 
     * @param listener 
     * @param thisArg 
     */
    public static removeListener<K extends keyof eventTypes>(eventType: K, listener: Function, thisArg: any) {
        this.eventDisp.RemoveListener(eventType, listener, thisArg);
    }

}
