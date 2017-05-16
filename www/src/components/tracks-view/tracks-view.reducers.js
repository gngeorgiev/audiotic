export const offlineData = (state = [], action) => {
    if (
        (action.type === 'SEARCH_TRACKS' ||
            action.type === 'TRACKS_DATA_CHANGED') &&
        action.source === 'offline'
    ) {
        return action.data;
    }

    return state;
};

export const historyData = (state = [], action) => {
    if (
        (action.type === 'SEARCH_TRACKS' ||
            action.type === 'TRACKS_DATA_CHANGED') &&
        action.source === 'history'
    ) {
        return action.data;
    }

    return state;
};

export const onlineData = (state = [], action) => {
    if (
        (action.type === 'SEARCH_TRACKS' ||
            action.type === 'TRACKS_DATA_CHANGED') &&
        action.source !== 'history' &&
        action.source !== 'offline'
    ) {
        return action.data;
    }

    return state;
};

export const favoriteData = (state = [], action) => {
    if (
        (action.type === 'SEARCH_TRACKS' ||
            action.type === 'TRACKS_DATA_CHANGED') &&
        action.source === 'favorite'
    ) {
        return action.data;
    }

    return state;
};
