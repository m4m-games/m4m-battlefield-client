//请在项目中，将 SyncObject、cMap 注入到 gd3d.__ExcDate__ 对象上。
 import { ExcelDataBase } from "Data/ExcelDataBase";
import { cMap } from "Data/Map";
declare let gd3d;
export class DialRiverData extends ExcelDataBase{
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
	public static getlist:(offset?:number, count?:number) => Promise<DialRiverData>;

	/**配置ID*/
	public id:string;
	/**点击方向*/
	public clickType:number;
	/**胜负进度（0-10000）*/
	public progress:number;
	/**玩家分数*/
	public usersPoint:string;
	/**判定角度*/
	public agree:number;
	/**判定持续时间*/
	public checkTime:number;
	/**播放时间*/
	public playTime:number;


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

var baseData:DialRiverData = new DialRiverData ();	
	baseData.id=br.readUTFBytes();
	
	baseData.clickType=br.readByte();
	
	baseData.progress=br.readInt32();
	
	baseData.usersPoint=br.readUTFBytes();
	
	baseData.agree=br.readInt32();
	
	baseData.checkTime=br.readULong();
	
	baseData.playTime=br.readULong();
	
	this.list.set(baseData.id, baseData);

}
}
public static  clone(old:DialRiverData):DialRiverData{
var clone :DialRiverData = new DialRiverData();
	clone.id=old.id;
	
	clone.clickType=old.clickType;
	
	clone.progress=old.progress;
	
	clone.usersPoint=old.usersPoint;
	
	clone.agree=old.agree;
	
	clone.checkTime=old.checkTime;
	
	clone.playTime=old.playTime;
	
return clone;
}

public   clone(old:DialRiverData){
	this.id=old.id;
	
	this.clickType=old.clickType;
	
	this.progress=old.progress;
	
	this.usersPoint=old.usersPoint;
	
	this.agree=old.agree;
	
	this.checkTime=old.checkTime;
	
	this.playTime=old.playTime;
	
}
	private static params = ["id","clickType","progress","usersPoint","agree","checkTime","playTime",];
	public static add(a: DialRiverData, b: DialRiverData, start: number = 0, end: number, limit: DialRiverData) {
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

	public static sub(a: DialRiverData, b: DialRiverData, start: number = 0, end: number) {
		if(!a || !b) return null;
		let result = this.clone(a);
		for(let i = Math.max(start, 0), e = Math.min(end, this.params.length); i < e; i++) {
			const par = this.params[i];
			result[par] -= b[par];
		}
		return result;
	}

	public static random(src: DialRiverData, i: number = 0) {
		if(src[this.params[i]] == 0) // NOTE:
			src[this.params[i]] = Math.random();
		return JSON.stringify(src);
	}

	public static large(a: DialRiverData, b: DialRiverData, i: number = 0) {
		return a[this.params[i]] > b[this.params[i]];
	}

	public static max(a: DialRiverData, b: DialRiverData, i: number = 0) {
		if(a[this.params[i]] > b[this.params[i]])
			return a;
		return b;
	}

	public static json(a: DialRiverData, data) {
		data = JSON.parse(data);
		for(let k in data) {
			a[k] = data[k];
		};
		return a;
	}

	public static setProperty(a: DialRiverData, p: number, value) {
		a[this.params[p]] = value;
		return a;
	}

}if(!gd3d.__ExcDate__)gd3d.__ExcDate__= { } ; if(!gd3d.__ExcDate__.__list) gd3d.__ExcDate__.__list = []; gd3d.__ExcDate__.__list.push(DialRiverData);