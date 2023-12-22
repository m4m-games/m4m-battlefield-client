//请在项目中，将 SyncObject、cMap 注入到 gd3d.__ExcDate__ 对象上。
 import { ExcelDataBase } from "Data/ExcelDataBase";
import { cMap } from "Data/Map";
declare let gd3d;
export class ItemData extends ExcelDataBase{
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
	public static getlist:(offset?:number, count?:number) => Promise<ItemData>;

	/**ID*/
	public id:string;
	/**道具名字*/
	public itemName:string;
	/**配置ID*/
	public baseId:number;
	/**数量*/
	public count:number;
	/**最大数量*/
	public maxNum:number;
	/**来源*/
	public fromWhere:string;
	/**获取使用货币*/
	public buyCurrency:string;
	/**描述*/
	public desc:string;
	/**图标*/
	public icon:string;
	/**模型*/
	public model:string;
	/**道具类型*/
	public itemType:number;
	/**道具部位*/
	public itemSetpos:number;
	/**特效*/
	public effect:string;
	/**属性*/
	public status:string;
	/**等级*/
	public lv:number;
	/**稀有度*/
	public rera:number;
	/**品质*/
	public quality:number;
	/**持有者*/
	public playerUuid:string;
	/**获取时间*/
	public getTime:number;


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

var baseData:ItemData = new ItemData ();	
	baseData.id=br.readUTFBytes();
	
	baseData.itemName=br.readUTFBytes();
	
	baseData.baseId=br.readUInt32();
	
	baseData.count=br.readUInt32();
	
	baseData.maxNum=br.readUInt32();
	
	baseData.fromWhere=br.readUTFBytes();
	
	baseData.buyCurrency=br.readUTFBytes();
	
	baseData.desc=br.readUTFBytes();
	
	baseData.icon=br.readUTFBytes();
	
	baseData.model=br.readUTFBytes();
	
	baseData.itemType=br.readInt32();
	
	baseData.itemSetpos=br.readInt32();
	
	baseData.effect=br.readUTFBytes();
	
	baseData.status=br.readUTFBytes();
	
	baseData.lv=br.readInt32();
	
	baseData.rera=br.readInt32();
	
	baseData.quality=br.readInt32();
	
	baseData.playerUuid=br.readUTFBytes();
	
	baseData.getTime=br.readDouble();
	
	this.list.set(baseData.id, baseData);

}
}
public static  clone(old:ItemData):ItemData{
var clone :ItemData = new ItemData();
	clone.id=old.id;
	
	clone.itemName=old.itemName;
	
	clone.baseId=old.baseId;
	
	clone.count=old.count;
	
	clone.maxNum=old.maxNum;
	
	clone.fromWhere=old.fromWhere;
	
	clone.buyCurrency=old.buyCurrency;
	
	clone.desc=old.desc;
	
	clone.icon=old.icon;
	
	clone.model=old.model;
	
	clone.itemType=old.itemType;
	
	clone.itemSetpos=old.itemSetpos;
	
	clone.effect=old.effect;
	
	clone.status=old.status;
	
	clone.lv=old.lv;
	
	clone.rera=old.rera;
	
	clone.quality=old.quality;
	
	clone.playerUuid=old.playerUuid;
	
	clone.getTime=old.getTime;
	
return clone;
}

public   clone(old:ItemData){
	this.id=old.id;
	
	this.itemName=old.itemName;
	
	this.baseId=old.baseId;
	
	this.count=old.count;
	
	this.maxNum=old.maxNum;
	
	this.fromWhere=old.fromWhere;
	
	this.buyCurrency=old.buyCurrency;
	
	this.desc=old.desc;
	
	this.icon=old.icon;
	
	this.model=old.model;
	
	this.itemType=old.itemType;
	
	this.itemSetpos=old.itemSetpos;
	
	this.effect=old.effect;
	
	this.status=old.status;
	
	this.lv=old.lv;
	
	this.rera=old.rera;
	
	this.quality=old.quality;
	
	this.playerUuid=old.playerUuid;
	
	this.getTime=old.getTime;
	
}
	private static params = ["id","itemName","baseId","count","maxNum","fromWhere","buyCurrency","desc","icon","model","itemType","itemSetpos","effect","status","lv","rera","quality","playerUuid","getTime",];
	public static add(a: ItemData, b: ItemData, start: number = 0, end: number, limit: ItemData) {
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

	public static sub(a: ItemData, b: ItemData, start: number = 0, end: number) {
		if(!a || !b) return null;
		let result = this.clone(a);
		for(let i = Math.max(start, 0), e = Math.min(end, this.params.length); i < e; i++) {
			const par = this.params[i];
			result[par] -= b[par];
		}
		return result;
	}

	public static random(src: ItemData, i: number = 0) {
		if(src[this.params[i]] == 0) // NOTE:
			src[this.params[i]] = Math.random();
		return JSON.stringify(src);
	}

	public static large(a: ItemData, b: ItemData, i: number = 0) {
		return a[this.params[i]] > b[this.params[i]];
	}

	public static max(a: ItemData, b: ItemData, i: number = 0) {
		if(a[this.params[i]] > b[this.params[i]])
			return a;
		return b;
	}

	public static json(a: ItemData, data) {
		data = JSON.parse(data);
		for(let k in data) {
			a[k] = data[k];
		};
		return a;
	}

	public static setProperty(a: ItemData, p: number, value) {
		a[this.params[p]] = value;
		return a;
	}

}if(!gd3d.__ExcDate__)gd3d.__ExcDate__= { } ; if(!gd3d.__ExcDate__.__list) gd3d.__ExcDate__.__list = []; gd3d.__ExcDate__.__list.push(ItemData);