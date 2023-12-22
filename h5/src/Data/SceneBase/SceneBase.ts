//请在项目中，将 SyncObject、cMap 注入到 gd3d.__ExcDate__ 对象上。
 import { ExcelDataBase } from "Data/ExcelDataBase";
import { cMap } from "Data/Map";
declare let gd3d;
export class SceneBase extends ExcelDataBase{
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
	public static getlist:(offset?:number, count?:number) => Promise<SceneBase>;

	/**ID*/
	public id:number;
	/**服务器名称*/
	public severName:string;
	/**名称*/
	public name:string;
	/**备注*/
	public desc:string;
	/**类型*/
	public type:number;
	/**相机位置*/
	public camPos:gd3d.math.vector3;
	/**相机旋转*/
	public camEuler:gd3d.math.vector3;
	/**相机FOV*/
	public camFOV:number;
	/**相机远面*/
	public camFar:number;
	/**相机近面*/
	public camNear:number;
	/**相机斜角*/
	public tiltAngle:number;
	/**相机环绕角*/
	public panAngle:number;
	/**主角在场景默认角度*/
	public roleAngle:number;
	/**是否开雾*/
	public enableFog:boolean;
	/**雾颜色*/
	public fogColor:gd3d.math.vector3;
	/**雾开始距离*/
	public fogStart:number;
	/**雾结束距离*/
	public fogEnd:number;
	/**障碍配置json资源*/
	public obstacleRes:string;
	/**场景缩放*/
	public sceneScale:gd3d.math.vector3;
	/**相机观察目标距离*/
	public camDistance:number;
	/**相机观察目标偏移量*/
	public camViewOffset:gd3d.math.vector3;
	/**相机避让的障碍物列表(josn 数组)*/
	public camAvoidObs:string;


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

var baseData:SceneBase = new SceneBase ();	
	baseData.id=br.readUInt32();
	
	baseData.severName=br.readUTFBytes();
	
	baseData.name=br.readUTFBytes();
	
	baseData.desc=br.readUTFBytes();
	
	baseData.type=br.readByte();
	
	baseData.camPos=br.readVector3();
	
	baseData.camEuler=br.readVector3();
	
	baseData.camFOV=br.readFloat();
	
	baseData.camFar=br.readFloat();
	
	baseData.camNear=br.readFloat();
	
	baseData.tiltAngle=br.readFloat();
	
	baseData.panAngle=br.readFloat();
	
	baseData.roleAngle=br.readFloat();
	
	baseData.enableFog=br.readBoolean();
	
	baseData.fogColor=br.readVector3();
	
	baseData.fogStart=br.readFloat();
	
	baseData.fogEnd=br.readFloat();
	
	baseData.obstacleRes=br.readUTFBytes();
	
	baseData.sceneScale=br.readVector3();
	
	baseData.camDistance=br.readFloat();
	
	baseData.camViewOffset=br.readVector3();
	
	baseData.camAvoidObs=br.readUTFBytes();
	
	this.list.set(baseData.id, baseData);

}
}
public static  clone(old:SceneBase):SceneBase{
var clone :SceneBase = new SceneBase();
	clone.id=old.id;
	
	clone.severName=old.severName;
	
	clone.name=old.name;
	
	clone.desc=old.desc;
	
	clone.type=old.type;
	
	clone.camPos=old.camPos;
	
	clone.camEuler=old.camEuler;
	
	clone.camFOV=old.camFOV;
	
	clone.camFar=old.camFar;
	
	clone.camNear=old.camNear;
	
	clone.tiltAngle=old.tiltAngle;
	
	clone.panAngle=old.panAngle;
	
	clone.roleAngle=old.roleAngle;
	
	clone.enableFog=old.enableFog;
	
	clone.fogColor=old.fogColor;
	
	clone.fogStart=old.fogStart;
	
	clone.fogEnd=old.fogEnd;
	
	clone.obstacleRes=old.obstacleRes;
	
	clone.sceneScale=old.sceneScale;
	
	clone.camDistance=old.camDistance;
	
	clone.camViewOffset=old.camViewOffset;
	
	clone.camAvoidObs=old.camAvoidObs;
	
return clone;
}
	private static params = ["id","severName","name","desc","type","camPos","camEuler","camFOV","camFar","camNear","tiltAngle","panAngle","roleAngle","enableFog","fogColor","fogStart","fogEnd","obstacleRes","sceneScale","camDistance","camViewOffset","camAvoidObs",];
	public static add(a: SceneBase, b: SceneBase, start: number = 0, end: number, limit: SceneBase) {
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

	public static sub(a: SceneBase, b: SceneBase, start: number = 0, end: number) {
		if(!a || !b) return null;
		let result = this.clone(a);
		for(let i = Math.max(start, 0), e = Math.min(end, this.params.length); i < e; i++) {
			const par = this.params[i];
			result[par] -= b[par];
		}
		return result;
	}

	public static random(src: SceneBase, i: number = 0) {
		if(src[this.params[i]] == 0) // NOTE:
			src[this.params[i]] = Math.random();
		return JSON.stringify(src);
	}

	public static large(a: SceneBase, b: SceneBase, i: number = 0) {
		return a[this.params[i]] > b[this.params[i]];
	}

	public static max(a: SceneBase, b: SceneBase, i: number = 0) {
		if(a[this.params[i]] > b[this.params[i]])
			return a;
		return b;
	}

	public static json(a: SceneBase, data) {
		data = JSON.parse(data);
		for(let k in data) {
			a[k] = data[k];
		};
		return a;
	}

	public static setProperty(a: SceneBase, p: number, value) {
		a[this.params[p]] = value;
		return a;
	}

}if(!gd3d.__ExcDate__)gd3d.__ExcDate__= { } ; if(!gd3d.__ExcDate__.__list) gd3d.__ExcDate__.__list = []; gd3d.__ExcDate__.__list.push(SceneBase);