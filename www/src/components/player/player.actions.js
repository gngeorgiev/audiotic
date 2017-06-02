import { Actions } from 'react-native-router-flux';

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

        const isOffline = await trackResolver.isOffline(track);
        const isFavorite = await trackResolver.isFavorite(track);

        dispatch({
            type: 'PLAY_TRACK',
            playing: true,
            track,
            isOffline,
            isFavorite
        });

        await historyTracksManager.addTrack(track);
        dispatch({
            type: 'HISTORY_TRACKS',
            tracks: await historyTracksManager.data()
        });
    };
};

export const playNext = () => {
    return async (dispatch, getState) => {
        const { player } = getState();
        const { track } = player;
        if (track.default) {
            return;
        }

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
        if (track.default) {
            return;
        }

        offlineTracksResolver.saveTrack(track).then(async offlineTrack => {
            dispatch({
                type: 'DOWNLOAD_TRACK',
                track: offlineTrack,
                isOffline: true
            });

            dispatch({
                type: 'OFFLINE_TRACKS',
                tracks: await offlineTracksManager.data()
            });
        });
    };
};

export const favorite = track => {
    return async dispatch => {
        if (track.default) {
            return;
        }

        const updateOfflineTracks = async () => {
            dispatch({
                type: 'FAVORITE_TRACKS',
                tracks: await favoriteTracksManager.data()
            });
        };

        const isFavorite = await trackResolver.isFavorite(track);
        if (isFavorite) {
            await favoriteTracksManager.removeTrack(track);

            dispatch({
                type: 'FAVORITE_TRACK',
                isFavorite: false,
                track
            });

            updateOfflineTracks();
        }

        await favoriteTracksManager.addTrack(track);

        dispatch({
            type: 'FAVORITE_TRACK',
            isFavorite: true,
            track
        });

        updateOfflineTracks();
    };
};

export const playPrev = () => {
    return (dispatch, getState) => {
        const { player } = getState();
        const { track } = player;
        if (track.default) {
            return;
        }

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
    return async (dispatch, getState) => {
        const { track } = getState().player;
        if (track.default) {
            return;
        }

        await audioPlayer.resume();
        return dispatch({
            type: 'RESUME_TRACK',
            playing: true
        });
    };
};

export const seek = position => {
    return async (dispatch, getState) => {
        const { track } = getState().player;
        if (track.default) {
            return;
        }

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
            await dispatch(play(trackToPlay));
            Actions.fullScreenPlayer();
        }
    };
};

export const updatePosition = () => {
    return {
        type: 'UPDATE_POSITION',
        position: audioPlayer.position
    };
};
