import { playPause as playerPlayPauseAction } from '../player/player.actions';
import { resolvers } from 'audiotic-core';
import {
    OfflineTracksResolver
} from '../../modules/offline-tracks/offline-tracks-resolver.module';

export const playPause = playerPlayPauseAction;

export const toggleSearching = (searching, source) => {
    return {
        type: 'IS_SEARCHING_TRACKS',
        [`${source}Searching`]: searching //offlineSearching, onlineSearching, historySearching
    };
};

const allResolvers = Object.assign({}, resolvers);
const offlineResolver = new OfflineTracksResolver();

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
        await dispatch(toggleSearching(true, source));

        let resolversToUse = [];

        if (source === 'offline') {
            resolversToUse = [offlineResolver];
        } else {
            resolversToUse = Object.keys(allResolvers).map(
                r => allResolvers[r]
            );
        }

        const searchResults = await Promise.all(
            resolversToUse.map(r => r.search(str))
        );

        const data = searchResults.reduce((acc, val) => acc.concat(val));

        await dispatch(toggleSearching(false, source));

        return dispatch({
            type: 'SEARCH_TRACKS',
            source,
            data
        });
    };
};
