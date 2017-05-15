import { OfflineTracksManager } from './offline-tracks-manager.module';

export class OfflineTracksResolver {
    name = 'offline';

    _tracksManager = new OfflineTracksManager();

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
