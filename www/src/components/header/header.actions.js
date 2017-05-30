import trackResolver from '../../modules/track-resolver/track-resolver.module';

export const toggleSearching = (searching, source) => {
    return {
        type: 'IS_SEARCHING_TRACKS',
        //offlineSearching, onlineSearching, historySearching
        [`${source}Searching`]: searching
    };
};

export const updateData = (data, source) => {
    return {
        type: 'TRACKS_DATA_CHANGED',
        source,
        data
    };
};

export const search = (str, source) => {
    if (!source) {
        throw new Error(`Invalid resolver ${source}`);
    }

    return async dispatch => {
        if (!str) {
            return dispatch({
                type: 'SEARCH_TRACKS',
                source,
                data: []
            });
        }

        dispatch(toggleSearching(true, source));
        const data = await trackResolver.search(str, source);
        dispatch(toggleSearching(false, source));

        return dispatch({
            type: 'SEARCH_TRACKS',
            source,
            data
        });
    };
};
