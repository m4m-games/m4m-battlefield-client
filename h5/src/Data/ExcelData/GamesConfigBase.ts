//请在项目中，将 SyncObject、cMap 注入到 gd3d.__ExcDate__ 对象上。
 import { ExcelDataBase } from "Data/ExcelDataBase";
import { cMap } from "Data/Map";
declare let gd3d;
export class GamesConfigBase extends ExcelDataBase{
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
	public static getlist:(offset?:number, count?:number) => Promise<GamesConfigBase>;

	/**配置ID*/
	public id:number;
	/**备注*/
	public desc:string;
	/**绑定UI面板ID*/
	public UI:string;
	/**链接游戏*/
	public gameUrl:string;
	/**大厅活动区域*/
	public moveArea:string;
	/**最大人数*/
	public maxPlayer:number;
	/**传递参数*/
	public gameData:number[];
	/**游戏类名*/
	public gameClass:string;
	/**场景id*/
	public sceneBase:number;


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

var baseData:GamesConfigBase = new GamesConfigBase ();	
	baseData.id=br.readUInt32();
	
	baseData.desc=br.readUTFBytes();
	
	baseData.UI=br.readUTFBytes();
	
	baseData.gameUrl=br.readUTFBytes();
	
	baseData.moveArea=br.readUTFBytes();
	
	baseData.maxPlayer=br.readInt32();
	
	baseData.gameData = (() => { let cache:any[] = []; let len = br.readUInt32(); for(let i=0;i<len;i++) {cache.push(br.readFloat());}return cache;})();
	
	baseData.gameClass=br.readUTFBytes();
	
	baseData.sceneBase=br.readUInt32();
	
	this.list.set(baseData.id, baseData);

}
}
public static  clone(old:GamesConfigBase):GamesConfigBase{
var clone :GamesConfigBase = new GamesConfigBase();
	clone.id=old.id;
	
	clone.desc=old.desc;
	
	clone.UI=old.UI;
	
	clone.gameUrl=old.gameUrl;
	
	clone.moveArea=old.moveArea;
	
	clone.maxPlayer=old.maxPlayer;
	
	clone.gameData=old.gameData;
	
	clone.gameClass=old.gameClass;
	
	clone.sceneBase=old.sceneBase;
	
return clone;
}

public   clone(old:GamesConfigBase){
	this.id=old.id;
	
	this.desc=old.desc;
	
	this.UI=old.UI;
	
	this.gameUrl=old.gameUrl;
	
	this.moveArea=old.moveArea;
	
	this.maxPlayer=old.maxPlayer;
	
	this.gameData=old.gameData;
	
	this.gameClass=old.gameClass;
	
	this.sceneBase=old.sceneBase;
	
}
	private static params = ["id","desc","UI","gameUrl","moveArea","maxPlayer","gameData","gameClass","sceneBase",];
	public static add(a: GamesConfigBase, b: GamesConfigBase, start: number = 0, end: number, limit: GamesConfigBase) {
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

	public static sub(a: GamesConfigBase, b: GamesConfigBase, start: number = 0, end: number) {
		if(!a || !b) return null;
		let result = this.clone(a);
		for(let i = Math.max(start, 0), e = Math.min(end, this.params.length); i < e; i++) {
			const par = this.params[i];
			result[par] -= b[par];
		}
		return result;
	}

	public static random(src: GamesConfigBase, i: number = 0) {
		if(src[this.params[i]] == 0) // NOTE:
			src[this.params[i]] = Math.random();
		return JSON.stringify(src);
	}

	public static large(a: GamesConfigBase, b: GamesConfigBase, i: number = 0) {
		return a[this.params[i]] > b[this.params[i]];
	}

	public static max(a: GamesConfigBase, b: GamesConfigBase, i: number = 0) {
		if(a[this.params[i]] > b[this.params[i]])
			return a;
		return b;
	}

	public static json(a: GamesConfigBase, data) {
		data = JSON.parse(data);
		for(let k in data) {
			a[k] = data[k];
		};
		return a;
	}

	public static setProperty(a: GamesConfigBase, p: number, value) {
		a[this.params[p]] = value;
		return a;
	}

}if(!gd3d.__ExcDate__)gd3d.__ExcDate__= { } ; if(!gd3d.__ExcDate__.__list) gd3d.__ExcDate__.__list = []; gd3d.__ExcDate__.__list.push(GamesConfigBase);