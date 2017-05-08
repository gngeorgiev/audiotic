import { AsyncStorage } from 'react-native';
import EventEmitter from 'EventEmitter';
import rnfs from 'react-native-fs';

class OfflineTracksManagerModule extends EventEmitter {
    _indexKey = '@OfflineTracksIndex_';
    _localUrl = rnfs.DocumentDirectoryPath;

    async _getIndex() {
        return JSON.parse(await AsyncStorage.getItem(this._indexKey) || '{}');
    }

    async _writeToIndex(track) {
        const index = this._getIndex();
        index[track.id] = track;
        return await AsyncStorage.setItem(this._indexKey, JSON.stringify(index));
    }

    _getTrackLocalUrl(track) {
        return `${this._localUrl}/${track.id}`;
    }

    async getTrack(id) {
        const index = await this._getIndex();
        return index[id] || null;
    }

    async saveTrack(track) {
        const fromUrl = track.url;
        const toFile = this._getTrackLocalUrl(track.id);

        await rnfs.downloadFile({ fromUrl, toFile }).promise;
        track.url = toFile;

        await this._writeToIndex(track);

        this.emit('downloaded', track);
    }
}

export const OfflineTracksManager = new OfflineTracksManagerModule();