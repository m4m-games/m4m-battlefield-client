//请在项目中，将 SyncObject、cMap 注入到 gd3d.__ExcDate__ 对象上。
 import { ExcelDataBase } from "Data/ExcelDataBase";
import { cMap } from "Data/Map";
declare let gd3d;
export class ShopSet extends ExcelDataBase{
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
	public static getlist:(offset?:number, count?:number) => Promise<ShopSet>;

	/**配置ID*/
	public id:string;
	/**商店ID*/
	public shopId:number;
	/**备注*/
	public desc:string;
	/**道具名字*/
	public itemName:string;
	/**商品列表*/
	public goodsList:number;
	/**货币类型*/
	public shopType:string[];
	/**实际售价*/
	public sellPrice:number[];
	/**显示原价*/
	public showPrice:number[];
	/**折扣*/
	public onOff:number[];
	/**是否显示*/
	public visible:boolean;


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

var baseData:ShopSet = new ShopSet ();	
	baseData.id=br.readUTFBytes();
	
	baseData.shopId=br.readInt32();
	
	baseData.desc=br.readUTFBytes();
	
	baseData.itemName=br.readUTFBytes();
	
	baseData.goodsList=br.readUInt32();
	
	baseData.shopType = (() => { let cache:any[] = []; let len = br.readUInt32(); for(let i=0;i<len;i++) {cache.push(br.readUTFBytes());}return cache;})();
	
	baseData.sellPrice = (() => { let cache:any[] = []; let len = br.readUInt32(); for(let i=0;i<len;i++) {cache.push(br.readFloat());}return cache;})();
	
	baseData.showPrice = (() => { let cache:any[] = []; let len = br.readUInt32(); for(let i=0;i<len;i++) {cache.push(br.readFloat());}return cache;})();
	
	baseData.onOff = (() => { let cache:any[] = []; let len = br.readUInt32(); for(let i=0;i<len;i++) {cache.push(br.readFloat());}return cache;})();
	
	baseData.visible=br.readBoolean();
	
	this.list.set(baseData.id, baseData);

}
}
public static  clone(old:ShopSet):ShopSet{
var clone :ShopSet = new ShopSet();
	clone.id=old.id;
	
	clone.shopId=old.shopId;
	
	clone.desc=old.desc;
	
	clone.itemName=old.itemName;
	
	clone.goodsList=old.goodsList;
	
	clone.shopType=old.shopType;
	
	clone.sellPrice=old.sellPrice;
	
	clone.showPrice=old.showPrice;
	
	clone.onOff=old.onOff;
	
	clone.visible=old.visible;
	
return clone;
}

public   clone(old:ShopSet){
	this.id=old.id;
	
	this.shopId=old.shopId;
	
	this.desc=old.desc;
	
	this.itemName=old.itemName;
	
	this.goodsList=old.goodsList;
	
	this.shopType=old.shopType;
	
	this.sellPrice=old.sellPrice;
	
	this.showPrice=old.showPrice;
	
	this.onOff=old.onOff;
	
	this.visible=old.visible;
	
}
	private static params = ["id","shopId","desc","itemName","goodsList","shopType","sellPrice","showPrice","onOff","visible",];
	public static add(a: ShopSet, b: ShopSet, start: number = 0, end: number, limit: ShopSet) {
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

	public static sub(a: ShopSet, b: ShopSet, start: number = 0, end: number) {
		if(!a || !b) return null;
		let result = this.clone(a);
		for(let i = Math.max(start, 0), e = Math.min(end, this.params.length); i < e; i++) {
			const par = this.params[i];
			result[par] -= b[par];
		}
		return result;
	}

	public static random(src: ShopSet, i: number = 0) {
		if(src[this.params[i]] == 0) // NOTE:
			src[this.params[i]] = Math.random();
		return JSON.stringify(src);
	}

	public static large(a: ShopSet, b: ShopSet, i: number = 0) {
		return a[this.params[i]] > b[this.params[i]];
	}

	public static max(a: ShopSet, b: ShopSet, i: number = 0) {
		if(a[this.params[i]] > b[this.params[i]])
			return a;
		return b;
	}

	public static json(a: ShopSet, data) {
		data = JSON.parse(data);
		for(let k in data) {
			a[k] = data[k];
		};
		return a;
	}

	public static setProperty(a: ShopSet, p: number, value) {
		a[this.params[p]] = value;
		return a;
	}

}if(!gd3d.__ExcDate__)gd3d.__ExcDate__= { } ; if(!gd3d.__ExcDate__.__list) gd3d.__ExcDate__.__list = []; gd3d.__ExcDate__.__list.push(ShopSet);