import { Dictionary } from "Data/Dictionary";
import { IDispose } from "Tools/engineParallel/spInterface";
import { CAudioEx } from "./audioex";
import { CAudioChannel } from "./CAudioPlayer";
import { SoundManage } from "./SoundManage";

/**
 * 
 */
export class AudioManager implements IDispose {

    public static get Instance(): AudioManager {
        if (AudioManager._instance == null) {
            AudioManager._instance = new AudioManager();
        }
        return AudioManager._instance;
    }
    private static _instance: AudioManager;
    /**
    * 背景音乐路径
    */
    private curBgMusicUrl: string = "";
    private curSoundUrl: string = "";
    private audioChannelDic: Dictionary = new Dictionary();
    private soundChannelDic: Dictionary = new Dictionary();
    private musicChannelDic: Dictionary = new Dictionary();

    private musicAudioChannel: CAudioChannel;
    private soundAudioChannel: CAudioChannel;
    private audioAudioChannel: CAudioChannel;
    private _musicVolume: number = 1;
    private _soundVolume: number = 1;
    //整体音效大小 调整值
    private _audioVolume: number = 1;

    /**
   *  播放声音与特效开关：
   *  
   */
    private isPlay: boolean = true;

    //设定语音声音大小
    public setSoundVolume(volume: number) {
        this._soundVolume = volume;
        if (volume <= 0) {
            this.stopSound();

        }
        if (this.soundAudioChannel) {
            this.soundAudioChannel.volume = volume;
        }
    }
    //设定背景音乐大小
    public setMusicVolume(volume: number) {
        this._musicVolume = volume;
        if (volume <= 0) {
            this.stopBGMusic();
        } else {
            this.playBgMusic();
        }
        if (this.musicAudioChannel) {
            this.musicAudioChannel.volume = volume;
        }
    }

    //设置音效大小
    public setAudioVolume(volume: number) {
        this._audioVolume = volume;
        if (volume <= 0) {
            this.stopAllAudio();
        }
        if (this.audioAudioChannel) {
            this.audioAudioChannel.volume = volume;
        }
    }

    /**
     * 局部控制背景声音
     * @param posX 角色的世界坐标X值
     */
    public controlMusicVolume(posX: number) {
        if (posX > 19950) {
            let deviation = Math.abs((posX - 21550) / (23600 - 19500));
            let soundPer = (1 - deviation) * 0.9;
            if (posX > 21550) {
                soundPer = (soundPer + deviation * 0.2) * 0.6;
            }
            this.setMusicVolume(soundPer);
        }

    }

    /**
     * 背景音乐
     */
    public playBgMusic(musicPath?: string) {
        if (!musicPath) {
            if (this.musicAudioChannel && this.musicAudioChannel.isplay) {
                return;
            }
            // tslint:disable-next-line: no-parameter-reassignment
            musicPath = this.curBgMusicUrl;
        } else {
            if (musicPath == this.curBgMusicUrl) {
                return;
            }
            this.curBgMusicUrl = musicPath;
        }
        this.playMusic(musicPath);
    }

    /**
     * 播放NPC语音
     * @param soundPath
     * @param callBack
     */
    public playNPCSound(soundPath: string) {
        try {
            this.clearSoundChannelDic();
            if (this.soundChannelDic.ContainsKey(soundPath)) { return; }
            this.curSoundUrl = soundPath;
            this.stopSound();
            // tslint:disable-next-line: newline-per-chained-call
            this.soundAudioChannel = CAudioEx.instance().createAudioChannel();
            SoundManage.Instance.playAudioInterrupt(soundPath, this.soundAudioChannel, this._soundVolume);
            this.soundChannelDic.Add(soundPath, this.soundAudioChannel);
        } catch (error) { }
    }

    /**
     * 播放聊天语音
     */
    public PlayChatSound(soundPath: string) {
        try {
            this.clearSoundChannelDic();
            if (this.soundChannelDic.ContainsKey(soundPath)) { return; }
            this.curSoundUrl = soundPath;
            this.stopSound();
            // tslint:disable-next-line: newline-per-chained-call
            this.soundAudioChannel = CAudioEx.instance().createAudioChannel();
            SoundManage.Instance.playAudioInterrupt(soundPath, this.soundAudioChannel, this._soundVolume);
            this.soundChannelDic.Add(soundPath, this.soundAudioChannel);
        } catch (error) { }
    }

    /**
     * 设置聊天语音
     */
    public setChatSound(value: boolean) {
        if (!value) {
            this.stopSound();
        }
    }
    /**
     * 设置背景音乐
     */
    public setBGMusic(value: boolean) {
        if (value) {
            this.playBgMusic();
        } else {
            this.stopBGMusic();
        }
    }

    /**
     * 停止播放背景音乐
     */
    public stopBGMusic() {
        //CEngine.LogManager.Error("停止播放背景音乐");
        for (let i = 0; i < this.musicChannelDic.values.length; i++) {
            let value: CAudioChannel = this.musicChannelDic.values[i];
            SoundManage.Instance.stopAudio(value);
        }
        this.musicChannelDic.Clear();
        //this.curBgMusicUrl = "";
    }

    /**
     * 移除释放掉的MusicAudioChannel
     */
    public clearMusicChannelDic() {
        let list = new Array<string>();
        for (let i = 0; i < this.musicChannelDic.keys.length; i++) {
            let key: string = this.musicChannelDic.keys[i];
            let value: CAudioChannel = this.musicChannelDic.values[i];
            if (value.source == null) { list.push(key); }
        }
        for (let i = 0; i < list.length; i++) {
            this.musicChannelDic.Remove(list[i]);
        }
        list.length = 0;
    }

