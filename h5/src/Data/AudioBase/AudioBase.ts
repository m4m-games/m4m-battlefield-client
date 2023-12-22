//请在项目中，将 SyncObject、cMap 注入到 gd3d.__ExcDate__ 对象上。
 import { ExcelDataBase } from "Data/ExcelDataBase";
import { cMap } from "Data/Map";
declare let gd3d;
export class AudioBase extends ExcelDataBase{
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
	public static getlist:(offset?:number, count?:number) => Promise<AudioBase>;

	/**音频ID*/
	public id:number;
	/**资源名*/
	public resName:string;
	/**音频key*/
	public audioKey:string;
	/**音量（0-1）*/
	public volume:number;
	/**是否循环播放*/
	public isLoop:boolean;
	/**备注*/
	public desc:string;


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

var baseData:AudioBase = new AudioBase ();	
	baseData.id=br.readUInt32();
	
	baseData.resName=br.readUTFBytes();
	
	baseData.audioKey=br.readUTFBytes();
	
	baseData.volume=br.readFloat();
	
	baseData.isLoop=br.readBoolean();
	
	baseData.desc=br.readUTFBytes();
	
	this.list.set(baseData.id, baseData);

}
}
public static  clone(old:AudioBase):AudioBase{
var clone :AudioBase = new AudioBase();
	clone.id=old.id;
	
	clone.resName=old.resName;
	
	clone.audioKey=old.audioKey;
	
	clone.volume=old.volume;
	
	clone.isLoop=old.isLoop;
	
	clone.desc=old.desc;
	
return clone;
}
	private static params = ["id","resName","audioKey","volume","isLoop","desc",];
	public static add(a: AudioBase, b: AudioBase, start: number = 0, end: number, limit: AudioBase) {
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

	public static sub(a: AudioBase, b: AudioBase, start: number = 0, end: number) {
		if(!a || !b) return null;
		let result = this.clone(a);
		for(let i = Math.max(start, 0), e = Math.min(end, this.params.length); i < e; i++) {
			const par = this.params[i];
			result[par] -= b[par];
		}
		return result;
	}

	public static random(src: AudioBase, i: number = 0) {
		if(src[this.params[i]] == 0) // NOTE:
			src[this.params[i]] = Math.random();
		return JSON.stringify(src);
	}

	public static large(a: AudioBase, b: AudioBase, i: number = 0) {
		return a[this.params[i]] > b[this.params[i]];
	}

	public static max(a: AudioBase, b: AudioBase, i: number = 0) {
		if(a[this.params[i]] > b[this.params[i]])
			return a;
		return b;
	}

	public static json(a: AudioBase, data) {
		data = JSON.parse(data);
		for(let k in data) {
			a[k] = data[k];
		};
		return a;
	}

	public static setProperty(a: AudioBase, p: number, value) {
		a[this.params[p]] = value;
		return a;
	}

}if(!gd3d.__ExcDate__)gd3d.__ExcDate__= { } ; if(!gd3d.__ExcDate__.__list) gd3d.__ExcDate__.__list = []; gd3d.__ExcDate__.__list.push(AudioBase);