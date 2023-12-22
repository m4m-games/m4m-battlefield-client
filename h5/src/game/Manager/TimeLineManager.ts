/**
 * 时间轴管理器
 */
export class TimeLineManager {
    public static get Instance(): TimeLineManager {
        if (this._instance == null) {
            this._instance = new TimeLineManager();
        }
        return this._instance;
    }
    private static _instance: TimeLineManager;

    private readonly timeLinePool: TimeLine[] = [];

    /**
     * 创建一个时间轴
     * @param endRemove 时间轴结束后是否从池中移除
     */
    public createTimeLine(endRemove: boolean = true): TimeLine {
        let timeLine = new TimeLine();
        this.timeLinePool.push(timeLine);
        let stop = timeLine.stop.bind(timeLine);
        timeLine["_stop"] = stop;
        if (endRemove) {
            timeLine.stop = () => {
                stop();
                let index = this.timeLinePool.indexOf(timeLine);
                if (index >= 0) {
                    this.timeLinePool.splice(index, 1);
                }
            };
        }
        return timeLine;
    }

    /**
     * 开始运行所有时间轴
     */
    public startAll() {
        for (let line of this.timeLinePool) {
            line.start();
        }
    }

    /**
     * 强制停止所有时间轴
     */
    public stopAll() {
        for (let line of this.timeLinePool) {
            line["_stop"]();
        }
    }

    /**
     * 强制停止所有时间轴, 并清理
     */
    public stopAndClaer() {
        this.stopAll();
        this.timeLinePool.length = 0;
    }

}

/**
 * 时间轴
 */
export class TimeLine {
    private map: { [key: number]: Function } = {};
    private timer: number = null;
    private state: number = 0;

    /**
     * 获取时间轴状态, 0 未开启, 1 运行中, 2 结束
     */
    public getState() {
        return this.state;
    }

    /**
     * 开启时间轴
     */
    public start() {
        if (this.state == 1) {
            console.error("时间轴正在运行");
            return;
        }
        this.state = 1;
        let keys = Object.keys(this.map);
        let prevTime = 0;
        let index = 0;
        let f = () => {
            let key = keys[index++];
            if (!key) {
                this.stop();
                return;
            }
            let nowTime = Number(key);
            this.timer = setTimeout(() => {
                f();
                this.map[key]();
            }, nowTime - prevTime);
            prevTime = nowTime;
        };
        f();
    }

    /**
     * 往当前时间轴添加事件
     */
    public add(time: number, callBack: Function) {
        if (this.state == 1) {
            console.error("时间轴正在运行");
            return;
        }
        this.map[time] = callBack;
    }

    /**
     * 清理当前时间轴
     */
    public clear() {
        if (this.state == 1) {
            console.error("时间轴正在运行");
            return;
        }
        this.state = 0;
        this.map = {};
    }

    /**
     * 强制停止当前时间轴
     */
    public stop() {
        if (this.state == 1) {
            this.state = 2;
            clearTimeout(this.timer);
        }
    }
}