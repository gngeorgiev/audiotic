import { resolvers } from 'audiotic-core';

import {
    offlineTracksResolver,
    favoriteTracksResolver,
    historyTracksResolver
} from '../offline-tracks/offline-tracks-resolver.module';

//TODO: custom resolvers in audiotic-core and all this logic or a big part of it
//should be in core
class TrackResolverModule {
    _resolvers;

    constructor() {
        this._resolvers = Object.assign({}, resolvers);
    }

    async resolve({ id, source }, checkOffline = true) {
        if (checkOffline) {
            const offlineTrack = await offlineTracksResolver.resolve(id);
            if (offlineTrack) {
                return offlineTrack;
            }
        }

        return await this._resolvers[source].resolve(id);
    }

    async isOffline({ id, source }) {
        if (source === 'offline') {
            return true;
        }

        return !!await offlineTracksResolver.resolve(id);
    }

    async isFavorite({ id, source }) {
        if (source === 'favorite') {
            return true;
        }

        return !!await favoriteTracksResolver.resolve(id);
    }

    async search(str, source) {
        let resolversToUse = [];

        if (source === 'offline') {
            resolversToUse = [offlineTracksResolver];
        } else if (source === 'favorite') {
            resolversToUse = [favoriteTracksResolver];
        } else if (source === 'history') {
            resolversToUse = [historyTracksResolver];
        } else {
            resolversToUse = Object.keys(this._resolvers).map(
                r => this._resolvers[r]
            );
        }

        const searchResults = await Promise.all(
            resolversToUse.map(r => r.search(str))
        );

        const data = searchResults.reduce((acc, val) => acc.concat(val));
        return data;
    }
}

export default new TrackResolverModule();
