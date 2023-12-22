//请在项目中，将 SyncObject、cMap 注入到 gd3d.__ExcDate__ 对象上。
 import { ExcelDataBase } from "Data/ExcelDataBase";
import { cMap } from "Data/Map";
declare let gd3d;
export class DialRiverConfigBase extends ExcelDataBase{
	public static versition:number = 0;

	/** 
	* 从服务器同步数据到本地
	* @param fields 指定需要同步的字段 例如["name","desc"]
	*/
	public sync:(fields?:string[]) => Promise<void>;

	/** 
	* 保存数据到服务器
	* @param fields 指定需要保存的字段 例如["name","desc"]
	*/
	public save:(fields?:string[]) => Promise<void>;

	/** 
	* 获取数据数量
	*/
	public static getlistCount:() => Promise<number>;

	/** 
	* 获取列表数据
	* @param offset 从什么位置获取 默认值:0
	* @param count 指定需要保存的字段 例如["name","desc"]
	*/
	public static getlist:(offset?:number, count?:number) => Promise<DialRiverConfigBase>;

	/**配置ID*/
	public id:string;
	/**备注*/
	public desc:string;
	/**用户列表*/
	public players:string;
	/**每一步距离*/
	public stepDis:number;
	/**下落高度*/
	public dropHeigth:number;
	/**初始位置*/
	public startArea:string;
	/**活动区域*/
	public moveArea:string;
	/**左边分组人员*/
	public leftTeam:string[];
	/**最小的分*/
	public minPoint:number;
	/**最大得分*/
	public maxPoint:number;
	/**简单难度持续时间*/
	public easyMode:number;
	/**困难难度开始时间*/
	public hardMode:number;
	/**最小判定时间*/
	public checkMin:number;
	/**最大判定时间*/
	public checkMax:number;
	/**最小等待时间*/
	public waitMin:number;
	/**最大等待时间*/
	public waitMax:number;
	/**演出时长*/
	public showTimeMax:number;
	/**演出最小时长*/
	public showTimeMin:number;
	/**最小判定角度*/
	public agreeMin:number;
	/**最大判定角度*/
	public agreeMax:number;
	/**提前发送时间*/
	public advance:number;
	/**游戏总时间*/
	public totleTime:number;
	/**倒计时时长*/
	public countTime:number;
	/**游戏开始时间*/
	public gameTime:number;
	/**游戏状态*/
	public gameStatus:number;
	/**倒计时开始时间*/
	public countDown:number;
	/**当前时间*/
	public nowTime:number;
	/**结束时间*/
	public endTime:number;
	/**游戏场景ID*/
	public gameScene:number;


static get list(){ if(!this._list ){this._list = new cMap()}; return this._list;};
static set list(v){ this._list=v;};		
public static  parseData(br):void {
 var length:number = br.readInt32();

for (var i = 0; i < length; i++)
{var b:string = br.readUTFBytes();
var bb:string = br.readUTFBytes();
	
}	
var row:number = br.readInt32();
var length2:number = br.readInt32();
 for (var i = 0; i < row; i++)
{ 

var baseData:DialRiverConfigBase = new DialRiverConfigBase ();	
	baseData.id=br.readUTFBytes();
	
	baseData.desc=br.readUTFBytes();
	
	baseData.players=br.readUTFBytes();
	
	baseData.stepDis=br.readFloat();
	
	baseData.dropHeigth=br.readFloat();
	
	baseData.startArea=br.readUTFBytes();
	
	baseData.moveArea=br.readUTFBytes();
	
	baseData.leftTeam = (() => { let cache:any[] = []; let len = br.readUInt32(); for(let i=0;i<len;i++) {cache.push(br.readUTFBytes());}return cache;})();
	
	baseData.minPoint=br.readInt32();
	
	baseData.maxPoint=br.readInt32();
	
	baseData.easyMode=br.readInt32();
	
	baseData.hardMode=br.readInt32();
	
	baseData.checkMin=br.readInt32();
	
	baseData.checkMax=br.readInt32();
	
	baseData.waitMin=br.readInt32();
	
	baseData.waitMax=br.readInt32();
	
	baseData.showTimeMax=br.readInt32();
	
	baseData.showTimeMin=br.readInt32();
	
	baseData.agreeMin=br.readInt32();
	
	baseData.agreeMax=br.readInt32();
	
	baseData.advance=br.readInt32();
	
	baseData.totleTime=br.readInt32();
	
	baseData.countTime=br.readInt32();
	
	baseData.gameTime=br.readULong();
	
	baseData.gameStatus=br.readByte();
	
	baseData.countDown=br.readULong();
	
	baseData.nowTime=br.readDouble();
	
	baseData.endTime=br.readDouble();
	
	baseData.gameScene=br.readUInt32();
	
	this.list.set(baseData.id, baseData);

}
}
public static  clone(old:DialRiverConfigBase):DialRiverConfigBase{
var clone :DialRiverConfigBase = new DialRiverConfigBase();
	clone.id=old.id;
	
	clone.desc=old.desc;
	
	clone.players=old.players;
	
	clone.stepDis=old.stepDis;
	
	clone.dropHeigth=old.dropHeigth;
	
	clone.startArea=old.startArea;
	
	clone.moveArea=old.moveArea;
	
	clone.leftTeam=old.leftTeam;
	
	clone.minPoint=old.minPoint;
	
	clone.maxPoint=old.maxPoint;
	
	clone.easyMode=old.easyMode;
	
	clone.hardMode=old.hardMode;
	
	clone.checkMin=old.checkMin;
	
	clone.checkMax=old.checkMax;
	
	clone.waitMin=old.waitMin;
	
	clone.waitMax=old.waitMax;
	
	clone.showTimeMax=old.showTimeMax;
	
	clone.showTimeMin=old.showTimeMin;
	
	clone.agreeMin=old.agreeMin;
	
	clone.agreeMax=old.agreeMax;
	
	clone.advance=old.advance;
	
	clone.totleTime=old.totleTime;
	
	clone.countTime=old.countTime;
	
	clone.gameTime=old.gameTime;
	
	clone.gameStatus=old.gameStatus;
	
	clone.countDown=old.countDown;
	
	clone.nowTime=old.nowTime;
	
	clone.endTime=old.endTime;
	
	clone.gameScene=old.gameScene;
	
return clone;
}

public   clone(old:DialRiverConfigBase){
	this.id=old.id;
	
	this.desc=old.desc;
	
	this.players=old.players;
	
	this.stepDis=old.stepDis;
	
	this.dropHeigth=old.dropHeigth;
	
	this.startArea=old.startArea;
	
	this.moveArea=old.moveArea;
	
	this.leftTeam=old.leftTeam;
	
	this.minPoint=old.minPoint;
	
	this.maxPoint=old.maxPoint;
	
	this.easyMode=old.easyMode;
	
	this.hardMode=old.hardMode;
	
	this.checkMin=old.checkMin;
	
	this.checkMax=old.checkMax;
	
	this.waitMin=old.waitMin;
	
	this.waitMax=old.waitMax;
	
	this.showTimeMax=old.showTimeMax;
	
	this.showTimeMin=old.showTimeMin;
	
	this.agreeMin=old.agreeMin;
	
	this.agreeMax=old.agreeMax;
	
	this.advance=old.advance;
	
	this.totleTime=old.totleTime;
	
	this.countTime=old.countTime;
	
	this.gameTime=old.gameTime;
	
	this.gameStatus=old.gameStatus;
	
	this.countDown=old.countDown;
	
	this.nowTime=old.nowTime;
	
	this.endTime=old.endTime;
	
	this.gameScene=old.gameScene;
	
}
	private static params = ["id","desc","players","stepDis","dropHeigth","startArea","moveArea","leftTeam","minPoint","maxPoint","easyMode","hardMode","checkMin","checkMax","waitMin","waitMax","showTimeMax","showTimeMin","agreeMin","agreeMax","advance","totleTime","countTime","gameTime","gameStatus","countDown","nowTime","endTime","gameScene",];
	public static add(a: DialRiverConfigBase, b: DialRiverConfigBase, start: number = 0, end: number, limit: DialRiverConfigBase) {
		if(!a || !b) return null;
		let result = this.clone(a);
		for(let i = Math.max(start, 0), e = Math.min(end, this.params.length); i < e; i++) {
			const par = this.params[i];
			result[par] += b[par];
			if(limit && result[par] > limit[par])
				result[par] = limit[par];
		}
		return result;
	}

