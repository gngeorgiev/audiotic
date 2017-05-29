import React from 'react';
import { connect } from 'react-redux';
import { TracksViewComponent } from './tracks-view.component';
import { search, playPause, updateData } from './tracks-view.actions';
import {
    offlineTracksManager,
    historyTracksManager,
    favoriteTracksManager
} from '../../modules/offline-tracks/offline-tracks-manager.module';

class TracksViewContainer extends React.Component {
    async componentDidMount() {
        const { source, updateData } = this.props;

        let manager;
        const updateOfflineData = async manager => {
            const offlineData = await manager.data();
            updateData(offlineData, source);
        };
        if (source === 'offline') {
            manager = offlineTracksManager;
        } else if (source === 'history') {
            manager = historyTracksManager;
        } else if (source === 'favorite') {
            manager = favoriteTracksManager;
        }

        if (!manager) {
            return;
        }

        this._onDataListener = manager.addListener('change', () =>
            updateOfflineData(manager)
        );
        updateOfflineData(manager);
    }

    componentWillUnmount() {
        if (this._onDataListener) {
            this._onDataListener.remove();
        }
    }

    render() {
        const {
            source,
            offlineData,
            historyData,
            onlineData,
            favoriteData,

            offlineSearching,
            historySearching,
            onlineSearching,
            favoriteSearching,

            search,
            playPause,
            player,

            style
        } = this.props;

        let data;
        let searching;

        switch (source) {
            case 'offline':
                data = offlineData;
                searching = offlineSearching;
                break;
            case 'history':
                data = historyData;
                searching = historySearching;
                break;
            case 'favorite':
                data = favoriteData;
                searching = favoriteSearching;
                break;
            default:
                data = onlineData;
                searching = onlineSearching;
        }

        return (
            <TracksViewComponent
                style={style}
                source={source}
                data={data}
                searching={searching}
                playingTrack={player.playing}
                currentTrack={player.track}
                onSearch={str => search(str, source)}
                onTrackSelected={track => playPause(track)}
            />
        );
    }
}

const mapState = (state, ownProps) => ({
    source: ownProps.source,
    style: ownProps.style,
    player: state.player,

    offlineData: state.offlineData,
    onlineData: state.onlineData,
    historyData: state.historyData,
    favoriteData: state.favoriteData,

    offlineSearching: state.offlineSearching,
    onlineSearching: state.onlineSearching,
    historySearching: state.historySearching,
    favoriteSearching: state.favoriteSearching
});

const mapDispatch = dispatch => ({
    search: (str, source) => dispatch(search(str, source)),
    playPause: track => dispatch(playPause(track)),
    updateData: (data, source) => dispatch(updateData(data, source))
});

export default connect(mapState, mapDispatch)(TracksViewContainer);
