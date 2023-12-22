//请在项目中，将 SyncObject、cMap 注入到 gd3d.__ExcDate__ 对象上。
 import { ExcelDataBase } from "Data/ExcelDataBase";
import { cMap } from "Data/Map";
declare let gd3d;
export class SettingList extends ExcelDataBase{
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
	public static getlist:(offset?:number, count?:number) => Promise<SettingList>;

	/**配置类型ID*/
	public id:number;
	/**配置类别ID*/
	public shopId:number;
	/**设置类型*/
	public settingType:string;
	/**描述*/
	public desc:string;
	/**类型*/
	public type:number;
	/**数值*/
	public value:number;
	/**属性*/
	public status:string;
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

var baseData:SettingList = new SettingList ();	
	baseData.id=br.readUInt32();
	
	baseData.shopId=br.readInt32();
	
	baseData.settingType=br.readUTFBytes();
	
	baseData.desc=br.readUTFBytes();
	
	baseData.type=br.readInt32();
	
	baseData.value=br.readByte();
	
	baseData.status=br.readUTFBytes();
	
	baseData.visible=br.readBoolean();
	
	this.list.set(baseData.id, baseData);

}
}
public static  clone(old:SettingList):SettingList{
var clone :SettingList = new SettingList();
	clone.id=old.id;
	
	clone.shopId=old.shopId;
	
	clone.settingType=old.settingType;
	
	clone.desc=old.desc;
	
	clone.type=old.type;
	
	clone.value=old.value;
	
	clone.status=old.status;
	
	clone.visible=old.visible;
	
return clone;
}

public   clone(old:SettingList){
	this.id=old.id;
	
	this.shopId=old.shopId;
	
	this.settingType=old.settingType;
	
	this.desc=old.desc;
	
	this.type=old.type;
	
	this.value=old.value;
	
	this.status=old.status;
	
	this.visible=old.visible;
	
}
	private static params = ["id","shopId","settingType","desc","type","value","status","visible",];
	public static add(a: SettingList, b: SettingList, start: number = 0, end: number, limit: SettingList) {
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

	public static sub(a: SettingList, b: SettingList, start: number = 0, end: number) {
		if(!a || !b) return null;
		let result = this.clone(a);
		for(let i = Math.max(start, 0), e = Math.min(end, this.params.length); i < e; i++) {
			const par = this.params[i];
			result[par] -= b[par];
		}
		return result;
	}

	public static random(src: SettingList, i: number = 0) {
		if(src[this.params[i]] == 0) // NOTE:
			src[this.params[i]] = Math.random();
		return JSON.stringify(src);
	}

	public static large(a: SettingList, b: SettingList, i: number = 0) {
		return a[this.params[i]] > b[this.params[i]];
	}

	public static max(a: SettingList, b: SettingList, i: number = 0) {
		if(a[this.params[i]] > b[this.params[i]])
			return a;
		return b;
	}

	public static json(a: SettingList, data) {
		data = JSON.parse(data);
		for(let k in data) {
			a[k] = data[k];
		};
		return a;
	}

	public static setProperty(a: SettingList, p: number, value) {
		a[this.params[p]] = value;
		return a;
	}

}if(!gd3d.__ExcDate__)gd3d.__ExcDate__= { } ; if(!gd3d.__ExcDate__.__list) gd3d.__ExcDate__.__list = []; gd3d.__ExcDate__.__list.push(SettingList);