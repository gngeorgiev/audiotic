import audioPlayer from '../../modules/audio-player/audio-player.module';

import trackResolver from '../../modules/track-resolver/track-resolver.module';
import {
    offlineTracksManager,
    historyTracksManager,
    favoriteTracksManager
} from '../../modules/offline-tracks/offline-tracks-manager.module';

import {
    offlineTracksResolver
} from '../../modules/offline-tracks/offline-tracks-resolver.module';

const toggleLoadingTrack = (id, fn) => {
    //currently the loadingId is not being used, but it will certainly be useful in the future, we are not awaiting the promise since we don't need to wait for it
    return async dispatch => {
        dispatch(toggleTrackLoading(id));
        await fn();
        dispatch(toggleTrackLoading(false));
    };
};

export const toggleTrackLoading = loadingId => {
    return {
        type: 'LOADING_TRACK',
        loadingId
    };
};

export const play = track => {
    return async dispatch => {
        toggleLoadingTrack(track.id, () => audioPlayer.play(track))(dispatch);
        historyTracksManager.addTrack(track);

        const isOffline = await trackResolver.isOffline(track);
        const isFavorite = await trackResolver.isFavorite(track);

        return dispatch({
            type: 'PLAY_TRACK',
            playing: true,
            track,
            isOffline,
            isFavorite
        });
    };
};

export const playNext = () => {
    return async (dispatch, getState) => {
        const { player } = getState();
        const { track } = player;

        if (!track.related.length) {
            track.next = track;
        } else {
            const nextTrackUnresolved = track.related.find(t => t.id);
            const nextTrack = await trackResolver.resolve(nextTrackUnresolved);
            track.next = nextTrack;
        }

        track.next.previous = track;

        return dispatch(play(track.next));
    };
};

export const download = track => {
    return async dispatch => {
        const offlineTrack = await offlineTracksResolver.saveTrack(track);

        return dispatch({
            type: 'DOWNLOAD_TRACK',
            track: offlineTrack,
            isOffline: true
        });
    };
};

export const favorite = track => {
    return async dispatch => {
        const isFavorite = await trackResolver.isFavorite(track);
        if (isFavorite) {
            await favoriteTracksManager.removeTrack(track);

            return dispatch({
                type: 'FAVORITE_TRACK',
                isFavorite: false,
                track
            });
        }

        await favoriteTracksManager.addTrack(track);

        return dispatch({
            type: 'FAVORITE_TRACK',
            isFavorite: true,
            track
        });
    };
};

export const playPrev = () => {
    return (dispatch, getState) => {
        const { player } = getState();
        const { track } = player;

        return dispatch(play(track.previous || track));
    };
};

export const pause = () => {
    return async dispatch => {
        await audioPlayer.pause();
        return dispatch({
            type: 'PAUSE_TRACK',
            playing: false
        });
    };
};

export const resume = () => {
    return async dispatch => {
        await audioPlayer.resume();
        return dispatch({
            type: 'RESUME_TRACK',
            playing: true
        });
    };
};

export const seek = position => {
    return async dispatch => {
        await audioPlayer.seek(position);
        return dispatch({
            type: 'SEEK_TRACK',
            position
        });
    };
};

export const playPause = newTrack => {
    return async (dispatch, getState) => {
        const state = getState();

        const { player } = state;
        const { playing, track } = player;
        if (!newTrack) {
            newTrack = { id: track.id };
        }

        if (track && !playing && track.id === newTrack.id) {
            return dispatch(resume());
        } else if (track && playing && track.id === newTrack.id) {
            return dispatch(pause());
        } else {
            const trackToPlay = await trackResolver.resolve(newTrack);
            return dispatch(play(trackToPlay));
        }
    };
};

export const updatePosition = () => {
    return {
        type: 'UPDATE_POSITION',
        position: audioPlayer.position
    };
};
