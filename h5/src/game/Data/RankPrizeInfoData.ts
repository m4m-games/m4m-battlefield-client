//排行榜 奖励信息数据
export class RankPrizeInfoData {
    public awardDescribeStr: string = "";
    public awardNum: number = 0;
    public callBackFun: Function;
    public setSQTData(index, topNum,awardNum) {
        // tslint:disable-next-line: switch-default
        switch (index) {
            case 0:
                this.awardDescribeStr = "Participation rewards(SQT) claimed";
                break;
            case 1:
                this.awardDescribeStr = "Participation rewards(SQT) claimable";
                break;
            case 2:
                this.awardDescribeStr = "Participation rewards(SQT) claim in total";
                break;
            case 3:
                this.awardDescribeStr = `Top ${topNum} rewards(SQT) claimed`;
                break;
            case 4:
                this.awardDescribeStr = `Top ${topNum} rewards(SQT) claimable `;
                break;
            case 5:
                this.awardDescribeStr = `Top ${topNum} rewards(SQT) claim in total`;
                break;
            case 6:
                this.awardDescribeStr = `Top ${topNum} rewards(SQT) locked `;
        }
        this.awardNum = awardNum;
    }
    public setUSDTData(index,awardNum) {
        // tslint:disable-next-line: switch-default
        switch (index) {
            case 0:
                this.awardDescribeStr = "Bonus(USDT) claimed";
                break;
            case 1:
                this.awardDescribeStr =  "Bonus(USDT) claimable";
                break;
            case 2:
                this.awardDescribeStr = "Bonus(USDT) claim in total";
        }
        this.awardNum = awardNum;
    }
}