import { EventBase } from "../eventMgr";

/**
 * 自定义类型的数组数据事件
 */
export class ArrayTypeEvent<T> extends EventBase {
    public array: T[] = [];
}