import {
    offlineTracksManager,
    historyTracksManager,
    favoriteTracksManager
} from './modules/offline-tracks/offline-tracks-manager.module';

export default async () => {
    const offlineData = await offlineTracksManager.data();
    const historyData = await historyTracksManager.data();
    const favoriteData = await favoriteTracksManager.data();

    return {
        player: {
            track: {
                default: true,
                thumbnail: 'http://az616578.vo.msecnd.net/files/2015/12/19/6358614596527738711752945771_music.jpg',
                title: 'Nothing playing',
                length: 0
            },
            playing: false,
            loading: false
        },
        offlineData,
        historyData,
        favoriteData,
        onlineData: []
    };
};
