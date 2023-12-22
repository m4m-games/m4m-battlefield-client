// import { NetWebscoket } from "./NetWebsocket";

// export class MessageSendConversion {

//     //登录
//     public static login(userName: string, password: string) {
//         let mess = `{"currentType":null,"type":null,"callTime":"0001-01-01T00:00:00","callid":0,"timeout":0,"className":"LoginManager","functionName":"login","argsType":null,
//         "args":["${userName}","${password}"],"returnType":null,"returnValue":null}`;
//         NetWebscoket.Instance.sendStr(mess);
//     }

//     /**
//      * 进入房间
//      * @param userName 玩家ID 暂用
//      * @param roomType 房间类型
//      */
//     public static addToRoom(roomType: number = 1) {
//         // tslint:disable-next-line: max-line-length
//         let mess = `{"currentType":null,"type":null,"callTime":"0001-01-01T00:00:00","callid":0,"timeout":0,"className":"RoomManager","functionName":"addToRoom","argsType":null,
//         "args":["${roomType}"],"returnType":null,"returnValue":null}`;
//         NetWebscoket.Instance.sendStr(mess);
//     }

//     /***
//      * 进游戏场景资源加载完成
//      * readyForGame
//      */
//     public static loadReadyForGame() {
//         let mess = `{"currentType":null,"type":null,"callTime":"0001-01-01T00:00:00","callid":0,"timeout":0,"className":"RoomManager","functionName":"readyForGame","argsType":null,
//         "args":["test22212021/10/12 20:38:55","test222"],"returnType":null,"returnValue":null}`;
//         NetWebscoket.Instance.sendStr(mess);
//     }

//     /***
//      * 发送更新玩家信息
//      * updataGame
//      */
//     public static updataGame(pos: gd3d.math.vector3, yAngle: number) {
//         // let mess = `{"currentType":null,"type":null,"callTime":"0001-01-01T00:00:00","callid":0,"timeout":0,"className":"GameManager","functionName":"updataGame","argsType":null,
//         // "args":["房间IDfdggfdgfdgdfdg",{"pos":{"x":${pos.x},"y":${pos.y},"z":${pos.z}}}],"returnType":null,"returnValue":null}`;
//         let posA = {};
//         posA["pos"] = pos;
//         posA["angle"] = yAngle;
//         let jsonText = JSON.stringify(posA);
//         let mess = `{"currentType":null,"type":null,"callTime":"0001-01-01T00:00:00","callid":0,"timeout":0,"className":"GameManager","functionName":"updataGame","argsType":null,
//         "args":[${jsonText}],"returnType":null,"returnValue":null}`;
//         NetWebscoket.Instance.sendStr(mess);
//     }

// }