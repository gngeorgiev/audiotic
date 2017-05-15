import { NativeModules, DeviceEventEmitter } from 'react-native';
import EventEmitter from 'EventEmitter';
import { resolvers } from 'audiotic-core';
import {
    OfflineTracksResolver,
    OfflineTracksManager
} from './OfflineTracksManager';

const { YouTube } = resolvers;

const AudioPlayerNative = NativeModules.AudioPlayer;

let _current = {
    default: true,
    thumbnail: require('../../res/music-player.png'),
    title: 'Nothing playing',
    length: 0
};
let _playing = false;
let _position = 0;

class AudioPlayerModule extends EventEmitter {
    _resolvers = {};
    _offlineResolver;

    constructor(resolvers = []) {
        super();

        resolvers.forEach(r => this.registerResolver(r.name, r));
        this.registerResolver('offline', new OfflineTracksResolver());
        this._offlineResolver = this._resolvers.offline;

        DeviceEventEmitter.addListener('OnCompleted', () => this.emit('end'));

        setInterval(async () => {
            const position = (await this.currentPosition()) / 1000;
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

    registerResolver(key, resolver) {
        this._resolvers[key] = resolver;
    }

    async isOffline({ id }) {
        return !!await this._offlineResolver.resolve(id);
    }

    async resolve({ id, source }) {
        const offlineTrack = await this._offlineResolver.resolve(id);
        if (offlineTrack) {
            return offlineTrack;
        }

        return await this._resolvers[source].resolve(id);
    }

    async search(str, source) {
        if (source === 'offline') {
            return await this._offlineResolver.search(str);
        }

        return await this._resolvers[source].search(str);
    }

    async playNextTrack() {
        const nextTrack = this.current.next;
        if (!nextTrack) {
            return;
        }

        nextTrack.previous = this.current;
        this.emit('next', nextTrack);
        await this.play(nextTrack);
    }

    async playPreviousTrack() {
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
        await AudioPlayerNative.play('');
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

        const nextTrackUnresolved = track.related.find(t => t.id);
        nextTrackUnresolved.source = track.source; //TODO:

        const nextTrack = await this.resolve(nextTrackUnresolved);
        track.next = nextTrack;
    }

    async play(track) {
        _current = track;

        _playing = true;

        this.emit('play', track);
        await AudioPlayerNative.play(track.url);

        this._resolveNextTrack(track);
    }

    async downloadTrack(track) {
        return await OfflineTracksManager.saveTrack(track);
    }

    async handleTrackSelected({ id, source }) {
        const { playing, current } = this;

        if (current && !playing && current.id === id) {
            await this.resume();
        } else if (current && playing && current.id === id) {
            await this.pause();
        } else {
            const track = await this.resolve({ id, source });
            await this.play(track);
        }
    }

    async seek(position) {
        _position = position;
        this.emit('seek', position);
        await AudioPlayerNative.seek(position * 1000);
    }

    download({ streamUrl, title, id, provider, thumbnail }) {
        return AudioPlayerNative.saveToFile(
            streamUrl,
            title,
            id,
            provider,
            thumbnail
        );
    }

    getDownloadsFolder() {
        return AudioPlayerNative.getDownloadsFolderPath();
    }
}

export const AudioPlayer = new AudioPlayerModule([YouTube]);
