//请在项目中，将 SyncObject、cMap 注入到 gd3d.__ExcDate__ 对象上。
 import { ExcelDataBase } from "Data/ExcelDataBase";
import { cMap } from "Data/Map";
declare let gd3d;
export class ShopList extends ExcelDataBase{
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
	public static getlist:(offset?:number, count?:number) => Promise<ShopList>;

	/**配置ID*/
	public id:string;
	/**备注*/
	public desc:string;
	/**道具配置*/
	public itemData:string;
	/**货币类型*/
	public shopType:string[];
	/**实际售价*/
	public sellPrice:number[];
	/**显示原价*/
	public showPrice:number[];
	/**折扣*/
	public onOff:number[];


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

var baseData:ShopList = new ShopList ();	
	baseData.id=br.readUTFBytes();
	
	baseData.desc=br.readUTFBytes();
	
	baseData.itemData=br.readUTFBytes();
	
	baseData.shopType = (() => { let cache:any[] = []; let len = br.readUInt32(); for(let i=0;i<len;i++) {cache.push(br.readUTFBytes());}return cache;})();
	
	baseData.sellPrice = (() => { let cache:any[] = []; let len = br.readUInt32(); for(let i=0;i<len;i++) {cache.push(br.readFloat());}return cache;})();
	
	baseData.showPrice = (() => { let cache:any[] = []; let len = br.readUInt32(); for(let i=0;i<len;i++) {cache.push(br.readFloat());}return cache;})();
	
	baseData.onOff = (() => { let cache:any[] = []; let len = br.readUInt32(); for(let i=0;i<len;i++) {cache.push(br.readFloat());}return cache;})();
	
	this.list.set(baseData.id, baseData);

}
}
public static  clone(old:ShopList):ShopList{
var clone :ShopList = new ShopList();
	clone.id=old.id;
	
	clone.desc=old.desc;
	
	clone.itemData=old.itemData;
	
	clone.shopType=old.shopType;
	
	clone.sellPrice=old.sellPrice;
	
	clone.showPrice=old.showPrice;
	
	clone.onOff=old.onOff;
	
return clone;
}

public   clone(old:ShopList){
	this.id=old.id;
	
	this.desc=old.desc;
	
	this.itemData=old.itemData;
	
	this.shopType=old.shopType;
	
	this.sellPrice=old.sellPrice;
	
	this.showPrice=old.showPrice;
	
	this.onOff=old.onOff;
	
}
	private static params = ["id","desc","itemData","shopType","sellPrice","showPrice","onOff",];
	public static add(a: ShopList, b: ShopList, start: number = 0, end: number, limit: ShopList) {
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

	public static sub(a: ShopList, b: ShopList, start: number = 0, end: number) {
		if(!a || !b) return null;
		let result = this.clone(a);
		for(let i = Math.max(start, 0), e = Math.min(end, this.params.length); i < e; i++) {
			const par = this.params[i];
			result[par] -= b[par];
		}
		return result;
	}

	public static random(src: ShopList, i: number = 0) {
		if(src[this.params[i]] == 0) // NOTE:
			src[this.params[i]] = Math.random();
		return JSON.stringify(src);
	}

	public static large(a: ShopList, b: ShopList, i: number = 0) {
		return a[this.params[i]] > b[this.params[i]];
	}

	public static max(a: ShopList, b: ShopList, i: number = 0) {
		if(a[this.params[i]] > b[this.params[i]])
			return a;
		return b;
	}

	public static json(a: ShopList, data) {
		data = JSON.parse(data);
		for(let k in data) {
			a[k] = data[k];
		};
		return a;
	}

	public static setProperty(a: ShopList, p: number, value) {
		a[this.params[p]] = value;
		return a;
	}

}if(!gd3d.__ExcDate__)gd3d.__ExcDate__= { } ; if(!gd3d.__ExcDate__.__list) gd3d.__ExcDate__.__list = []; gd3d.__ExcDate__.__list.push(ShopList);