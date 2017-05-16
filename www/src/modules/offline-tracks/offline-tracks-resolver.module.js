import {
    offlineTracksManager,
    favoriteTracksManager
} from './offline-tracks-manager.module';
import rnfs from 'react-native-fs';

class TracksResolver {
    _localUrl = rnfs.DocumentDirectoryPath;

    name;

    constructor(name, manager) {
        this.name = name;
        this.manager = manager;
    }

    async resolve(id) {
        return await this.manager.getTrack({ id });
    }

    async search(str) {
        if (!str) {
            return await this.manager.data();
        }

        const index = await this.manager.getIndex();
        return Object.keys(index)
            .filter(id => {
                const track = index[id];
                return track.title.includes(str);
            })
            .map(id => index[id]);
    }
}

class OfflineTracksResolver extends TracksResolver {
    constructor() {
        super('offline', offlineTracksManager);
    }

    _getTrackLocalUrl({ id }) {
        return `${this._localUrl}/${id}`;
    }

    async saveTrack(track) {
        const savedOfflineTrack = await this.manager.getTrack(track);
        if (savedOfflineTrack) {
            return false;
        }

        const fromUrl = track.url;
        const toFile = this._getTrackLocalUrl(track);

        await rnfs.downloadFile({ fromUrl, toFile }).promise;
        const offlineTrack = Object.assign({}, track);

        offlineTrack.url = toFile;
        offlineTrack.source = 'offline';

        await this.manager.addTrack(offlineTrack);

        return offlineTrack;
    }
}

class FavoriteTracksResolver extends TracksResolver {
    constructor() {
        super('favorite', favoriteTracksManager);
    }
}

export const offlineTracksResolver = new OfflineTracksResolver();

export const favoriteTracksResolver = new FavoriteTracksResolver();
