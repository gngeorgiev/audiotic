import audioPlayer from '../../modules/audio-player/audio-player.module';

import trackResolver from '../../modules/track-resolver/track-resolver.module';

export const toggleTrackLoading = loadingId => {
    return {
        type: 'LOADING_TRACK',
        loadingId
    };
};

export const play = track => {
    return async dispatch => {
        await dispatch(toggleTrackLoading(track.id));
        await audioPlayer.play(track);
        await dispatch(toggleTrackLoading(null));

        const isOffline = await trackResolver.isOffline(track);

        return dispatch({
            type: 'PLAY_TRACK',
            playing: true,
            track,
            isOffline
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
