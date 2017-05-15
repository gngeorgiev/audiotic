import React from 'react';
import { connect } from 'react-redux';
import { TracksViewComponent } from './tracks-view.component';
import { search, playPause, updateData } from './tracks-view.actions';
import offlineTracksManager
    from '../../modules/offline-tracks/offline-tracks-manager.module';

class TracksViewContainer extends React.Component {
    async componentDidMount() {
        const { source, updateData } = this.props;

        if (source === 'offline') {
            const updateOfflineData = async () => {
                const offlineData = await offlineTracksManager.data();
                updateData(offlineData, source);
            };

            this._onDataListener = offlineTracksManager.addListener(
                'downloaded',
                () => updateOfflineData()
            );
            updateOfflineData();
        }
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
            offlineSearching,
            historySearching,
            onlineSearching,
            search,
            playPause,
            player
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
            default:
                data = onlineData;
                searching = onlineSearching;
        }

        return (
            <TracksViewComponent
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
    player: state.player,

    offlineData: state.offlineData,
    onlineData: state.onlineData,
    historyData: state.historyData,

    offlineSearching: state.offlineSearching,
    onlineSearching: state.onlineSearching,
    historySearching: state.historySearching
});

const mapDispatch = dispatch => ({
    search: (str, source) => dispatch(search(str, source)),
    playPause: track => dispatch(playPause(track)),
    updateData: (data, source) => dispatch(updateData(data, source))
});

export default connect(mapState, mapDispatch)(TracksViewContainer);