	public static sub(a: DialRiverConfigBase, b: DialRiverConfigBase, start: number = 0, end: number) {
		if(!a || !b) return null;
		let result = this.clone(a);
		for(let i = Math.max(start, 0), e = Math.min(end, this.params.length); i < e; i++) {
			const par = this.params[i];
			result[par] -= b[par];
		}
		return result;
	}

	public static random(src: DialRiverConfigBase, i: number = 0) {
		if(src[this.params[i]] == 0) // NOTE:
			src[this.params[i]] = Math.random();
		return JSON.stringify(src);
	}

	public static large(a: DialRiverConfigBase, b: DialRiverConfigBase, i: number = 0) {
		return a[this.params[i]] > b[this.params[i]];
	}

	public static max(a: DialRiverConfigBase, b: DialRiverConfigBase, i: number = 0) {
		if(a[this.params[i]] > b[this.params[i]])
			return a;
		return b;
	}

	public static json(a: DialRiverConfigBase, data) {
		data = JSON.parse(data);
		for(let k in data) {
			a[k] = data[k];
		};
		return a;
	}

	public static setProperty(a: DialRiverConfigBase, p: number, value) {
		a[this.params[p]] = value;
		return a;
	}

}if(!gd3d.__ExcDate__)gd3d.__ExcDate__= { } ; if(!gd3d.__ExcDate__.__list) gd3d.__ExcDate__.__list = []; gd3d.__ExcDate__.__list.push(DialRiverConfigBase);