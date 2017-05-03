import {NativeModules} from 'react-native';

const AudioPlayerNative = NativeModules.AudioPlayer;

export const AudioPlayer = {
    _current: null,

    get current() {
        return this._current;
    },

    currentPosition() {
        return AudioPlayerNative.getCurrentPosition();
    },

    resume() {
        return AudioPlayerNative.play('');
    },

    pause() {
        return AudioPlayerNative.pause();
    },

    stop() {
        return AudioPlayerNative.stop();
    },

    play(track, offline) {
        if (typeof offline !== 'boolean') {
            offline = false;
        }

        this._current = track;
        this._current.offline = offline;

        return AudioPlayerNative.play(track.url, offline);
    },

    download({streamUrl, title, id, provider, thumbnail}) {
        return AudioPlayerNative.saveToFile(streamUrl, title, id, provider, thumbnail);
    },

    getDownloadsFolder() {
        return AudioPlayerNative.getDownloadsFolderPath();
    },
};