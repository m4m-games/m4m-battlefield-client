//请在项目中，将 SyncObject、cMap 注入到 gd3d.__ExcDate__ 对象上。
 import { ExcelDataBase } from "Data/ExcelDataBase";
import { cMap } from "Data/Map";
declare let gd3d;
export class CookieGameData extends ExcelDataBase{
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
	public static getlist:(offset?:number, count?:number) => Promise<CookieGameData>;

	/**配置ID*/
	public id:string;
	/**糖饼ID*/
	public cookieID:number;
	/**最大血量*/
	public maxHp:number;
	/**当前血量*/
	public hp:number;
	/**缩放*/
	public scale:number;
	/**旋转*/
	public rot:number;
	/**游戏数据*/
	public dataJson:string;


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

var baseData:CookieGameData = new CookieGameData ();	
	baseData.id=br.readUTFBytes();
	
	baseData.cookieID=br.readInt32();
	
	baseData.maxHp=br.readUInt32();
	
	baseData.hp=br.readUInt32();
	
	baseData.scale=br.readFloat();
	
	baseData.rot=br.readInt32();
	
	baseData.dataJson=br.readUTFBytes();
	
	this.list.set(baseData.id, baseData);

}
}
public static  clone(old:CookieGameData):CookieGameData{
var clone :CookieGameData = new CookieGameData();
	clone.id=old.id;
	
	clone.cookieID=old.cookieID;
	
	clone.maxHp=old.maxHp;
	
	clone.hp=old.hp;
	
	clone.scale=old.scale;
	
	clone.rot=old.rot;
	
	clone.dataJson=old.dataJson;
	
return clone;
}

public   clone(old:CookieGameData){
	this.id=old.id;
	
	this.cookieID=old.cookieID;
	
	this.maxHp=old.maxHp;
	
	this.hp=old.hp;
	
	this.scale=old.scale;
	
	this.rot=old.rot;
	
	this.dataJson=old.dataJson;
	
}
	private static params = ["id","cookieID","maxHp","hp","scale","rot","dataJson",];
	public static add(a: CookieGameData, b: CookieGameData, start: number = 0, end: number, limit: CookieGameData) {
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

	public static sub(a: CookieGameData, b: CookieGameData, start: number = 0, end: number) {
		if(!a || !b) return null;
		let result = this.clone(a);
		for(let i = Math.max(start, 0), e = Math.min(end, this.params.length); i < e; i++) {
			const par = this.params[i];
			result[par] -= b[par];
		}
		return result;
	}

	public static random(src: CookieGameData, i: number = 0) {
		if(src[this.params[i]] == 0) // NOTE:
			src[this.params[i]] = Math.random();
		return JSON.stringify(src);
	}

	public static large(a: CookieGameData, b: CookieGameData, i: number = 0) {
		return a[this.params[i]] > b[this.params[i]];
	}

	public static max(a: CookieGameData, b: CookieGameData, i: number = 0) {
		if(a[this.params[i]] > b[this.params[i]])
			return a;
		return b;
	}

	public static json(a: CookieGameData, data) {
		data = JSON.parse(data);
		for(let k in data) {
			a[k] = data[k];
		};
		return a;
	}

	public static setProperty(a: CookieGameData, p: number, value) {
		a[this.params[p]] = value;
		return a;
	}

}if(!gd3d.__ExcDate__)gd3d.__ExcDate__= { } ; if(!gd3d.__ExcDate__.__list) gd3d.__ExcDate__.__list = []; gd3d.__ExcDate__.__list.push(CookieGameData);