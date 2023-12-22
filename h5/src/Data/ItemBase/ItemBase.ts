//请在项目中，将 SyncObject、cMap 注入到 gd3d.__ExcDate__ 对象上。
 import { ExcelDataBase } from "Data/ExcelDataBase";
import { cMap } from "Data/Map";
declare let gd3d;
export class ItemBase extends ExcelDataBase{
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
	public static getlist:(offset?:number, count?:number) => Promise<ItemBase>;

	/**配置ID*/
	public id:number;
	/**道具名字*/
	public itemName:string;
	/**图标*/
	public icon:string;
	/**模型*/
	public model:string;
	/**描述*/
	public desc:string;
	/**特效*/
	public effect:string;
	/**道具类型*/
	public itemType:number;
	/**道具部位*/
	public itemSetpos:number;
	/**属性*/
	public status:string;
	/**最大数量*/
	public maxNum:number;
	/**等级*/
	public lv:number;
	/**稀有度*/
	public rera:number;
	/**品质*/
	public quality:number;
	/**货币相关配置*/
	public currency:string;
	/**显示货币配置*/
	public showCurrency:string;


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

var baseData:ItemBase = new ItemBase ();	
	baseData.id=br.readUInt32();
	
	baseData.itemName=br.readUTFBytes();
	
	baseData.icon=br.readUTFBytes();
	
	baseData.model=br.readUTFBytes();
	
	baseData.desc=br.readUTFBytes();
	
	baseData.effect=br.readUTFBytes();
	
	baseData.itemType=br.readInt32();
	
	baseData.itemSetpos=br.readInt32();
	
	baseData.status=br.readUTFBytes();
	
	baseData.maxNum=br.readInt32();
	
	baseData.lv=br.readInt32();
	
	baseData.rera=br.readInt32();
	
	baseData.quality=br.readInt32();
	
	baseData.currency=br.readUTFBytes();
	
	baseData.showCurrency=br.readUTFBytes();
	
	this.list.set(baseData.id, baseData);

}
}
public static  clone(old:ItemBase):ItemBase{
var clone :ItemBase = new ItemBase();
	clone.id=old.id;
	
	clone.itemName=old.itemName;
	
	clone.icon=old.icon;
	
	clone.model=old.model;
	
	clone.desc=old.desc;
	
	clone.effect=old.effect;
	
	clone.itemType=old.itemType;
	
	clone.itemSetpos=old.itemSetpos;
	
	clone.status=old.status;
	
	clone.maxNum=old.maxNum;
	
	clone.lv=old.lv;
	
	clone.rera=old.rera;
	
	clone.quality=old.quality;
	
	clone.currency=old.currency;
	
	clone.showCurrency=old.showCurrency;
	
return clone;
}

public   clone(old:ItemBase){
	this.id=old.id;
	
	this.itemName=old.itemName;
	
	this.icon=old.icon;
	
	this.model=old.model;
	
	this.desc=old.desc;
	
	this.effect=old.effect;
	
	this.itemType=old.itemType;
	
	this.itemSetpos=old.itemSetpos;
	
	this.status=old.status;
	
	this.maxNum=old.maxNum;
	
	this.lv=old.lv;
	
	this.rera=old.rera;
	
	this.quality=old.quality;
	
	this.currency=old.currency;
	
	this.showCurrency=old.showCurrency;
	
}
	private static params = ["id","itemName","icon","model","desc","effect","itemType","itemSetpos","status","maxNum","lv","rera","quality","currency","showCurrency",];
	public static add(a: ItemBase, b: ItemBase, start: number = 0, end: number, limit: ItemBase) {
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

	public static sub(a: ItemBase, b: ItemBase, start: number = 0, end: number) {
		if(!a || !b) return null;
		let result = this.clone(a);
		for(let i = Math.max(start, 0), e = Math.min(end, this.params.length); i < e; i++) {
			const par = this.params[i];
			result[par] -= b[par];
		}
		return result;
	}

	public static random(src: ItemBase, i: number = 0) {
		if(src[this.params[i]] == 0) // NOTE:
			src[this.params[i]] = Math.random();
		return JSON.stringify(src);
	}

	public static large(a: ItemBase, b: ItemBase, i: number = 0) {
		return a[this.params[i]] > b[this.params[i]];
	}

	public static max(a: ItemBase, b: ItemBase, i: number = 0) {
		if(a[this.params[i]] > b[this.params[i]])
			return a;
		return b;
	}

	public static json(a: ItemBase, data) {
		data = JSON.parse(data);
		for(let k in data) {
			a[k] = data[k];
		};
		return a;
	}

	public static setProperty(a: ItemBase, p: number, value) {
		a[this.params[p]] = value;
		return a;
	}

}if(!gd3d.__ExcDate__)gd3d.__ExcDate__= { } ; if(!gd3d.__ExcDate__.__list) gd3d.__ExcDate__.__list = []; gd3d.__ExcDate__.__list.push(ItemBase);