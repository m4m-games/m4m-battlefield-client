//请在项目中，将 SyncObject、cMap 注入到 gd3d.__ExcDate__ 对象上。
 import { ExcelDataBase } from "Data/ExcelDataBase";
import { cMap } from "Data/Map";
declare let gd3d;
export class WoodConfigBase extends ExcelDataBase{
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
	public static getlist:(offset?:number, count?:number) => Promise<WoodConfigBase>;

	/**配置ID*/
	public id:string;
	/**备注*/
	public desc:string;
	/**用户列表*/
	public players:string;
	/**每一步距离*/
	public stepDis:number;
	/**下落高度*/
	public dropHeigth:number;
	/**初始位置*/
	public startArea:string;
	/**结束位置*/
	public finishArea:string;
	/**活动区域*/
	public moveArea:string;
	/**NPC位置*/
	public npcPos:string;
	/**NPC旋转*/
	public npcRot:number;
	/**长度*/
	public soundLen:number[];
	/**长度*/
	public headTime:number;
	/**最小间隔*/
	public minInterval:number;
	/**间隔浮动范围*/
	public intervalPlus:number;
	/**提前发送时间*/
	public advance:number;
	/**游戏总时间*/
	public totleTime:number;
	/**倒计时时长*/
	public countTime:number;
	/**游戏开始时间*/
	public gameTime:number;
	/**游戏状态*/
	public gameStatus:number;
	/**倒计时开始时间*/
	public countDown:number;
	/**当前时间*/
	public nowTime:number;
	/**结束时间*/
	public endTime:number;
	/**游戏场景ID*/
	public gameScene:number;


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

var baseData:WoodConfigBase = new WoodConfigBase ();	
	baseData.id=br.readUTFBytes();
	
	baseData.desc=br.readUTFBytes();
	
	baseData.players=br.readUTFBytes();
	
	baseData.stepDis=br.readFloat();
	
	baseData.dropHeigth=br.readFloat();
	
	baseData.startArea=br.readUTFBytes();
	
	baseData.finishArea=br.readUTFBytes();
	
	baseData.moveArea=br.readUTFBytes();
	
	baseData.npcPos=br.readUTFBytes();
	
	baseData.npcRot=br.readInt32();
	
	baseData.soundLen = (() => { let cache:any[] = []; let len = br.readUInt32(); for(let i=0;i<len;i++) {cache.push(br.readInt32());}return cache;})();
	
	baseData.headTime=br.readInt32();
	
	baseData.minInterval=br.readInt32();
	
	baseData.intervalPlus=br.readInt32();
	
	baseData.advance=br.readInt32();
	
	baseData.totleTime=br.readInt32();
	
	baseData.countTime=br.readInt32();
	
	baseData.gameTime=br.readULong();
	
	baseData.gameStatus=br.readByte();
	
	baseData.countDown=br.readULong();
	
	baseData.nowTime=br.readDouble();
	
	baseData.endTime=br.readDouble();
	
	baseData.gameScene=br.readUInt32();
	
	this.list.set(baseData.id, baseData);

}
}
public static  clone(old:WoodConfigBase):WoodConfigBase{
var clone :WoodConfigBase = new WoodConfigBase();
	clone.id=old.id;
	
	clone.desc=old.desc;
	
	clone.players=old.players;
	
	clone.stepDis=old.stepDis;
	
	clone.dropHeigth=old.dropHeigth;
	
	clone.startArea=old.startArea;
	
	clone.finishArea=old.finishArea;
	
	clone.moveArea=old.moveArea;
	
	clone.npcPos=old.npcPos;
	
	clone.npcRot=old.npcRot;
	
	clone.soundLen=old.soundLen;
	
	clone.headTime=old.headTime;
	
	clone.minInterval=old.minInterval;
	
	clone.intervalPlus=old.intervalPlus;
	
	clone.advance=old.advance;
	
	clone.totleTime=old.totleTime;
	
	clone.countTime=old.countTime;
	
	clone.gameTime=old.gameTime;
	
	clone.gameStatus=old.gameStatus;
	
	clone.countDown=old.countDown;
	
	clone.nowTime=old.nowTime;
	
	clone.endTime=old.endTime;
	
	clone.gameScene=old.gameScene;
	
return clone;
}

public   clone(old:WoodConfigBase){
	this.id=old.id;
	
	this.desc=old.desc;
	
	this.players=old.players;
	
	this.stepDis=old.stepDis;
	
	this.dropHeigth=old.dropHeigth;
	
	this.startArea=old.startArea;
	
	this.finishArea=old.finishArea;
	
	this.moveArea=old.moveArea;
	
	this.npcPos=old.npcPos;
	
	this.npcRot=old.npcRot;
	
	this.soundLen=old.soundLen;
	
	this.headTime=old.headTime;
	
	this.minInterval=old.minInterval;
	
	this.intervalPlus=old.intervalPlus;
	
	this.advance=old.advance;
	
	this.totleTime=old.totleTime;
	
	this.countTime=old.countTime;
	
	this.gameTime=old.gameTime;
	
	this.gameStatus=old.gameStatus;
	
	this.countDown=old.countDown;
	
	this.nowTime=old.nowTime;
	
	this.endTime=old.endTime;
	
	this.gameScene=old.gameScene;
	
}
	private static params = ["id","desc","players","stepDis","dropHeigth","startArea","finishArea","moveArea","npcPos","npcRot","soundLen","headTime","minInterval","intervalPlus","advance","totleTime","countTime","gameTime","gameStatus","countDown","nowTime","endTime","gameScene",];
	public static add(a: WoodConfigBase, b: WoodConfigBase, start: number = 0, end: number, limit: WoodConfigBase) {
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

	public static sub(a: WoodConfigBase, b: WoodConfigBase, start: number = 0, end: number) {
		if(!a || !b) return null;
		let result = this.clone(a);
		for(let i = Math.max(start, 0), e = Math.min(end, this.params.length); i < e; i++) {
			const par = this.params[i];
			result[par] -= b[par];
		}
		return result;
	}

	public static random(src: WoodConfigBase, i: number = 0) {
		if(src[this.params[i]] == 0) // NOTE:
			src[this.params[i]] = Math.random();
		return JSON.stringify(src);
	}

	public static large(a: WoodConfigBase, b: WoodConfigBase, i: number = 0) {
		return a[this.params[i]] > b[this.params[i]];
	}

	public static max(a: WoodConfigBase, b: WoodConfigBase, i: number = 0) {
		if(a[this.params[i]] > b[this.params[i]])
			return a;
		return b;
	}

	public static json(a: WoodConfigBase, data) {
		data = JSON.parse(data);
		for(let k in data) {
			a[k] = data[k];
		};
		return a;
	}

	public static setProperty(a: WoodConfigBase, p: number, value) {
		a[this.params[p]] = value;
		return a;
	}

}if(!gd3d.__ExcDate__)gd3d.__ExcDate__= { } ; if(!gd3d.__ExcDate__.__list) gd3d.__ExcDate__.__list = []; gd3d.__ExcDate__.__list.push(WoodConfigBase);