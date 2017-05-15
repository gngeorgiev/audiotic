import { AudioPlayer } from '../../modules/AudioPlayer';

export const toggleTrackLoading = loadingId => {
    return {
        type: 'LOADING_TRACK',
        loadingId
    };
};

export const play = track => {
    return async dispatch => {
        await dispatch(toggleTrackLoading(track.id));
        await AudioPlayer.play(track);
        await dispatch(toggleTrackLoading(null));

        return dispatch({
            type: 'PLAY_TRACK',
            playing: true,
            track
        });
    };
};

export const pause = () => {
    return async dispatch => {
        await AudioPlayer.pause();
        return dispatch({
            type: 'PAUSE_TRACK',
            playing: false
        });
    };
};

export const resume = () => {
    return async dispatch => {
        await AudioPlayer.resume();
        return dispatch({
            type: 'RESUME_TRACK',
            playing: true
        });
    };
};

export const seek = position => {
    return async dispatch => {
        await AudioPlayer.seek(position);
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
            const trackToPlay = await AudioPlayer.resolve(newTrack);
            return dispatch(play(trackToPlay));
        }
    };
};

export const updatePosition = () => {
    return {
        type: 'UPDATE_POSITION',
        position: AudioPlayer.position
    };
};
