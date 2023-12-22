import { AnimLoadPlayer } from "animation/animLoadPlayer";
import { EventMgr } from "eventMgr";
import { EventMapByAutoGen } from "eventType/eventMapByAutoGen";
import { testCreat } from "Loader/otherPlan/testCreat";
import { UiManager } from "PSDUI/UiManager";
import { gdAnimPlayer } from "Tools/engineParallel/m4m/gdAnimPlayer";
import { engineParallelType, ISpAnimPlayer, ISpAnimPlayerHandle } from "Tools/engineParallel/spInterface";
import { wxAnimPlayer } from "Tools/engineParallel/wxEngine/wxAnimPlayer";
import { GameMgr } from "../GameMgr";

/** 游戏相关 工具类 */
export class GameTool {
    private static readonly hasUIShowMap: { [showEvent: string]: boolean } = {};

    /**
     * 请求UI，并等待(事件 Show模式)
     * @param showEvent UI事件
     */
    public static async UIWaitEvent<T extends keyof EventMapByAutoGen>(showEvent: T) {
        EventMgr.dispatchEvent(showEvent as any, null);
        //非 Show 或者 已经show过的，直接完成返回。
        if (showEvent.lastIndexOf("_Show") == -1 || GameTool.hasUIShowMap[showEvent]) { return; }
        //还没 show 过需要监听第一次初始化加载UI
        await this.waitListenUIEvent(showEvent);
        this.hasUIShowMap[showEvent] = true;
    }

    /**
     * 请求 UI,并等待(inited) 显示（type2 类型UI）
     * @param uiClassName UI类的名字
     */
    public static UIWaitShowType2(uiClassName: string): Promise<any> {
        let cb: any;
        let _p = new Promise((resolve) => {
            if (UiManager.isUiInited(uiClassName)) {
                resolve(null);
            } else {
                cb = resolve;
            }
        });
        //show UI
        UiManager.showUi(uiClassName, cb);
        //等待 UI init 完成
        return _p;
    }

    /**
     * 等待 UI 进入显示状态，不主动请求UI
     * @param uiClassName UI类的名字
     * @param needInited 是否必须 等待 初始化完成
     */
    public static UIWaitIsShow(uiClassName: string): Promise<any> {
        let cb: any;
        let _p = new Promise((resolve) => {
            //检查 UI 是否已经满足条件
            if (UiManager.isUiShow(uiClassName)) {
                resolve(null);
            } else {
                cb = resolve;
            }
        });

        if (cb) {
            //show 的事件等待
            let objS = {
                onShow: (_uiClassName) => {
                    if (_uiClassName == uiClassName) {
                        UiManager.eventer.RemoveListener(UiManager.ON_SHOW_UI, objS.onShow, objS);
                        cb();
                    }
                },
            };
            UiManager.eventer.On(UiManager.ON_SHOW_UI, objS.onShow, objS);
        }
        return _p;
    }

    /**
     * 获取 AnimPlayerHandle ，通过ISpAnimPlayer
     * @param _aniplayer  ISpAnimPlayer组件对象
     * @param loadpath    加载的路径 例如：GameMgr.rolePath
     */
    public static async getAnimPlayerHandle(_aniplayer: ISpAnimPlayer, loadpath: string) {
        if (!_aniplayer) { return; }
        let _animPlayerHd: ISpAnimPlayerHandle;
        let etype = _aniplayer.gameObject.transform.engineType;
        if (etype == engineParallelType.none) {
            let orgAnimPlayer = (_aniplayer as gdAnimPlayer).rawHandle;
            let clipNames = orgAnimPlayer.allClipNames();
            let newPath = loadpath;
            if (GameMgr.useTestCreate) {
                newPath = testCreat.pathReplaceMap[loadpath];
                if (!newPath) {
                    newPath = loadpath;
                }
            }
            let animLP = new AnimLoadPlayer(_aniplayer.gameObject.name, clipNames, orgAnimPlayer, newPath);
            _animPlayerHd = animLP;
            let waitLoadEnd = () => {
                return new Promise((resolve) => {
                    if (animLP.isLoadedAll) {
                        resolve(null);
                    } else {
                        animLP.onLoadedClips = resolve;
                    }
                });
            };
            await waitLoadEnd();
        } else {
            _animPlayerHd = _aniplayer as wxAnimPlayer;
        }

        return _animPlayerHd;
    }

    /** 等待UI 监听事件成功 */
    private static waitListenUIEvent(showEvent: string) {
        return new Promise<any>((resolve, reject) => {
            EventMgr.addListener(showEvent as any, () => {
                resolve(null);
            }, this);
        });
    }

    private static test() {

    }
}