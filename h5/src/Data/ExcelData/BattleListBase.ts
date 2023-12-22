//请在项目中，将 SyncObject、cMap 注入到 gd3d.__ExcDate__ 对象上。
 import { ExcelDataBase } from "Data/ExcelDataBase";
import { cMap } from "Data/Map";
declare let gd3d;
export class BattleListBase extends ExcelDataBase{
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
	public static getlist:(offset?:number, count?:number) => Promise<BattleListBase>;

	/**配置ID*/
	public id:string;
	/**关卡*/
	public checkpoint:string;
	/**关卡ID*/
	public checkpointID:number;
	/**场数*/
	public total:number;
	/**胜场*/
	public wins:number;
	/**玩家ID*/
	public userID:string;
	/**最佳战绩*/
	public bestAchievement:number;


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

var baseData:BattleListBase = new BattleListBase ();	
	baseData.id=br.readUTFBytes();
	
	baseData.checkpoint=br.readUTFBytes();
	
	baseData.checkpointID=br.readUInt32();
	
	baseData.total=br.readInt32();
	
	baseData.wins=br.readInt32();
	
	baseData.userID=br.readUTFBytes();
	
	baseData.bestAchievement=br.readFloat();
	
	this.list.set(baseData.id, baseData);

}
}
public static  clone(old:BattleListBase):BattleListBase{
var clone :BattleListBase = new BattleListBase();
	clone.id=old.id;
	
	clone.checkpoint=old.checkpoint;
	
	clone.checkpointID=old.checkpointID;
	
	clone.total=old.total;
	
	clone.wins=old.wins;
	
	clone.userID=old.userID;
	
	clone.bestAchievement=old.bestAchievement;
	
return clone;
}

public   clone(old:BattleListBase){
	this.id=old.id;
	
	this.checkpoint=old.checkpoint;
	
	this.checkpointID=old.checkpointID;
	
	this.total=old.total;
	
	this.wins=old.wins;
	
	this.userID=old.userID;
	
	this.bestAchievement=old.bestAchievement;
	
}
	private static params = ["id","checkpoint","checkpointID","total","wins","userID","bestAchievement",];
	public static add(a: BattleListBase, b: BattleListBase, start: number = 0, end: number, limit: BattleListBase) {
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

	public static sub(a: BattleListBase, b: BattleListBase, start: number = 0, end: number) {
		if(!a || !b) return null;
		let result = this.clone(a);
		for(let i = Math.max(start, 0), e = Math.min(end, this.params.length); i < e; i++) {
			const par = this.params[i];
			result[par] -= b[par];
		}
		return result;
	}

	public static random(src: BattleListBase, i: number = 0) {
		if(src[this.params[i]] == 0) // NOTE:
			src[this.params[i]] = Math.random();
		return JSON.stringify(src);
	}

	public static large(a: BattleListBase, b: BattleListBase, i: number = 0) {
		return a[this.params[i]] > b[this.params[i]];
	}

	public static max(a: BattleListBase, b: BattleListBase, i: number = 0) {
		if(a[this.params[i]] > b[this.params[i]])
			return a;
		return b;
	}

	public static json(a: BattleListBase, data) {
		data = JSON.parse(data);
		for(let k in data) {
			a[k] = data[k];
		};
		return a;
	}

	public static setProperty(a: BattleListBase, p: number, value) {
		a[this.params[p]] = value;
		return a;
	}

}if(!gd3d.__ExcDate__)gd3d.__ExcDate__= { } ; if(!gd3d.__ExcDate__.__list) gd3d.__ExcDate__.__list = []; gd3d.__ExcDate__.__list.push(BattleListBase);