//请在项目中，将 SyncObject、cMap 注入到 gd3d.__ExcDate__ 对象上。
 import { ExcelDataBase } from "Data/ExcelDataBase";
import { cMap } from "Data/Map";
declare let gd3d;
export class ItemLog extends ExcelDataBase{
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
	public static getlist:(offset?:number, count?:number) => Promise<ItemLog>;

	/**ID*/
	public id:string;
	/**道具名字*/
	public itemName:string;
	/**数据ID*/
	public dataId:string;
	/**数量*/
	public count:number;
	/**获取使用货币*/
	public buyCurrency:string;
	/**持有者*/
	public playerUuid:string;
	/**消耗时间*/
	public useTime:number;
	/**消耗方式*/
	public useType:number;


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

var baseData:ItemLog = new ItemLog ();	
	baseData.id=br.readUTFBytes();
	
	baseData.itemName=br.readUTFBytes();
	
	baseData.dataId=br.readUTFBytes();
	
	baseData.count=br.readUInt32();
	
	baseData.buyCurrency=br.readUTFBytes();
	
	baseData.playerUuid=br.readUTFBytes();
	
	baseData.useTime=br.readDouble();
	
	baseData.useType=br.readByte();
	
	this.list.set(baseData.id, baseData);

}
}
public static  clone(old:ItemLog):ItemLog{
var clone :ItemLog = new ItemLog();
	clone.id=old.id;
	
	clone.itemName=old.itemName;
	
	clone.dataId=old.dataId;
	
	clone.count=old.count;
	
	clone.buyCurrency=old.buyCurrency;
	
	clone.playerUuid=old.playerUuid;
	
	clone.useTime=old.useTime;
	
	clone.useType=old.useType;
	
return clone;
}

public   clone(old:ItemLog){
	this.id=old.id;
	
	this.itemName=old.itemName;
	
	this.dataId=old.dataId;
	
	this.count=old.count;
	
	this.buyCurrency=old.buyCurrency;
	
	this.playerUuid=old.playerUuid;
	
	this.useTime=old.useTime;
	
	this.useType=old.useType;
	
}
	private static params = ["id","itemName","dataId","count","buyCurrency","playerUuid","useTime","useType",];
	public static add(a: ItemLog, b: ItemLog, start: number = 0, end: number, limit: ItemLog) {
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

	public static sub(a: ItemLog, b: ItemLog, start: number = 0, end: number) {
		if(!a || !b) return null;
		let result = this.clone(a);
		for(let i = Math.max(start, 0), e = Math.min(end, this.params.length); i < e; i++) {
			const par = this.params[i];
			result[par] -= b[par];
		}
		return result;
	}

	public static random(src: ItemLog, i: number = 0) {
		if(src[this.params[i]] == 0) // NOTE:
			src[this.params[i]] = Math.random();
		return JSON.stringify(src);
	}

	public static large(a: ItemLog, b: ItemLog, i: number = 0) {
		return a[this.params[i]] > b[this.params[i]];
	}

	public static max(a: ItemLog, b: ItemLog, i: number = 0) {
		if(a[this.params[i]] > b[this.params[i]])
			return a;
		return b;
	}

	public static json(a: ItemLog, data) {
		data = JSON.parse(data);
		for(let k in data) {
			a[k] = data[k];
		};
		return a;
	}

	public static setProperty(a: ItemLog, p: number, value) {
		a[this.params[p]] = value;
		return a;
	}

}if(!gd3d.__ExcDate__)gd3d.__ExcDate__= { } ; if(!gd3d.__ExcDate__.__list) gd3d.__ExcDate__.__list = []; gd3d.__ExcDate__.__list.push(ItemLog);