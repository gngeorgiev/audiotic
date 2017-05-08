import {NativeModules, DeviceEventEmitter} from 'react-native';
import EventEmitter from 'EventEmitter';

const AudioPlayerNative = NativeModules.AudioPlayer;

let _current = {
    default: true,
    thumbnail: require('../res/music-player.png'),
    title: 'Nothing playing',
    length: 0
};
let _playing = false;
let _position = 0;

class AudioPlayerModule extends EventEmitter {
    //TODO: maybe bind a resolver directly?
    constructor() {
        super();
        DeviceEventEmitter.addListener('OnCompleted', () => this.emit('end'));

        setInterval(async () => {
            const position = await this.currentPosition() / 1000;
            if (position >= 0) {
                if (_position != position) {
                    this.emit('position', position);
                }
                
                _position = position;
            }
        }, 500);
    }
    
    get current() {
        return _current;
    }

    get playing() {
        return _playing;
    }

    get position() {
        return _position;
    }

    secondsToTime(seconds = this.position) {
        seconds = Math.round(seconds);
        let minutesReadable = Math.round(seconds / 60);
        let secondsReadable = Math.round(seconds % 60);

        if (minutesReadable.toString().length === 1) {
            minutesReadable = `0${minutesReadable}`;
        }

        if (secondsReadable.toString().length === 1) {
            secondsReadable = `0${secondsReadable}`;
        }

        return `${minutesReadable}:${secondsReadable}`;
    }

    async playNextTrack(resolve) {
        const nextTrack = this.current.next;        
        if (!nextTrack) {
            return;
        }

        nextTrack.previous = this.current;
        this.emit('next', nextTrack);
        await this.play(nextTrack);
    }

    async playPreviousTrack(resolve) {
        const previousTrack = this.current.previous;
        this.emit('previous', previousTrack);
        await this.play(previousTrack);
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

    async _resolveNextTrack(track, resolve) {
        if (!track.related.length || track.next) {
            return;
        }

        // const nextTrackId = track.related
        //     .filter(t => !!t.id)
        //     .find(t => track.previous && t.id !== track.previous.id).id;

        const nextTrack = await resolve(tracks.related.find(t => t.id).id);
        track.next = nextTrack;
    }

    async play(track, offline) {
        _current = track;
        _current.offline = !!offline;

        _playing = true;

        this.emit('play', track);
        await AudioPlayerNative.play(track.url, false);

        this._resolveNextTrack(track);
    }

    async seek(position) {
        _position = position;
        this.emit('seek', position);
        await AudioPlayerNative.seek(position * 1000);
    }

    download({streamUrl, title, id, provider, thumbnail}) {
        return AudioPlayerNative.saveToFile(streamUrl, title, id, provider, thumbnail);
    }

    getDownloadsFolder() {
        return AudioPlayerNative.getDownloadsFolderPath();
    }
}

export const AudioPlayer = new AudioPlayerModule();