import { CAudioChannel } from "./CAudioPlayer";

export class CAudioEx {
    public static instance(): CAudioEx {
        if (CAudioEx.g_this == null) {
            CAudioEx.g_this = new CAudioEx();
        }

        return CAudioEx.g_this;
    }

    private static loadArrayBuffer(url: string, fun: (_bin: ArrayBuffer, _err: Error) => void, failCount: number = 0): void {
        try {
            let req = new XMLHttpRequest();//ness
            req.open("GET", url);
            req.responseType = "arraybuffer";//ie 一定要在open之后修改responseType
            req.onreadystatechange = () => {
                if (req.readyState == 4) {
                    switch (req.status) {
                        case 200:
                        case 304:
                        case 404:
                            break;
                        default:
                            {
                                if (failCount < 20) {
                                    setTimeout(() => {
                                        // tslint:disable-next-line: no-parameter-reassignment
                                        CAudioEx.loadArrayBuffer(url, fun, ++failCount);
                                    }, 500);
                                } else {
                                    console.error(`${url} 多次尝试下载失败 ,请检查资源是否损坏.`);
                                }
                            }
                            return;
                    }
                    if (req.status == 404) {
                        fun(null, new Error("onerr 404"));
                    } else {
                        fun(req.response, null);
                    }
                }
            };
            req.onerror = () => {
                fun(null, new Error("onerr in req:"));//ness
            };
            req.send();
        } catch (er) {
            console.error(url + "     Error   " + er);
        }
    }

    public audioContext: AudioContext;
    // tslint:disable-next-line: variable-name
    private static g_this: CAudioEx;
    private constructor() {
        try {
            let _AudioContext = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"] || window["msAudioContext"];
            this.audioContext = new _AudioContext();
            console.log("audio Context inited");
        } catch (e) {
            // throw new Error("!Your browser does not support AudioContext");
            console.error("!Your browser does not support AudioContext");
        }
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 初始化声音api，注意：在ios上面必须手动点击某个按钮来调用初始化，否则无法播放声音
     * @version egret-gd3d 1.0
     */
    public clickInit() {
        if (!this.isAvailable()) {
            return;
        }
        // create empty buffer
        if (this.audioContext != null) {
            let buffer = this.audioContext.createBuffer(1, 1, 22050);
            let source = this.audioContext.createBufferSource();
            source.buffer = buffer;

            // connect to output (your speakers)
            source.connect(this.audioContext.destination);

            // play the file
            source.start();
        }
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 初始化声音api，注意：在ios上面必须手动点击某个按钮来调用初始化，否则无法播放声音
     * @version egret-gd3d 1.0
     */
    public isAvailable(): boolean {
        return this.audioContext ? true : false;
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 从arraybuffer转成audiobuffer
     * @version egret-gd3d 1.0
     * @param ab  二进制声音数据
     * @param fun 
     */
    public loadAudioBufferFromArrayBuffer(ab: ArrayBuffer, fun: (buf: AudioBuffer, _err: Error) => void): void {
        this.audioContext.decodeAudioData(ab, (audiobuffer) => {
            fun(audiobuffer, null);
        });
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 从本地文件加载音频数据，返回audiobuffer
     * @version egret-gd3d 1.0
     * @param url  文件地址
     * @param fun 
     */
    public loadAudioBuffer(url: string, fun: (buf: AudioBuffer, _err: Error) => void): void {
        // tslint:disable-next-line: variable-name
        CAudioEx.loadArrayBuffer(url, (_ab, __err) => {
            if (__err != null) {
                fun(null, __err);
            } else {
                try {
                    let inst = CAudioEx.instance();
                    if (!inst.audioContext) {
                        return console.log(`加载音频失败 :${url}  音频上下文初始化失败!`);
                    }
                    inst.audioContext.decodeAudioData(_ab, (audiobuffer) => {
                        fun(audiobuffer, null);
                    });
                    //this.audioContext.decodeAudioData(_ab, (audiobuffer) => {
                    //    fun(audiobuffer, null);
                    //});
                } catch (er) {
                    console.error(url + "     Error   " + er);
                }
            }
        });
    }

    public createAudioChannel(): CAudioChannel {
        let cc = new CAudioChannel();
        if (!this.audioContext) { return cc; }
        cc.source = this.audioContext.createBufferSource();

        cc.gainNode = this.audioContext.createGain();
        cc.source.connect(cc.gainNode);
        cc.gainNode.connect(this.audioContext.destination);

        //声音调节
        cc.gainNode.gain.value = 1;
        return cc;
    }
}
