import defaultState from '../../defaultState';

export const player = (state = defaultState.player, action) => {
    switch (action.type) {
        case 'PLAY_TRACK':
            return Object.assign({}, state, {
                track: action.track,
                playing: action.playing
            });
        case 'PAUSE_TRACK':
            return Object.assign({}, state, {
                playing: action.playing
            });
        case 'RESUME_TRACK':
            return Object.assign({}, state, {
                playing: action.playing
            });
        case 'UPDATE_POSITION':
            return Object.assign({}, state, {
                position: action.position
            });
        case 'LOADING_TRACK':
            return Object.assign({}, state, {
                loadingId: action.loadingId
            });
        case 'SEEK_TRACK':
            return Object.assign({}, state, {
                position: action.position
            });
        default:
            return state;
    }
};
