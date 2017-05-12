import { AsyncStorage } from 'react-native';
import EventEmitter from 'EventEmitter';
import rnfs from 'react-native-fs';

class OfflineTracksManagerModule extends EventEmitter {
    _indexKey = '@OfflineTracksIndex_';
    _localUrl = rnfs.DocumentDirectoryPath;
    _data = {};
    _loaded = false;

    async data() {
        const data = await new Promise(resolve => {
            if (!this._loaded) {
                return this.once('loaded', () => resolve(this._data));
            } else {
                return resolve(this._data);
            }
        });

        return Object.keys(data).map(id => data[id]);
    }

    constructor() {
        super();

        this._getIndex().then(index => {
            this._data = Object.assign({}, index);
            this._loaded = true;
            this.emit('loaded');
        });
    }

    async _getIndex() {
        let index = await AsyncStorage.getItem(this._indexKey);
        if (!index) {
            index = '{}';
        }

        return JSON.parse(index);
    }

    async _writeToIndex(track) {
        const index = await this._getIndex();
        index[track.id] = track;
        this.data = Object.assign({}, index);
        return await AsyncStorage.setItem(
            this._indexKey,
            JSON.stringify(index)
        );
    }

    _getTrackLocalUrl({ id }) {
        return `${this._localUrl}/${id}`;
    }

    async getTrack({ id }) {
        const index = await this._getIndex();
        if (index[id]) {
            return index[id];
        }

        return null;
    }

    async saveTrack(track) {
        const savedOfflineTrack = await this.getTrack(track);
        if (savedOfflineTrack) {
            return this.emit('downloaded', false);
        }

        const fromUrl = track.url;
        const toFile = this._getTrackLocalUrl(track);

        await rnfs.downloadFile({ fromUrl, toFile }).promise;
        const offlineTrack = Object.assign({}, track);

        offlineTrack.url = toFile;
        offlineTrack.source = 'offline';

        await this._writeToIndex(offlineTrack);

        this.emit('downloaded', offlineTrack);
    }
}

export class OfflineTracksResolver {
    name = 'offline';

    _tracksManager = new OfflineTracksManagerModule();

    async resolve(id) {
        return await this._tracksManager.getTrack({ id });
    }

    async search(str) {
        if (!str) {
            return await this._tracksManager.data();
        }

        const index = await this._tracksManager._getIndex();
        return Object.keys(index)
            .filter(id => {
                const track = index[id];
                return track.title.includes(str);
            })
            .map(id => index[id]);
    }
}

export const OfflineTracksManager = new OfflineTracksManagerModule();
