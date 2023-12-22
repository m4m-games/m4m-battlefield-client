export class CAudioPlayer implements m4m.framework.INodeComponent {
    /**
    * @public
    * @language zh_CN
    * @classdesc
    * 获取音量大小
    * @version egret-m4m 1.0
    */
    get volume(): number {
        return this.audioChannel == null ? -1 : this.audioChannel.volume;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 设置音量大小
     * @param value 音量值
     * @version egret-m4m 1.0
     */
    set volume(val: number)//-1~1
    {
        // tslint:disable-next-line: no-unused-expression
        this.audioChannel == null ? 0 : this.audioChannel.volume = val;
    }
    public audioChannel: CAudioChannel;
    public buffer: AudioBuffer;
    public beLoop: boolean;
    public name: String;
    public gameObject: m4m.framework.gameObject;
    /**
     * 初始化声音播放器的播放
     * @param buffer 声音资源
     * @param volume 音量大小
     * @param beLoop 
     */
    public init(name: string, audioChannel: CAudioChannel, beLoop: boolean = false) {
        this.name = name;
        this.audioChannel = audioChannel;
        this.beLoop = beLoop;
    }
    public start() {

    }
    public update(delta: number) {

    }
    public remove() {

    }
    public clone() {

    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 播放声音
     * @param x 音源在3D空间中的播放位置
     * @param y 音源在3D空间中的播放位置
     * @param z 音源在3D空间中的播放位置
     */
    public play(buffer: AudioBuffer, volume: number = 0, onended?: Function, x?: number, y?: number, z?: number) {
        if (this.audioChannel == null) {
            return null;
        }
        this.buffer = buffer;
        this.volume = volume;
        let c = this.audioChannel;
        c.source.loop = this.beLoop;
        c.source.buffer = this.buffer;
        c.volume = this.volume;
        c.source.start();
        if (x && y && z) {
            c.pannerNode.setPosition(x, y, z);
        }
        c.isplay = true;
        if (!this.beLoop) {
            c.source.onended = () => {
                c.isplay = false;
                c.source = null;
                if (onended != undefined) {
                    onended();
                }
            };
        }
    }
    /**
    * @public
    * @language zh_CN
    * @classdesc
    * 停止播放
    * @version egret-m4m 1.0
    */
    public stop() {
        if (this.audioChannel != null) {
            this.audioChannel.stop();
        }
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 获得当前音频播放器是否在播放
     * @version egret-m4m 1.0
     */
    public isPlaying() {
        return this.audioChannel == undefined ? false : this.audioChannel.isplay;
    }

    public onPlay() {

    }
}

export class CAudioChannel {
    public source: AudioBufferSourceNode;
    public gainNode: GainNode;
    public pannerNode: PannerNode;
    /**当前个本声音 音量默认大小 (与整体声音调整区分开)
     */
    public defVolume: number = 1;
    /**
    * @public
    * @language zh_CN
    * @classdesc
    * 获取音量大小
    * @version egret-m4m 1.0
    */
    get volume(): number {
        return this.gainNode ? this.gainNode.gain.value : 0;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 设置音量大小
     * @param value 音量值
     * @version egret-m4m 1.0
     */
    set volume(val: number)//-1~1
    {
        // tslint:disable-next-line: no-parameter-reassignment
        val = val > 1 ? 1 : val;
        // tslint:disable-next-line: no-parameter-reassignment
        val = val <= 0 ? 0 : val;
        if (this.gainNode) {
            this.gainNode.gain.value = val;
        }
    }
    public isplay: boolean;
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 停止播放声音
     * @version egret-m4m 1.0
     */
    public stop() {
        if (this.source != null) {
            this.source.stop();
            this.source = null;
        }
        this.isplay = false;
    }
}
