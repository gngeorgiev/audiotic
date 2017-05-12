import React from 'react';
import { connect } from 'react-redux';
import { TracksViewComponent } from './tracks-view.component';
import { search, playPause } from './tracks-view.actions';

class TracksViewContainer extends React.Component {
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
            case 'history':
                data = historyData;
                searching = historySearching;
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
    playPause: track => dispatch(playPause(track))
});

export default connect(mapState, mapDispatch)(TracksViewContainer);
