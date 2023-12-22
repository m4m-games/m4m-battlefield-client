//请在项目中，将 SyncObject、cMap 注入到 gd3d.__ExcDate__ 对象上。
 import { ExcelDataBase } from "Data/ExcelDataBase";
import { cMap } from "Data/Map";
declare let gd3d;
export class SeverConfigBase extends ExcelDataBase{
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
	public static getlist:(offset?:number, count?:number) => Promise<SeverConfigBase>;

	/**配置ID*/
	public id:string;
	/**备注*/
	public desc:string;
	/**ip*/
	public ip:string;
	/**网关地址*/
	public gateway:string;
	/**MAC地址*/
	public MAC:string;
	/**启动时间*/
	public setupTime:number;
	/**状态*/
	public status:number;
	/**当前人数*/
	public playerSum:number;
	/**是否为网关*/
	public isGate:boolean;
	/**备注IP*/
	public descIP:string;
	/**心跳断开限制*/
	public heatbeatLimit:number;
	/**日排名人数*/
	public dailyRankMax:number;
	/**周排名人数*/
	public weeklyRankMax:number;
	/**月排名人数*/
	public monthlyRankMax:number;
	/**日排名一页显示*/
	public dailyPage:number;
	/**周排名一页显示*/
	public weeklyPage:number;
	/**月排名一页显示*/
	public monthlyPage:number;
	/**是否使用钱包*/
	public useWallet:boolean;


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

var baseData:SeverConfigBase = new SeverConfigBase ();	
	baseData.id=br.readUTFBytes();
	
	baseData.desc=br.readUTFBytes();
	
	baseData.ip=br.readUTFBytes();
	
	baseData.gateway=br.readUTFBytes();
	
	baseData.MAC=br.readUTFBytes();
	
	baseData.setupTime=br.readDouble();
	
	baseData.status=br.readByte();
	
	baseData.playerSum=br.readUInt32();
	
	baseData.isGate=br.readBoolean();
	
	baseData.descIP=br.readUTFBytes();
	
	baseData.heatbeatLimit=br.readUInt32();
	
	baseData.dailyRankMax=br.readUInt32();
	
	baseData.weeklyRankMax=br.readUInt32();
	
	baseData.monthlyRankMax=br.readUInt32();
	
	baseData.dailyPage=br.readUInt32();
	
	baseData.weeklyPage=br.readUInt32();
	
	baseData.monthlyPage=br.readUInt32();
	
	baseData.useWallet=br.readBoolean();
	
	this.list.set(baseData.id, baseData);

}
}
public static  clone(old:SeverConfigBase):SeverConfigBase{
var clone :SeverConfigBase = new SeverConfigBase();
	clone.id=old.id;
	
	clone.desc=old.desc;
	
	clone.ip=old.ip;
	
	clone.gateway=old.gateway;
	
	clone.MAC=old.MAC;
	
	clone.setupTime=old.setupTime;
	
	clone.status=old.status;
	
	clone.playerSum=old.playerSum;
	
	clone.isGate=old.isGate;
	
	clone.descIP=old.descIP;
	
	clone.heatbeatLimit=old.heatbeatLimit;
	
	clone.dailyRankMax=old.dailyRankMax;
	
	clone.weeklyRankMax=old.weeklyRankMax;
	
	clone.monthlyRankMax=old.monthlyRankMax;
	
	clone.dailyPage=old.dailyPage;
	
	clone.weeklyPage=old.weeklyPage;
	
	clone.monthlyPage=old.monthlyPage;
	
	clone.useWallet=old.useWallet;
	
return clone;
}

public   clone(old:SeverConfigBase){
	this.id=old.id;
	
	this.desc=old.desc;
	
	this.ip=old.ip;
	
	this.gateway=old.gateway;
	
	this.MAC=old.MAC;
	
	this.setupTime=old.setupTime;
	
	this.status=old.status;
	
	this.playerSum=old.playerSum;
	
	this.isGate=old.isGate;
	
	this.descIP=old.descIP;
	
	this.heatbeatLimit=old.heatbeatLimit;
	
	this.dailyRankMax=old.dailyRankMax;
	
	this.weeklyRankMax=old.weeklyRankMax;
	
	this.monthlyRankMax=old.monthlyRankMax;
	
	this.dailyPage=old.dailyPage;
	
	this.weeklyPage=old.weeklyPage;
	
	this.monthlyPage=old.monthlyPage;
	
	this.useWallet=old.useWallet;
	
}
	private static params = ["id","desc","ip","gateway","MAC","setupTime","status","playerSum","isGate","descIP","heatbeatLimit","dailyRankMax","weeklyRankMax","monthlyRankMax","dailyPage","weeklyPage","monthlyPage","useWallet",];
	public static add(a: SeverConfigBase, b: SeverConfigBase, start: number = 0, end: number, limit: SeverConfigBase) {
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

	public static sub(a: SeverConfigBase, b: SeverConfigBase, start: number = 0, end: number) {
		if(!a || !b) return null;
		let result = this.clone(a);
		for(let i = Math.max(start, 0), e = Math.min(end, this.params.length); i < e; i++) {
			const par = this.params[i];
			result[par] -= b[par];
		}
		return result;
	}

	public static random(src: SeverConfigBase, i: number = 0) {
		if(src[this.params[i]] == 0) // NOTE:
			src[this.params[i]] = Math.random();
		return JSON.stringify(src);
	}

	public static large(a: SeverConfigBase, b: SeverConfigBase, i: number = 0) {
		return a[this.params[i]] > b[this.params[i]];
	}

	public static max(a: SeverConfigBase, b: SeverConfigBase, i: number = 0) {
		if(a[this.params[i]] > b[this.params[i]])
			return a;
		return b;
	}

	public static json(a: SeverConfigBase, data) {
		data = JSON.parse(data);
		for(let k in data) {
			a[k] = data[k];
		};
		return a;
	}

	public static setProperty(a: SeverConfigBase, p: number, value) {
		a[this.params[p]] = value;
		return a;
	}

}if(!gd3d.__ExcDate__)gd3d.__ExcDate__= { } ; if(!gd3d.__ExcDate__.__list) gd3d.__ExcDate__.__list = []; gd3d.__ExcDate__.__list.push(SeverConfigBase);