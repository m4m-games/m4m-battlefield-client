//请在项目中，将 SyncObject、cMap 注入到 gd3d.__ExcDate__ 对象上。
 import { ExcelDataBase } from "Data/ExcelDataBase";
import { cMap } from "Data/Map";
declare let gd3d;
export class MailData extends ExcelDataBase{
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
	public static getlist:(offset?:number, count?:number) => Promise<MailData>;

	/**邮件ID*/
	public id:string;
	/**邮件类型*/
	public mailType:number;
	/**邮件来源*/
	public mailFrom:string;
	/**邮件接收者*/
	public mailTo:string;
	/**邮件标题*/
	public mailTitle:string;
	/**邮件内容*/
	public mailContent:string;
	/**附带道具*/
	public items:string;
	/**发送时间*/
	public sendTime:number;
	/**过期时间*/
	public expires:number;
	/**是否领取*/
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

var baseData:MailData = new MailData ();	
	baseData.id=br.readUTFBytes();
	
	baseData.mailType=br.readUInt32();
	
	baseData.mailFrom=br.readUTFBytes();
	
	baseData.mailTo=br.readUTFBytes();
	
	baseData.mailTitle=br.readUTFBytes();
	
	baseData.mailContent=br.readUTFBytes();
	
	baseData.items=br.readUTFBytes();
	
	baseData.sendTime=br.readDouble();
	
	baseData.expires=br.readULong();
	
	baseData.visible=br.readBoolean();
	
	this.list.set(baseData.id, baseData);

}
}
public static  clone(old:MailData):MailData{
var clone :MailData = new MailData();
	clone.id=old.id;
	
	clone.mailType=old.mailType;
	
	clone.mailFrom=old.mailFrom;
	
	clone.mailTo=old.mailTo;
	
	clone.mailTitle=old.mailTitle;
	
	clone.mailContent=old.mailContent;
	
	clone.items=old.items;
	
	clone.sendTime=old.sendTime;
	
	clone.expires=old.expires;
	
	clone.visible=old.visible;
	
return clone;
}

public   clone(old:MailData){
	this.id=old.id;
	
	this.mailType=old.mailType;
	
	this.mailFrom=old.mailFrom;
	
	this.mailTo=old.mailTo;
	
	this.mailTitle=old.mailTitle;
	
	this.mailContent=old.mailContent;
	
	this.items=old.items;
	
	this.sendTime=old.sendTime;
	
	this.expires=old.expires;
	
	this.visible=old.visible;
	
}
	private static params = ["id","mailType","mailFrom","mailTo","mailTitle","mailContent","items","sendTime","expires","visible",];
	public static add(a: MailData, b: MailData, start: number = 0, end: number, limit: MailData) {
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

	public static sub(a: MailData, b: MailData, start: number = 0, end: number) {
		if(!a || !b) return null;
		let result = this.clone(a);
		for(let i = Math.max(start, 0), e = Math.min(end, this.params.length); i < e; i++) {
			const par = this.params[i];
			result[par] -= b[par];
		}
		return result;
	}

	public static random(src: MailData, i: number = 0) {
		if(src[this.params[i]] == 0) // NOTE:
			src[this.params[i]] = Math.random();
		return JSON.stringify(src);
	}

	public static large(a: MailData, b: MailData, i: number = 0) {
		return a[this.params[i]] > b[this.params[i]];
	}

	public static max(a: MailData, b: MailData, i: number = 0) {
		if(a[this.params[i]] > b[this.params[i]])
			return a;
		return b;
	}

	public static json(a: MailData, data) {
		data = JSON.parse(data);
		for(let k in data) {
			a[k] = data[k];
		};
		return a;
	}

	public static setProperty(a: MailData, p: number, value) {
		a[this.params[p]] = value;
		return a;
	}

}if(!gd3d.__ExcDate__)gd3d.__ExcDate__= { } ; if(!gd3d.__ExcDate__.__list) gd3d.__ExcDate__.__list = []; gd3d.__ExcDate__.__list.push(MailData);