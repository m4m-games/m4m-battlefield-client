//请在项目中，将 SyncObject、cMap 注入到 gd3d.__ExcDate__ 对象上。
 import { ExcelDataBase } from "Data/ExcelDataBase";
import { cMap } from "Data/Map";
declare let gd3d;
export class UserVarBase extends ExcelDataBase{
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
	public static getlist:(offset?:number, count?:number) => Promise<UserVarBase>;

	/**用户uuid*/
	public id:string;
	/**用户名*/
	public playerName:string;
	/**token*/
	public token:string;
	/**密码*/
	public passWord:string;
	/**账号状态*/
	public status:number;
	/**游戏中账号状态*/
	public inGameStatus:number;
	/**人物属性*/
	public roleStatus:string;
	/**持有货币*/
	public currency:string;
	/**装备道具*/
	public equip:string;
	/**持有道具*/
	public items:string;
	/**邮箱道具*/
	public mailItem:string;
	/**是否屏蔽*/
	public isBlock:boolean;
	/**是否记录*/
	public isLogUser:boolean;
	/**登录时间*/
	public loginTime:number;
	/**游戏经历是否打开*/
	public experience:boolean;
	/**游戏经历*/
	public Battlelist:string;
	/**玩家头像*/
	public playerIcon:string;
	/**持有头像*/
	public headPortrait:string;


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

var baseData:UserVarBase = new UserVarBase ();	
	baseData.id=br.readUTFBytes();
	
	baseData.playerName=br.readUTFBytes();
	
	baseData.token=br.readUTFBytes();
	
	baseData.passWord=br.readUTFBytes();
	
	baseData.status=br.readByte();
	
	baseData.inGameStatus=br.readByte();
	
	baseData.roleStatus=br.readUTFBytes();
	
	baseData.currency=br.readUTFBytes();
	
	baseData.equip=br.readUTFBytes();
	
	baseData.items=br.readUTFBytes();
	
	baseData.mailItem=br.readUTFBytes();
	
	baseData.isBlock=br.readBoolean();
	
	baseData.isLogUser=br.readBoolean();
	
	baseData.loginTime=br.readULong();
	
	baseData.experience=br.readBoolean();
	
	baseData.Battlelist=br.readUTFBytes();
	
	baseData.playerIcon=br.readUTFBytes();
	
	baseData.headPortrait=br.readUTFBytes();
	
	this.list.set(baseData.id, baseData);

}
}
public static  clone(old:UserVarBase):UserVarBase{
var clone :UserVarBase = new UserVarBase();
	clone.id=old.id;
	
	clone.playerName=old.playerName;
	
	clone.token=old.token;
	
	clone.passWord=old.passWord;
	
	clone.status=old.status;
	
	clone.inGameStatus=old.inGameStatus;
	
	clone.roleStatus=old.roleStatus;
	
	clone.currency=old.currency;
	
	clone.equip=old.equip;
	
	clone.items=old.items;
	
	clone.mailItem=old.mailItem;
	
	clone.isBlock=old.isBlock;
	
	clone.isLogUser=old.isLogUser;
	
	clone.loginTime=old.loginTime;
	
	clone.experience=old.experience;
	
	clone.Battlelist=old.Battlelist;
	
	clone.playerIcon=old.playerIcon;
	
	clone.headPortrait=old.headPortrait;
	
return clone;
}

public   clone(old:UserVarBase){
	this.id=old.id;
	
	this.playerName=old.playerName;
	
	this.token=old.token;
	
	this.passWord=old.passWord;
	
	this.status=old.status;
	
	this.inGameStatus=old.inGameStatus;
	
	this.roleStatus=old.roleStatus;
	
	this.currency=old.currency;
	
	this.equip=old.equip;
	
	this.items=old.items;
	
	this.mailItem=old.mailItem;
	
	this.isBlock=old.isBlock;
	
	this.isLogUser=old.isLogUser;
	
	this.loginTime=old.loginTime;
	
	this.experience=old.experience;
	
	this.Battlelist=old.Battlelist;
	
	this.playerIcon=old.playerIcon;
	
	this.headPortrait=old.headPortrait;
	
}
	private static params = ["id","playerName","token","passWord","status","inGameStatus","roleStatus","currency","equip","items","mailItem","isBlock","isLogUser","loginTime","experience","Battlelist","playerIcon","headPortrait",];
	public static add(a: UserVarBase, b: UserVarBase, start: number = 0, end: number, limit: UserVarBase) {
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

	public static sub(a: UserVarBase, b: UserVarBase, start: number = 0, end: number) {
		if(!a || !b) return null;
		let result = this.clone(a);
		for(let i = Math.max(start, 0), e = Math.min(end, this.params.length); i < e; i++) {
			const par = this.params[i];
			result[par] -= b[par];
		}
		return result;
	}

	public static random(src: UserVarBase, i: number = 0) {
		if(src[this.params[i]] == 0) // NOTE:
			src[this.params[i]] = Math.random();
		return JSON.stringify(src);
	}

	public static large(a: UserVarBase, b: UserVarBase, i: number = 0) {
		return a[this.params[i]] > b[this.params[i]];
	}

	public static max(a: UserVarBase, b: UserVarBase, i: number = 0) {
		if(a[this.params[i]] > b[this.params[i]])
			return a;
		return b;
	}

	public static json(a: UserVarBase, data) {
		data = JSON.parse(data);
		for(let k in data) {
			a[k] = data[k];
		};
		return a;
	}

	public static setProperty(a: UserVarBase, p: number, value) {
		a[this.params[p]] = value;
		return a;
	}

}if(!gd3d.__ExcDate__)gd3d.__ExcDate__= { } ; if(!gd3d.__ExcDate__.__list) gd3d.__ExcDate__.__list = []; gd3d.__ExcDate__.__list.push(UserVarBase);