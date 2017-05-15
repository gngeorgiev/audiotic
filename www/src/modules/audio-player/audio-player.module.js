import { NativeModules, DeviceEventEmitter } from 'react-native';
import EventEmitter from 'EventEmitter';

const AudioPlayerNative = NativeModules.AudioPlayer;

class AudioPlayer extends EventEmitter {
    _playing = false;
    _position = 0;
    _current = {};

    constructor() {
        super();

        DeviceEventEmitter.addListener('ON_TRACK_END', () => this.emit('end'));

        setInterval(async () => {
            const position = (await this.currentPosition()) / 1000;
            if (position >= 0) {
                if (this._position != position) {
                    this.emit('position', position);
                }

                this._position = position;
            }
        }, 500);
    }

    get current() {
        return this._current;
    }

    get playing() {
        return this._playing;
    }

    get position() {
        return this._position;
    }

    async currentPosition() {
        return await AudioPlayerNative.getCurrentPosition();
    }

    async pauseResumeTrack() {
        if (this.playing) {
            await this.pause();
        } else {
            await this.resume();
        }
    }

    async resume() {
        this._playing = true;
        this.emit('resume');
        await AudioPlayerNative.play('');
    }

    async pause() {
        this._playing = false;
        this.emit('pause');
        await AudioPlayerNative.pause();
    }

    async stop() {
        this._playing = false;
        this.emit('stop');
        await AudioPlayerNative.stop();
    }

    async play(track) {
        _current = track;

        this._playing = true;

        this.emit('play', track);
        await AudioPlayerNative.play(track.url);
    }

    async seek(position) {
        this._position = position;
        this.emit('seek', position);
        await AudioPlayerNative.seek(position * 1000);
    }
}

export default new AudioPlayer();
