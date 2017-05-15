import offlineTracksManager from './offline-tracks-manager.module';

export class OfflineTracksResolver {
    name = 'offline';

    async resolve(id) {
        return await offlineTracksManager.getTrack({ id });
    }

    async search(str) {
        if (!str) {
            return await offlineTracksManager.data();
        }

        const index = await offlineTracksManager._getIndex();
        return Object.keys(index)
            .filter(id => {
                const track = index[id];
                return track.title.includes(str);
            })
            .map(id => index[id]);
    }
}
