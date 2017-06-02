import defaultState from '../../defaultState';

export const player = (state = {}, action) => {
    switch (action.type) {
        case 'PLAY_TRACK':
            return Object.assign({}, state, {
                track: action.track,
                playing: action.playing,
                isOffline: action.isOffline,
                isFavorite: action.isFavorite
            });
        case 'PAUSE_TRACK':
        case 'RESUME_TRACK':
            return Object.assign({}, state, {
                playing: action.playing
            });
        case 'UPDATE_POSITION':
        case 'SEEK_TRACK':
            return Object.assign({}, state, {
                position: action.position
            });
        case 'LOADING_TRACK':
            return Object.assign({}, state, {
                loadingId: action.loadingId
            });
        case 'DOWNLOAD_TRACK':
            return Object.assign({}, state, {
                track: action.track,
                isOffline: action.isOffline
            });
        case 'FAVORITE_TRACK':
            return Object.assign({}, state, {
                track: action.track,
                isFavorite: action.isFavorite
            });
        case 'HISTORY_TRACKS':
            return Object.assign({}, state, {
                historyData: state.tracks
            });
        case 'OFFLINE_TRACKS':
            return Object.assign({}, state, {
                offlineData: state.tracks
            });
        case 'FAVORITE_TRACKS':
            return Object.assign({}, state, {
                favoriteData: state.tracks
            });
        default:
            return state;
    }
};
