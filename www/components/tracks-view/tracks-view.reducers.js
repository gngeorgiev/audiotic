export const offlineData = (state = [], action) => {
    if (action.type === 'SEARCH_TRACKS' && action.source === 'offline') {
        return action.data;
    }

    return state;
};

export const historyData = (state = [], action) => {
    if (action.type === 'SEARCH_TRACKS' && action.source === 'history') {
        return action.data;
    }

    return state;
};

export const onlineData = (state = [], action) => {
    if (
        action.type === 'SEARCH_TRACKS' &&
        action.source !== 'history' &&
        action.source !== 'offline'
    ) {
        return action.data;
    }

    return state;
};
