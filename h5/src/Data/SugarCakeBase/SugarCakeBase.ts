//请在项目中，将 SyncObject、cMap 注入到 gd3d.__ExcDate__ 对象上。
 import { ExcelDataBase } from "Data/ExcelDataBase";
import { cMap } from "Data/Map";
declare let gd3d;
export class SugarCakeBase extends ExcelDataBase{
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
	public static getlist:(offset?:number, count?:number) => Promise<SugarCakeBase>;

	/**id*/
	public id:number;
	/**配置对应平台*/
	public platformType:string;
	/**扣糖饼形状配置*/
	public shapePolygon:string;
	/**针角度(角度制)*/
	public needleAngle:number;
	/**针缩放*/
	public needleScale:number;
	/**开始抖动的起始时间*/
	public shakeStartTime:number;
	/**抖动过渡时间(从开始到最大值的时间)*/
	public shakeTime:number;
	/**最低抖动值*/
	public shakeMinValue:number;
	/**抖动的最大值*/
	public shakeMaxValue:number;
	/**最小抖动频率*/
	public shakeMinFrequency:number;
	/**最大抖动频率*/
	public shakeMaxFrequency:number;
	/**针头宽度(就是划线的最小长度)*/
	public needleWidth:number;
	/**线段颜色*/
	public lineColor:number;
	/**线条绘制宽度*/
	public lineDrawWidth:number;
	/**线条碰撞宽度*/
	public lineCollisionWidth:number;
	/**是否绘制线*/
	public enableDrawLine:boolean;
	/**是否绘制顶点*/
	public enableDrawPoint:boolean;
	/**是否绘制零碎线段的端点*/
	public enableDrawBrokenlyPoint:boolean;
	/**需要画多少线才算成功 (0 - 1)*/
	public winSchedule:number;
	/**允许断连线段的最大宽度 (像素)*/
	public maxBrokenlyWidth:number;
	/**糖饼血量(每次减1*/
	public maxHp:number;


static get list(){ if(!this._list ){this._list = new cMap()}; return this._list;};	
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

var baseData:SugarCakeBase = new SugarCakeBase ();	
	baseData.id=br.readUInt32();
	
	baseData.platformType=br.readUTFBytes();
	
	baseData.shapePolygon=br.readUTFBytes();
	
	baseData.needleAngle=br.readFloat();
	
	baseData.needleScale=br.readFloat();
	
	baseData.shakeStartTime=br.readFloat();
	
	baseData.shakeTime=br.readFloat();
	
	baseData.shakeMinValue=br.readFloat();
	
	baseData.shakeMaxValue=br.readFloat();
	
	baseData.shakeMinFrequency=br.readFloat();
	
	baseData.shakeMaxFrequency=br.readFloat();
	
	baseData.needleWidth=br.readInt32();
	
	baseData.lineColor=br.readInt32();
	
	baseData.lineDrawWidth=br.readInt32();
	
	baseData.lineCollisionWidth=br.readInt32();
	
	baseData.enableDrawLine=br.readBoolean();
	
	baseData.enableDrawPoint=br.readBoolean();
	
	baseData.enableDrawBrokenlyPoint=br.readBoolean();
	
	baseData.winSchedule=br.readFloat();
	
	baseData.maxBrokenlyWidth=br.readFloat();
	
	baseData.maxHp=br.readInt32();
	
	this.list.set(baseData.id, baseData);

}
}
public static  clone(old:SugarCakeBase):SugarCakeBase{
var clone :SugarCakeBase = new SugarCakeBase();
	clone.id=old.id;
	
	clone.platformType=old.platformType;
	
	clone.shapePolygon=old.shapePolygon;
	
	clone.needleAngle=old.needleAngle;
	
	clone.needleScale=old.needleScale;
	
	clone.shakeStartTime=old.shakeStartTime;
	
	clone.shakeTime=old.shakeTime;
	
	clone.shakeMinValue=old.shakeMinValue;
	
	clone.shakeMaxValue=old.shakeMaxValue;
	
	clone.shakeMinFrequency=old.shakeMinFrequency;
	
	clone.shakeMaxFrequency=old.shakeMaxFrequency;
	
	clone.needleWidth=old.needleWidth;
	
	clone.lineColor=old.lineColor;
	
	clone.lineDrawWidth=old.lineDrawWidth;
	
	clone.lineCollisionWidth=old.lineCollisionWidth;
	
	clone.enableDrawLine=old.enableDrawLine;
	
	clone.enableDrawPoint=old.enableDrawPoint;
	
	clone.enableDrawBrokenlyPoint=old.enableDrawBrokenlyPoint;
	
	clone.winSchedule=old.winSchedule;
	
	clone.maxBrokenlyWidth=old.maxBrokenlyWidth;
	
	clone.maxHp=old.maxHp;
	
return clone;
}
	private static params = ["id","platformType","shapePolygon","needleAngle","needleScale","shakeStartTime","shakeTime","shakeMinValue","shakeMaxValue","shakeMinFrequency","shakeMaxFrequency","needleWidth","lineColor","lineDrawWidth","lineCollisionWidth","enableDrawLine","enableDrawPoint","enableDrawBrokenlyPoint","winSchedule","maxBrokenlyWidth","maxHp",];
	public static add(a: SugarCakeBase, b: SugarCakeBase, start: number = 0, end: number, limit: SugarCakeBase) {
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

	public static sub(a: SugarCakeBase, b: SugarCakeBase, start: number = 0, end: number) {
		if(!a || !b) return null;
		let result = this.clone(a);
		for(let i = Math.max(start, 0), e = Math.min(end, this.params.length); i < e; i++) {
			const par = this.params[i];
			result[par] -= b[par];
		}
		return result;
	}

	public static random(src: SugarCakeBase, i: number = 0) {
		if(src[this.params[i]] == 0) // NOTE:
			src[this.params[i]] = Math.random();
		return JSON.stringify(src);
	}

	public static large(a: SugarCakeBase, b: SugarCakeBase, i: number = 0) {
		return a[this.params[i]] > b[this.params[i]];
	}

	public static max(a: SugarCakeBase, b: SugarCakeBase, i: number = 0) {
		if(a[this.params[i]] > b[this.params[i]])
			return a;
		return b;
	}

	public static json(a: SugarCakeBase, data) {
		data = JSON.parse(data);
		for(let k in data) {
			a[k] = data[k];
		};
		return a;
	}

	public static setProperty(a: SugarCakeBase, p: number, value) {
		a[this.params[p]] = value;
		return a;
	}

}if(!gd3d.__ExcDate__)gd3d.__ExcDate__= { } ; if(!gd3d.__ExcDate__.__list) gd3d.__ExcDate__.__list = []; gd3d.__ExcDate__.__list.push(SugarCakeBase);