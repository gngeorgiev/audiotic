import { AsyncStorage } from 'react-native';
import EventEmitter from 'EventEmitter';

class OfflineTracksManager extends EventEmitter {
    _shouldSort = false;
    _indexKey = '';
    _localIndex = null;
    _data = null;
    _dataHasNewItem = false; //lets save a few sorts of the data

    constructor(indexKey, shouldSort) {
        super();

        this._shouldSort = shouldSort;
        this._indexKey = indexKey;
    }

    async getIndex() {
        let index = await AsyncStorage.getItem(this._indexKey);
        if (!index) {
            index = '{}';
        }

        return JSON.parse(index);
    }

    _prepareTrackForSave(track) {
        track.timestamp = new Date();
        delete track.previous;
        delete track.next;
    }

    async clear() {
        await AsyncStorage.setItem(this._indexKey, '');
    }

    async addTrack(track) {
        const index = await this.getIndex();
        if (index[track.id]) {
            return false;
        }

        this._prepareTrackForSave(track);

        index[track.id] = track;
        await AsyncStorage.setItem(this._indexKey, JSON.stringify(index));

        if (!this._localIndex || !this._data) {
            //lets refresh the data if it's not yet updated
            //in theory this shouldn't happen
            await this.data();
        } else {
            //updating the local index and data so they can be more performant
            this._localIndex[track.id] = track;
            this._data.unshift(track);
            this._dataHasNewItem = true;
        }

        this.emit('change', {
            type: 'new',
            track
        });
    }

    async getTrack({ id }) {
        const index = await this.getIndex();
        return index[id] || null;
    }

    async removeTrack(track) {
        const { id } = track;

        const index = await this.getIndex();
        if (!index[id]) {
            return false;
        }

        delete index[id];
        await AsyncStorage.setItem(this._indexKey, JSON.stringify(index));

        delete this._localIndex[id];
        this._data = this._data.filter(t => t.id !== id);
        this._dataHasNewItem = true;

        this.emit('change', {
            type: 'remove',
            track
        });
    }

    async data() {
        const index = await new Promise(async resolve => {
            if (!this._localIndex) {
                this._localIndex = await this.getIndex();
            }

            return resolve(this._localIndex);
        });

        if (!this._data) {
            this._data = Object.keys(index).map(id => index[id]);
        }

        if (this._dataHasNewItem && this._shouldSort) {
            this._dataHasNewItem = false;
            return this._data.sort((a, b) => {
                return (
                    new Date(b.timestamp || new Date()) -
                    new Date(a.timestamp || new Date())
                );
            });
        }

        return this._data;
    }
}

const offlineTracksIndexKey = '@OfflineTracksIndex_';
export const offlineTracksManager = new OfflineTracksManager(
    offlineTracksIndexKey,
    true
);

const historyTracksIndexKey = '@HistoryTracksIndex_';
export const historyTracksManager = new OfflineTracksManager(
    historyTracksIndexKey,
    true
);

const favoriteTracksIndexKey = '@FavoriteTracksIndex_';
export const favoriteTracksManager = new OfflineTracksManager(
    favoriteTracksIndexKey,
    true
);
