import { AudioMgr } from "audio/AudioMgr";
import { AudioBase } from "AudioBase";
import { TimeUtil } from "Time/TimeUtil";
import { CacheToolData } from "../Data/CacheToolData";
import { GameMgr } from "../GameMgr";
import { AudioEnum } from "./AudioEnum";
import { AudioManager } from "./OriginCode/AudioManager";
import { SoundManage } from "./OriginCode/SoundManage";

/**
 * 项目 音频播放器
 * （结合音频配置 管理播放参数） 
 */
export class AudioPlayer {
    private static _currBGM: AudioEnum;
    // private static _audioKeyIDMap: { [key: string]: number };
    // private static get audioKeyIDMap() {
    //     if (!this._audioKeyIDMap && AudioBase.list) {
    //         this._audioKeyIDMap = {};
    //         AudioBase.list.forEach((val, key) => {
    //             this._audioKeyIDMap[(val as AudioBase).audioKey] = key as number;
    //         });
    //     }
    //     return this._audioKeyIDMap;
    // }
    /**当前在播放的 BGM */
    public static get currBGM() { return this._currBGM; }
    private static audioUrl: string;
    public static init() {
        // AudioMgr.init(`${GameMgr.CDNURL}${GameMgr.AudioPath}`);
        // AudioMgr.onEnded((resName: string) => {
        //     //
        //     // UiDataManager.changeFunctionData(BindKeyName.AUDIO_PLAYER_END, resName);
        // });
        this.audioUrl = `${GameMgr.CDNURL}${GameMgr.AudioPath}`;

        let audioObj = new m4m.framework.transform();
        SoundManage.Instance.setAudioPlayer(audioObj);
    }
    /**
     * 获取 音频的名字
     * @param audioType 
     */
    public static getResName(audioType: AudioEnum) {
        if (audioType == null) { return; }
        let _base = AudioBase.list.get(audioType) as AudioBase;
        if (!_base) { return; }
        return _base.resName;
    }

    // /**
    //  * 获取 音频的typeID ,通过 audioKey
    //  * @param audioKey 音频Key字符串
    //  */
    // public static getAudioIDByKey(audioKey: string): AudioEnum {
    //     if (!this.audioKeyIDMap) { return; }
    //     let _id = this.audioKeyIDMap[audioKey];
    //     return _id;
    // }

    /**
     * 播放BGM
     * @param audioType 
     */
    public static playBGM(audioType: AudioEnum, needLoop: boolean = true) {
        if (audioType == null) { return; }
        let _base = AudioBase.list.get(audioType) as AudioBase;
        if (!_base) { return; }
        this._currBGM = audioType;
        let resName = _base.resName;
        let volume = _base.volume;
        // AudioMgr.Play(resName, needLoop, volume);
        // console.error("播放音乐",CacheToolData.bgmVolume);
        AudioManager.Instance.playBgMusic(this.audioUrl + resName);
        AudioManager.Instance.setMusicVolume(CacheToolData.bgmVolume);
    }

    /**
     * 停播 BGM
     */
    public static stopBGM() {
        if (this._currBGM == null) { return; }
        let _base = AudioBase.list.get(this._currBGM) as AudioBase;
        if (!_base) { return; }
        // AudioMgr.Stop(_base.resName);
        AudioManager.Instance.stopBGMusic();
        this._currBGM = null;
    }

    /**
     * 播放指定 音频
     * @param audioType 
     */
    public static play(audioType: AudioEnum, volume: number = -1) {
        if (audioType == null) { return; }
        let _base = AudioBase.list.get(audioType) as AudioBase;
        if (!_base) { return; }
        if (volume == -1) {
            // tslint:disable-next-line: no-parameter-reassignment
            volume = _base.volume;
        }
        // _base.resName = "walk_sand.mp3";
        // _base.isLoop = true;
        // console.error("开始播声音", TimeUtil.realtimeSinceStartup);
        // AudioMgr.Play(_base.resName, _base.isLoop, volume);
        if (_base.isLoop) {
            AudioManager.Instance.playLoopAudio(this.audioUrl + _base.resName,volume);
        } else {
            AudioManager.Instance.playAudio(this.audioUrl + _base.resName,volume);
        }
    }

    /**
     * 停止播放 指定音频
     * @param audioType 
     */
    public static stop(audioType: AudioEnum) {
        if (audioType == null) { return; }
        let _base = AudioBase.list.get(audioType) as AudioBase;
        if (!_base) { return; }
        // AudioMgr.Stop(_base.resName);
        AudioManager.Instance.stopAudio(this.audioUrl + _base.resName);
    }

