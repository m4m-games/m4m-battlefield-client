//请在项目中，将 SyncObject、cMap 注入到 gd3d.__ExcDate__ 对象上。
 import { ExcelDataBase } from "Data/ExcelDataBase";
import { cMap } from "Data/Map";
declare let gd3d;
export class GamesTicketBase extends ExcelDataBase{
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
	public static getlist:(offset?:number, count?:number) => Promise<GamesTicketBase>;

	/**配置ID*/
	public id:number;
	/**备注*/
	public desc:string;
	/**对应关卡显示大图*/
	public rawpicture:string;
	/**门票ID*/
	public ticketID:number;
	/**门票UI*/
	public ticketUI:string;
	/**使用门票*/
	public ticketUse:number;
	/**游戏类名*/
	public gameClass:string;
	/**场景id*/
	public sceneBase:number;
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

var baseData:GamesTicketBase = new GamesTicketBase ();	
	baseData.id=br.readUInt32();
	
	baseData.desc=br.readUTFBytes();
	
	baseData.rawpicture=br.readUTFBytes();
	
	baseData.ticketID=br.readUInt32();
	
	baseData.ticketUI=br.readUTFBytes();
	
	baseData.ticketUse=br.readUInt32();
	
	baseData.gameClass=br.readUTFBytes();
	
	baseData.sceneBase=br.readUInt32();
	
	baseData.visible=br.readBoolean();
	
	this.list.set(baseData.id, baseData);

}
}
public static  clone(old:GamesTicketBase):GamesTicketBase{
var clone :GamesTicketBase = new GamesTicketBase();
	clone.id=old.id;
	
	clone.desc=old.desc;
	
	clone.rawpicture=old.rawpicture;
	
	clone.ticketID=old.ticketID;
	
	clone.ticketUI=old.ticketUI;
	
	clone.ticketUse=old.ticketUse;
	
	clone.gameClass=old.gameClass;
	
	clone.sceneBase=old.sceneBase;
	
	clone.visible=old.visible;
	
return clone;
}

public   clone(old:GamesTicketBase){
	this.id=old.id;
	
	this.desc=old.desc;
	
	this.rawpicture=old.rawpicture;
	
	this.ticketID=old.ticketID;
	
	this.ticketUI=old.ticketUI;
	
	this.ticketUse=old.ticketUse;
	
	this.gameClass=old.gameClass;
	
	this.sceneBase=old.sceneBase;
	
	this.visible=old.visible;
	
}
	private static params = ["id","desc","rawpicture","ticketID","ticketUI","ticketUse","gameClass","sceneBase","visible",];
	public static add(a: GamesTicketBase, b: GamesTicketBase, start: number = 0, end: number, limit: GamesTicketBase) {
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

	public static sub(a: GamesTicketBase, b: GamesTicketBase, start: number = 0, end: number) {
		if(!a || !b) return null;
		let result = this.clone(a);
		for(let i = Math.max(start, 0), e = Math.min(end, this.params.length); i < e; i++) {
			const par = this.params[i];
			result[par] -= b[par];
		}
		return result;
	}

	public static random(src: GamesTicketBase, i: number = 0) {
		if(src[this.params[i]] == 0) // NOTE:
			src[this.params[i]] = Math.random();
		return JSON.stringify(src);
	}

	public static large(a: GamesTicketBase, b: GamesTicketBase, i: number = 0) {
		return a[this.params[i]] > b[this.params[i]];
	}

	public static max(a: GamesTicketBase, b: GamesTicketBase, i: number = 0) {
		if(a[this.params[i]] > b[this.params[i]])
			return a;
		return b;
	}

	public static json(a: GamesTicketBase, data) {
		data = JSON.parse(data);
		for(let k in data) {
			a[k] = data[k];
		};
		return a;
	}

	public static setProperty(a: GamesTicketBase, p: number, value) {
		a[this.params[p]] = value;
		return a;
	}

}if(!gd3d.__ExcDate__)gd3d.__ExcDate__= { } ; if(!gd3d.__ExcDate__.__list) gd3d.__ExcDate__.__list = []; gd3d.__ExcDate__.__list.push(GamesTicketBase);