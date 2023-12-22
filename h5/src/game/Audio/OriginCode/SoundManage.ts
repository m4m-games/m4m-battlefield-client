import { Dictionary } from "Data/Dictionary";
import { CAudioEx } from "./audioex";
import { CAudioChannel, CAudioPlayer } from "./CAudioPlayer";

export class SoundManage {
    public static get Instance(): SoundManage {
        if (SoundManage.instance == null) {
            SoundManage.instance = new SoundManage();
        }
        return SoundManage.instance;
    }
    private static instance: SoundManage;

    private _audioBufferDic: Dictionary = new Dictionary();
    private audioPlayer: CAudioPlayer;
    // private audioObj: m4m.framework.transform;

    public setAudioPlayer(audio: m4m.framework.transform) {
        // this.audioObj = audio;
        this.audioPlayer = new CAudioPlayer();
    }

    /**
     * 普通立即播放（不考虑之前的播放状态）
     * @param url
     * @param call
     * @param soundSourcePos  设定声源位置
     */
    public playAudio(url: string, audioChannel: CAudioChannel, volume: number = 1) {
        if (this.audioPlayer == null) { return; }
        // tslint:disable-next-line: newline-per-chained-call
        if (!CAudioEx.instance().isAvailable()) {
            return;
        }
        if (audioChannel == null || audioChannel.source == null) { return; }
        this.getAudioBuffer(url, (audioName: string, buffer: AudioBuffer) => {
            if (audioChannel.source == null) { return; }
            this.audioPlayer.init(audioName, audioChannel, false);
            this.audioPlayer.play(buffer, volume);
        });
    }
    /**
     * 中断式播放（暂停之前的，重头开始播放）
     * @param url
     * @param call
     * @param soundSourcePos设定声源位置
     */
    public playAudioInterrupt(url: string, audioChannel: CAudioChannel, volume: number = 1) {
        // tslint:disable-next-line: newline-per-chained-call
        if (!CAudioEx.instance().isAvailable()) {
            return;
        }
        if (audioChannel == null || audioChannel.source == null) { return; }
        this.getAudioBuffer(url, (audioName: string, buffer: AudioBuffer) => {
            if (audioChannel.source == null) { return; }
            this.audioPlayer.init(audioName, audioChannel, false);
            this.audioPlayer.play(buffer, volume);
        });
    }
    /**
     * 阻塞式播放（如果已经在播放，就忽略此次播放）
     * @param url
     * @param call
     * @param soundSourcePos设定声源位置
     */
    public playAudioBlocking(url: string, audioChannel: CAudioChannel, volume: number = 1) {
        // tslint:disable-next-line: newline-per-chained-call
        if (!CAudioEx.instance().isAvailable()) {
            return;
        }
        if (audioChannel == null || audioChannel.source == null) { return; }
        if (audioChannel.isplay) { return; }
        this.getAudioBuffer(url, (audioName: string, buffer: AudioBuffer) => {
            if (audioChannel.source == null) { return; }
            this.audioPlayer.init(audioName, audioChannel, false);
            this.audioPlayer.play(buffer, volume);
        });
    }
    /**
     * 长的背景音乐，固定循环播放
     * @param url
     */
    public playAuidoLoop(url: string, audioChannel: CAudioChannel, volume: number = 1): void {
        // tslint:disable-next-line: newline-per-chained-call
        if (!CAudioEx.instance().isAvailable()) {
            return;
        }
        if (url == null || url == "") { return; }
        if (audioChannel == null || audioChannel.source == null) { return; }
        audioChannel.gainNode.gain.value = volume;
        this.getAudioBuffer(url, (audioName: string, buffe: AudioBuffer) => {
            if (audioChannel.source == null) { return; }
            this.audioPlayer.init(audioName, audioChannel, true);
            this.audioPlayer.play(buffe, audioChannel.gainNode.gain.value);
        });
    }
    //暂停背景音乐播放
    public stopAudio(audioChannel: CAudioChannel) {
        // tslint:disable-next-line: newline-per-chained-call
        if (!CAudioEx.instance().isAvailable()) {
            return;
        }
        if (audioChannel == null || audioChannel.source == null) { return; }
        if (audioChannel.source.buffer == null) {
            audioChannel.source = null;
            return;
        }
        audioChannel.stop();
    }
    private getAudioBuffer(url: string, call: Function) {
        if (url == null || url == "") { return; }
        let lastIndex = url.lastIndexOf("/") + 1;
        let audioName = SoundManage.Substring(url, lastIndex);
        let audio: AudioBuffer = null;
        if (this._audioBufferDic.ContainsKey(audioName)) {
            audio = this._audioBufferDic.GetValue(audioName);
            call(audioName, audio);
        } else {
            // tslint:disable-next-line: newline-per-chained-call
            CAudioEx.instance().loadAudioBuffer(url, (buf, err) => {
                //LogManager.Error("加载声音完毕");
                if (err == null) {
                    call(audioName, buf);
                    SoundManage.instance._audioBufferDic.Add(audioName, buf);

                } else {
                    console.error("error:" + err);
                }
            });
        }
    }
    //因TS的 substring 和C#的Substring 方法 不同  这里写的一个C#  Substring方法相同用法
    public static Substring(str: string, start: number, length: number = 0): string {
        if (length == 0) {
            return str.substring(start);
        }
        return str.substring(start, start + length);
    }
}