    /**
     * 停播所有 音频
     */
    public static stopAll() {
        this.stopBGM();
        // AudioMgr.stopAll();
        AudioManager.Instance.stopAllAudio();
    }

    /**
     * 设置静音状态
     * @param isMute 是否静音
     */
    public static setMute(isMute: boolean) {
        // AudioMgr.setMute(isMute);
    }

    /**
     * 暂停 指定音频
     * @param audioType 
     */
    public static pause(audioType: AudioEnum) {
        // if (audioType == null) { return; }
        // let _base = AudioBase.list.get(audioType) as AudioBase;
        // if (!_base) { return; }
        // AudioMgr.pause(_base.resName);
    }

    /**
     * 设置 音量 区分bgm 和其他 音效
     * @param audioResList bgm 
     * @param bgm 
     */
    public static setSpecialVolume(volume: number, audioResList: string[], bgm: boolean) {
        // AudioMgr.setSpecialVolume(volume, audioResList, bgm);
    }
    /**
     * 设置 指定音频的音量
     * @param audioType 
     * @param volume 
     */
    public static setVolume(audioType: AudioEnum, volume: number) {
        // if (audioType == null) { return; }
        // let _base = AudioBase.list.get(audioType) as AudioBase;
        // if (!_base) { return; }
        // // AudioMgr.setVolume(_base.resName, volume);
        // AudioManager.Instance.setAudioVolume(volume);
    }

    /**
     * 查看指定 音频是否 是暂停状态
     * @param audioType 
     */
    public static ispaused(audioType: AudioEnum) {
        // if (audioType == null) { return; }
        // let _base = AudioBase.list.get(audioType) as AudioBase;
        // if (!_base) { return; }
        // return AudioMgr.ispaused(_base.resName);
    }

    /**
     * 偏移 指定的位置，播放
     * @param audioType 
     * @param position 偏移时间（秒）
     */
    public static seek(audioType: AudioEnum, position: number) {
        // if (audioType == null) { return; }
        // let _base = AudioBase.list.get(audioType) as AudioBase;
        // if (!_base) { return; }
        // AudioMgr.Seek(_base.resName, position);
    }

    /**
     * 删除销毁 音频
     * @param audioType 
     */
    public static removeAudio(audioType: AudioEnum) {
        // if (audioType == null) { return; }
        // let _base = AudioBase.list.get(audioType) as AudioBase;
        // if (!_base) { return; }
        // AudioMgr.removeAudio(_base.resName);
    }

}

// import { AudioMgr } from "audio/AudioMgr";
// import { AudioBase } from "AudioBase";
// import { TimeUtil } from "Time/TimeUtil";
// import { GameMgr } from "../GameMgr";
// import { AudioEnum } from "./AudioEnum";
// import { AudioManager } from "./OriginCode/AudioManager";

// /**
//  * 项目 音频播放器
//  * （结合音频配置 管理播放参数） 
//  */
// export class AudioPlayer {
//     private static _currBGM: AudioEnum;
//     private static _audioKeyIDMap: { [key: string]: number };
//     private static get audioKeyIDMap() {
//         if (!this._audioKeyIDMap && AudioBase.list) {
//             this._audioKeyIDMap = {};
//             AudioBase.list.forEach((val, key) => {
//                 this._audioKeyIDMap[(val as AudioBase).audioKey] = key as number;
//             });
//         }
//         return this._audioKeyIDMap;
//     }
//     /**当前在播放的 BGM */
//     public static get currBGM() { return this._currBGM; }

//     public static init() {
//         AudioMgr.init(`${GameMgr.CDNURL}${GameMgr.AudioPath}`);
//         AudioMgr.onEnded((resName: string) => {
//             //
//             // UiDataManager.changeFunctionData(BindKeyName.AUDIO_PLAYER_END, resName);
//         });
//     }
//     /**
//      * 获取 音频的名字
//      * @param audioType 
//      */
//     public static getResName(audioType: AudioEnum) {
//         if (audioType == null) { return; }
//         let _base = AudioBase.list.get(audioType) as AudioBase;
//         if (!_base) { return; }
//         return _base.resName;
//     }

//     /**
//      * 获取 音频的typeID ,通过 audioKey
//      * @param audioKey 音频Key字符串
//      */
//     public static getAudioIDByKey(audioKey: string): AudioEnum {
//         if (!this.audioKeyIDMap) { return; }
//         let _id = this.audioKeyIDMap[audioKey];
//         return _id;
//     }

