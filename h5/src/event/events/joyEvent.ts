import { JoyData } from "../eventData/joyData";
import { EventBase } from "../eventMgr";

/**
 * 子弹事件
 */
export class JoyEvent extends EventBase {
    public joyData: JoyData = new JoyData();
}