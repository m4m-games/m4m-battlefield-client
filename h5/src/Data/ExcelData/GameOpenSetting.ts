//请在项目中，将 SyncObject、cMap 注入到 gd3d.__ExcDate__ 对象上。
 import { ExcelDataBase } from "Data/ExcelDataBase";
import { cMap } from "Data/Map";
declare let gd3d;
export class GameOpenSetting extends ExcelDataBase{
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
	public static getlist:(offset?:number, count?:number) => Promise<GameOpenSetting>;

	/**配置ID*/
	public id:string;
	/**任务名称*/
	public eventName:string;
	/**开始加入时间*/
	public startTime:number;
	/**加入结束时间*/
	public EndTime:number;
	/**下次开始时间*/
	public nextStartTime:number;
	/**默认时间是0也就是utc时间*/
	public serverTimeZone:number;
	/**可加入时长*/
	public enterTime:number;
	/**可加人时加入BOT的时间间隔*/
	public addBotInEnter:number;
	/**停止加人后加入BOT的时间间隔*/
	public addBotOverEnter:number;
	/**停止加人后加入BOT的时间间隔最大间隔*/
	public addBotOverEnterMax:number;
	/**任务间隔执行时间*/
	public taskLoopTime:number;
	/**每天结算开始的时间，和loopTime共同执行*/
	public rankTime:number;
	/**结算结束时间*/
	public rankEndTime:number;


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

var baseData:GameOpenSetting = new GameOpenSetting ();	
	baseData.id=br.readUTFBytes();
	
	baseData.eventName=br.readUTFBytes();
	
	baseData.startTime=br.readULong();
	
	baseData.EndTime=br.readULong();
	
	baseData.nextStartTime=br.readULong();
	
	baseData.serverTimeZone=br.readInt32();
	
	baseData.enterTime=br.readInt32();
	
	baseData.addBotInEnter=br.readFloat();
	
	baseData.addBotOverEnter=br.readFloat();
	
	baseData.addBotOverEnterMax=br.readFloat();
	
	baseData.taskLoopTime=br.readULong();
	
	baseData.rankTime=br.readULong();
	
	baseData.rankEndTime=br.readULong();
	
	this.list.set(baseData.id, baseData);

}
}
public static  clone(old:GameOpenSetting):GameOpenSetting{
var clone :GameOpenSetting = new GameOpenSetting();
	clone.id=old.id;
	
	clone.eventName=old.eventName;
	
	clone.startTime=old.startTime;
	
	clone.EndTime=old.EndTime;
	
	clone.nextStartTime=old.nextStartTime;
	
	clone.serverTimeZone=old.serverTimeZone;
	
	clone.enterTime=old.enterTime;
	
	clone.addBotInEnter=old.addBotInEnter;
	
	clone.addBotOverEnter=old.addBotOverEnter;
	
	clone.addBotOverEnterMax=old.addBotOverEnterMax;
	
	clone.taskLoopTime=old.taskLoopTime;
	
	clone.rankTime=old.rankTime;
	
	clone.rankEndTime=old.rankEndTime;
	
return clone;
}

public   clone(old:GameOpenSetting){
	this.id=old.id;
	
	this.eventName=old.eventName;
	
	this.startTime=old.startTime;
	
	this.EndTime=old.EndTime;
	
	this.nextStartTime=old.nextStartTime;
	
	this.serverTimeZone=old.serverTimeZone;
	
	this.enterTime=old.enterTime;
	
	this.addBotInEnter=old.addBotInEnter;
	
	this.addBotOverEnter=old.addBotOverEnter;
	
	this.addBotOverEnterMax=old.addBotOverEnterMax;
	
	this.taskLoopTime=old.taskLoopTime;
	
	this.rankTime=old.rankTime;
	
	this.rankEndTime=old.rankEndTime;
	
}
	private static params = ["id","eventName","startTime","EndTime","nextStartTime","serverTimeZone","enterTime","addBotInEnter","addBotOverEnter","addBotOverEnterMax","taskLoopTime","rankTime","rankEndTime",];
	public static add(a: GameOpenSetting, b: GameOpenSetting, start: number = 0, end: number, limit: GameOpenSetting) {
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

	public static sub(a: GameOpenSetting, b: GameOpenSetting, start: number = 0, end: number) {
		if(!a || !b) return null;
		let result = this.clone(a);
		for(let i = Math.max(start, 0), e = Math.min(end, this.params.length); i < e; i++) {
			const par = this.params[i];
			result[par] -= b[par];
		}
		return result;
	}

	public static random(src: GameOpenSetting, i: number = 0) {
		if(src[this.params[i]] == 0) // NOTE:
			src[this.params[i]] = Math.random();
		return JSON.stringify(src);
	}

	public static large(a: GameOpenSetting, b: GameOpenSetting, i: number = 0) {
		return a[this.params[i]] > b[this.params[i]];
	}

	public static max(a: GameOpenSetting, b: GameOpenSetting, i: number = 0) {
		if(a[this.params[i]] > b[this.params[i]])
			return a;
		return b;
	}

	public static json(a: GameOpenSetting, data) {
		data = JSON.parse(data);
		for(let k in data) {
			a[k] = data[k];
		};
		return a;
	}

	public static setProperty(a: GameOpenSetting, p: number, value) {
		a[this.params[p]] = value;
		return a;
	}

}if(!gd3d.__ExcDate__)gd3d.__ExcDate__= { } ; if(!gd3d.__ExcDate__.__list) gd3d.__ExcDate__.__list = []; gd3d.__ExcDate__.__list.push(GameOpenSetting);