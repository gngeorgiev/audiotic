import { resolvers } from 'audiotic-core';

import {
    OfflineTracksResolver
} from '../offline-tracks/offline-tracks-resolver.module';

class TrackResolverModule {
    _resolvers;
    _offlineResolver;

    constructor() {
        this._resolvers = Object.assign({}, resolvers);

        this._offlineResolver = new OfflineTracksResolver();
    }

    async resolve({ id, source }) {
        const offlineTrack = await this._offlineResolver.resolve(id);
        if (offlineTrack) {
            return offlineTrack;
        }

        return await this._resolvers[source].resolve(id);
    }

    async isOffline({ id, source }) {
        if (source === 'offline') {
            return true;
        }

        return !!await this._offlineResolver.resolve(id);
    }
}

export default new TrackResolverModule();