    /**
    * 移除释放掉的audio AudioChannel
    */
    public clearAudioChannelDic() {
        let list = new Array<string>();
        for (let i = 0; i < this.audioChannelDic.keys.length; i++) {
            let key: string = this.audioChannelDic.keys[i];
            let value: CAudioChannel = this.audioChannelDic.values[i];
            if (value.source == null) { list.push(key); }
        }
        for (let i = 0; i < list.length; i++) {
            this.audioChannelDic.Remove(list[i]);
        }
        list.length = 0;
    }

    /**
    * 移除释放掉的audio AudioChannel
    */
    public clearSoundChannelDic() {
        let list = new Array<string>();
        for (let i = 0; i < this.soundChannelDic.keys.length; i++) {
            let key: string = this.soundChannelDic.keys[i];
            let value: CAudioChannel = this.soundChannelDic.values[i];
            if (value.source == null) { list.push(key); }
        }
        for (let i = 0; i < list.length; i++) {
            this.soundChannelDic.Remove(list[i]);
        }
        list.length = 0;
    }

    /**
     * 停止播放npc语音
     */
    public stopSound() {
        for (let i = 0; i < this.soundChannelDic.values.length; i++) {
            let value: CAudioChannel = this.soundChannelDic.values[i];
            SoundManage.Instance.stopAudio(value);
        }
        this.soundChannelDic.Clear();
    }

    /**
     * 停止播放音效
     */
    public stopAllAudio() {
        for (let i = 0; i < this.audioChannelDic.values.length; i++) {
            let value: CAudioChannel = this.audioChannelDic.values[i];
            SoundManage.Instance.stopAudio(value);
        }
        this.audioChannelDic.Clear();
    }

    /**
     * 停止某一个音效播放
     * @param name
     */
    public stopAudio(name: string) {
        for (let i = 0; i < this.audioChannelDic.values.length; i++) {
            let value: CAudioChannel = this.audioChannelDic.values[i];
            let key: string = this.audioChannelDic.keys[i];
            if (key.indexOf(name) != -1) {
                SoundManage.Instance.stopAudio(value);
                this.audioChannelDic.Remove(key);
            }
        }
    }

    /**
     * 循环播放
     * @param path 声音资源路径
     */
    public playLoopAudio(path: string, volume: number = 1): CAudioChannel {
        try {
            // tslint:disable-next-line: newline-per-chained-call
            this.audioAudioChannel = CAudioEx.instance().createAudioChannel();
            //存当前个本声音 音量默认大小
            this.audioAudioChannel.defVolume = volume;
            let volNum = this._audioVolume * volume;
            SoundManage.Instance.playAuidoLoop(path, this.audioAudioChannel, volNum);
            this.audioChannelDic.Add(path, this.audioAudioChannel);
        } catch (error) { }
        return this.audioAudioChannel;
    }

    /**
     * 普通立即播放（不考虑之前的播放状态）
     * @param path 声音资源路径
     */
    public playAudio(path: string, volume: number = 1): CAudioChannel {
        try {
            this.clearAudioChannelDic();
            // tslint:disable-next-line: newline-per-chained-call
            this.audioAudioChannel = CAudioEx.instance().createAudioChannel();
            //存当前个本声音 音量默认大小
            this.audioAudioChannel.defVolume = volume;
            let volNum = this._audioVolume * volume;
            SoundManage.Instance.playAudio(path, this.audioAudioChannel, volNum);
            this.audioChannelDic.Add(path, this.audioAudioChannel);
        } catch (error) { }
        return this.audioAudioChannel;
    }

    /**
     * 阻塞式播放（如果已经在播放，就忽略此次播放）
     * @param path 声音播放路径
     */
    public playAudioBlocking(path: string, volume: number = 1): CAudioChannel {
        try {
            this.clearAudioChannelDic();
            // tslint:disable-next-line: newline-per-chained-call
            this.audioAudioChannel = CAudioEx.instance().createAudioChannel();
            //存当前个本声音 音量默认大小
            this.audioAudioChannel.defVolume = volume;
            let volNum = this._audioVolume * volume;
            SoundManage.Instance.playAudioBlocking(path, this.audioAudioChannel, volNum);
            this.audioChannelDic.Add(path, this.audioAudioChannel);
        } catch (error) { }
        return this.audioAudioChannel;
    }

    /**
     * 中断式播放（暂停之前的，重头开始播放）
     * @param path 声音资源路径
     */
    public playAudioInterrupt(path: string, volume: number = 1): CAudioChannel {
        try {
            this.clearAudioChannelDic();
            // tslint:disable-next-line: newline-per-chained-call
            this.audioAudioChannel = CAudioEx.instance().createAudioChannel();
            //存当前个本声音 音量默认大小
            this.audioAudioChannel.defVolume = volume;
            let volNum = this._audioVolume * volume;
            SoundManage.Instance.playAudioInterrupt(path, this.audioAudioChannel, volNum);
            this.audioChannelDic.Add(path, this.audioAudioChannel);
        } catch (error) { }
        return this.audioAudioChannel;
    }

    public dispose() {

    }

    /**
     * 长的背景音乐，固定循环播放
     * @param musicPath 声音播放路径
     */
    private playMusic(musicPath: string) {
        try {
            this.clearMusicChannelDic();
            if (this.musicChannelDic.ContainsKey(musicPath)) { return; }
            // tslint:disable-next-line: newline-per-chained-call
            this.musicAudioChannel = CAudioEx.instance().createAudioChannel();
            SoundManage.Instance.playAuidoLoop(musicPath, this.musicAudioChannel, this._musicVolume);
            this.musicChannelDic.Add(musicPath, this.musicAudioChannel);
        } catch (error) {
            console.error(error);
        }
    }

}