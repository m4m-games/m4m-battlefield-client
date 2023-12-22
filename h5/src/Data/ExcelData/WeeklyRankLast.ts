//请在项目中，将 SyncObject、cMap 注入到 gd3d.__ExcDate__ 对象上。
 import { ExcelDataBase } from "Data/ExcelDataBase";
import { cMap } from "Data/Map";
declare let gd3d;
export class WeeklyRankLast extends ExcelDataBase{
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
	public static getlist:(offset?:number, count?:number) => Promise<WeeklyRankLast>;

	/**玩家token*/
	public id:string;
	/**积分*/
	public point:number;
	/**胜场*/
	public win:number;
	/**败场*/
	public lose:number;
	/**总场次*/
	public total:number;
	/**结算时间*/
	public resultTime:number;
	/**名次*/
	public rank:number;


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

var baseData:WeeklyRankLast = new WeeklyRankLast ();	
	baseData.id=br.readUTFBytes();
	
	baseData.point=br.readInt32();
	
	baseData.win=br.readInt32();
	
	baseData.lose=br.readInt32();
	
	baseData.total=br.readInt32();
	
	baseData.resultTime=br.readDouble();
	
	baseData.rank=br.readInt32();
	
	this.list.set(baseData.id, baseData);

}
}
public static  clone(old:WeeklyRankLast):WeeklyRankLast{
var clone :WeeklyRankLast = new WeeklyRankLast();
	clone.id=old.id;
	
	clone.point=old.point;
	
	clone.win=old.win;
	
	clone.lose=old.lose;
	
	clone.total=old.total;
	
	clone.resultTime=old.resultTime;
	
	clone.rank=old.rank;
	
return clone;
}

public   clone(old:WeeklyRankLast){
	this.id=old.id;
	
	this.point=old.point;
	
	this.win=old.win;
	
	this.lose=old.lose;
	
	this.total=old.total;
	
	this.resultTime=old.resultTime;
	
	this.rank=old.rank;
	
}
	private static params = ["id","point","win","lose","total","resultTime","rank",];
	public static add(a: WeeklyRankLast, b: WeeklyRankLast, start: number = 0, end: number, limit: WeeklyRankLast) {
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

	public static sub(a: WeeklyRankLast, b: WeeklyRankLast, start: number = 0, end: number) {
		if(!a || !b) return null;
		let result = this.clone(a);
		for(let i = Math.max(start, 0), e = Math.min(end, this.params.length); i < e; i++) {
			const par = this.params[i];
			result[par] -= b[par];
		}
		return result;
	}

	public static random(src: WeeklyRankLast, i: number = 0) {
		if(src[this.params[i]] == 0) // NOTE:
			src[this.params[i]] = Math.random();
		return JSON.stringify(src);
	}

	public static large(a: WeeklyRankLast, b: WeeklyRankLast, i: number = 0) {
		return a[this.params[i]] > b[this.params[i]];
	}

	public static max(a: WeeklyRankLast, b: WeeklyRankLast, i: number = 0) {
		if(a[this.params[i]] > b[this.params[i]])
			return a;
		return b;
	}

	public static json(a: WeeklyRankLast, data) {
		data = JSON.parse(data);
		for(let k in data) {
			a[k] = data[k];
		};
		return a;
	}

	public static setProperty(a: WeeklyRankLast, p: number, value) {
		a[this.params[p]] = value;
		return a;
	}

}if(!gd3d.__ExcDate__)gd3d.__ExcDate__= { } ; if(!gd3d.__ExcDate__.__list) gd3d.__ExcDate__.__list = []; gd3d.__ExcDate__.__list.push(WeeklyRankLast);