//     /**
//      * 播放BGM
//      * @param audioType 
//      */
//     public static playBGM(audioType: AudioEnum, needLoop: boolean = true) {
//         if (audioType == null) { return; }
//         let _base = AudioBase.list.get(audioType) as AudioBase;
//         if (!_base) { return; }
//         this._currBGM = audioType;
//         let resName = _base.resName;
//         let volume = _base.volume;
//         AudioMgr.Play(resName, needLoop, volume);
//     }

//     /**
//      * 停播 BGM
//      */
//     public static stopBGM() {
//         if (this._currBGM == null) { return; }
//         let _base = AudioBase.list.get(this._currBGM) as AudioBase;
//         if (!_base) { return; }
//         AudioMgr.Stop(_base.resName);
//         this._currBGM = null;
//     }

//     /**
//      * 播放指定 音频
//      * @param audioType 
//      */
//     public static play(audioType: AudioEnum, volume: number = -1) {
//         if (audioType == null) { return; }
//         let _base = AudioBase.list.get(audioType) as AudioBase;
//         if (!_base) { return; }
//         if (volume == -1) {
//             // tslint:disable-next-line: no-parameter-reassignment
//             volume = _base.volume;
//         }
//         // _base.resName = "walk_sand.mp3";
//         // _base.isLoop = true;
//         // console.error("开始播声音", TimeUtil.realtimeSinceStartup);
//         AudioMgr.Play(_base.resName, _base.isLoop, volume);
//     }

//     /**
//      * 停止播放 指定音频
//      * @param audioType 
//      */
//     public static stop(audioType: AudioEnum) {
//         if (audioType == null) { return; }
//         let _base = AudioBase.list.get(audioType) as AudioBase;
//         if (!_base) { return; }
//         AudioMgr.Stop(_base.resName);
//     }

//     /**
//      * 停播所有 音频
//      */
//     public static stopAll() {
//         this.stopBGM();
//         AudioMgr.stopAll();
//     }

//     /**
//      * 设置静音状态
//      * @param isMute 是否静音
//      */
//     public static setMute(isMute: boolean) {
//         AudioMgr.setMute(isMute);
//     }

//     /**
//      * 暂停 指定音频
//      * @param audioType 
//      */
//     public static pause(audioType: AudioEnum) {
//         if (audioType == null) { return; }
//         let _base = AudioBase.list.get(audioType) as AudioBase;
//         if (!_base) { return; }
//         AudioMgr.pause(_base.resName);
//     }

//     /**
//      * 设置 音量 区分bgm 和其他 音效
//      * @param audioResList bgm 
//      * @param bgm 
//      */
//     public static setSpecialVolume(volume: number, audioResList: string[], bgm: boolean) {
//         AudioMgr.setSpecialVolume(volume, audioResList, bgm);
//     }
//     /**
//      * 设置 指定音频的音量
//      * @param audioType 
//      * @param volume 
//      */
//     public static setVolume(audioType: AudioEnum, volume: number) {
//         if (audioType == null) { return; }
//         let _base = AudioBase.list.get(audioType) as AudioBase;
//         if (!_base) { return; }
//         AudioMgr.setVolume(_base.resName, volume);
//     }

//     /**
//      * 查看指定 音频是否 是暂停状态
//      * @param audioType 
//      */
//     public static ispaused(audioType: AudioEnum) {
//         if (audioType == null) { return; }
//         let _base = AudioBase.list.get(audioType) as AudioBase;
//         if (!_base) { return; }
//         return AudioMgr.ispaused(_base.resName);
//     }

//     /**
//      * 偏移 指定的位置，播放
//      * @param audioType 
//      * @param position 偏移时间（秒）
//      */
//     public static seek(audioType: AudioEnum, position: number) {
//         if (audioType == null) { return; }
//         let _base = AudioBase.list.get(audioType) as AudioBase;
//         if (!_base) { return; }
//         AudioMgr.Seek(_base.resName, position);
//     }

//     /**
//      * 删除销毁 音频
//      * @param audioType 
//      */
//     public static removeAudio(audioType: AudioEnum) {
//         if (audioType == null) { return; }
//         let _base = AudioBase.list.get(audioType) as AudioBase;
//         if (!_base) { return; }
//         AudioMgr.removeAudio(_base.resName);
//     }

// }