//请在项目中，将 SyncObject、cMap 注入到 gd3d.__ExcDate__ 对象上。
 import { ExcelDataBase } from "Data/ExcelDataBase";
import { cMap } from "Data/Map";
declare let gd3d;
export class HallConfigBase extends ExcelDataBase{
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
	public static getlist:(offset?:number, count?:number) => Promise<HallConfigBase>;

	/**大厅ID*/
	public id:string;
	/**备注*/
	public desc:string;
	/**玩家列表*/
	public players:string;
	/**游戏配置*/
	public gameConfig:string;
	/**大厅状态*/
	public hallStatus:number;
	/**房间最大人数*/
	public maxPlayer:number;


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

var baseData:HallConfigBase = new HallConfigBase ();	
	baseData.id=br.readUTFBytes();
	
	baseData.desc=br.readUTFBytes();
	
	baseData.players=br.readUTFBytes();
	
	baseData.gameConfig=br.readUTFBytes();
	
	baseData.hallStatus=br.readByte();
	
	baseData.maxPlayer=br.readInt32();
	
	this.list.set(baseData.id, baseData);

}
}
public static  clone(old:HallConfigBase):HallConfigBase{
var clone :HallConfigBase = new HallConfigBase();
	clone.id=old.id;
	
	clone.desc=old.desc;
	
	clone.players=old.players;
	
	clone.gameConfig=old.gameConfig;
	
	clone.hallStatus=old.hallStatus;
	
	clone.maxPlayer=old.maxPlayer;
	
return clone;
}

public   clone(old:HallConfigBase){
	this.id=old.id;
	
	this.desc=old.desc;
	
	this.players=old.players;
	
	this.gameConfig=old.gameConfig;
	
	this.hallStatus=old.hallStatus;
	
	this.maxPlayer=old.maxPlayer;
	
}
	private static params = ["id","desc","players","gameConfig","hallStatus","maxPlayer",];
	public static add(a: HallConfigBase, b: HallConfigBase, start: number = 0, end: number, limit: HallConfigBase) {
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

	public static sub(a: HallConfigBase, b: HallConfigBase, start: number = 0, end: number) {
		if(!a || !b) return null;
		let result = this.clone(a);
		for(let i = Math.max(start, 0), e = Math.min(end, this.params.length); i < e; i++) {
			const par = this.params[i];
			result[par] -= b[par];
		}
		return result;
	}

	public static random(src: HallConfigBase, i: number = 0) {
		if(src[this.params[i]] == 0) // NOTE:
			src[this.params[i]] = Math.random();
		return JSON.stringify(src);
	}

	public static large(a: HallConfigBase, b: HallConfigBase, i: number = 0) {
		return a[this.params[i]] > b[this.params[i]];
	}

	public static max(a: HallConfigBase, b: HallConfigBase, i: number = 0) {
		if(a[this.params[i]] > b[this.params[i]])
			return a;
		return b;
	}

	public static json(a: HallConfigBase, data) {
		data = JSON.parse(data);
		for(let k in data) {
			a[k] = data[k];
		};
		return a;
	}

	public static setProperty(a: HallConfigBase, p: number, value) {
		a[this.params[p]] = value;
		return a;
	}

}if(!gd3d.__ExcDate__)gd3d.__ExcDate__= { } ; if(!gd3d.__ExcDate__.__list) gd3d.__ExcDate__.__list = []; gd3d.__ExcDate__.__list.push(HallConfigBase);