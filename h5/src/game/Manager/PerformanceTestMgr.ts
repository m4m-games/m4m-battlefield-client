import { commTool } from "Tools/commTool";
import { gameMathUtil } from "Tools/gameMathUtil";
import { StageMgr } from "../Core/StageMgr";
import { GameMgr } from "../GameMgr";

//性能测试 管理器
export class PerformanceTestMgr {
    public static update(dt: number) {
        this.PerformanceTestStatistics(dt);
    }

    // private static FPSCEndTime = 1.5 * 60;//一段时间内的帧率
    private static FPSArr: number[] = [];
    private static timeTotal = 0;
    private static FrameCount = 0;

    //性能测试统计
    //平均帧率和方差
    private static PerformanceTestStatistics(delta: number) {
        if (delta == 0) { return; }
        // 平均 帧率统计调试
        if (GameMgr.perfDebugStart) {
            let avergeFPS = 1 / delta;
            this.timeTotal += delta;
            this.FrameCount++;
            this.FPSArr.push(avergeFPS);

            if (GameMgr.perfDebugOutput) {
                GameMgr.perfDebugOutput = false;
                // if (this.timeTotal >= this.FPSCEndTime) {
                //     this.FPSCEndTime = Number.POSITIVE_INFINITY;
                let currAvergeFPS = this.timeTotal / this.FrameCount;
                //输出计算结果
                currAvergeFPS = 1 / currAvergeFPS;
                //FPS 方差
                let currVariance = gameMathUtil.variance(this.FPSArr);
                console.error(this.FPSArr);
                console.error(currVariance);

                let str = GameMgr.testStr + ` 游戏帧率统计 平均FPS：${currAvergeFPS.toFixed(3)}  方差：${currVariance.toFixed(3)} }`;
                console.error(str);

                // }
            }
        }
    }
}