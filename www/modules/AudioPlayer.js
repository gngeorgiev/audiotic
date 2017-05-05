import {NativeModules, DeviceEventEmitter} from 'react-native';
import EventEmitter from 'EventEmitter';

const AudioPlayerNative = NativeModules.AudioPlayer;

let _current = null;
let _playing = false;

class AudioPlayerModule extends EventEmitter {
    constructor() {
        super();
        DeviceEventEmitter.addListener('OnCompleted', () => this.emit('end'));
    }
    
    get current() {
        return _current;
    }

    get playing() {
        return _playing;
    }

    currentPosition() {
        return AudioPlayerNative.getCurrentPosition();
    }

    async resume() {
        _playing = true;
        this.emit('resume');
        await AudioPlayerNative.play('', this.current.offline);
    }

    async pause() {
        _playing = false;
        this.emit('pause');
        await AudioPlayerNative.pause();
    }

    async stop() {
        _playing = false;
        this.emit('stop');
        await AudioPlayerNative.stop();
    }

    async play(track, offline) {
        _current = track;
        _current.offline = !!offline;

        _playing = true;
        this.emit('play', track);
        await AudioPlayerNative.play(track.url, !!offline);
    }

    async seek(position) {
        this.emit('seek', position);
        await AudioPlayerNative.seek(position);
    }

    download({streamUrl, title, id, provider, thumbnail}) {
        return AudioPlayerNative.saveToFile(streamUrl, title, id, provider, thumbnail);
    }

    getDownloadsFolder() {
        return AudioPlayerNative.getDownloadsFolderPath();
    }
}

export const AudioPlayer = new AudioPlayerModule();