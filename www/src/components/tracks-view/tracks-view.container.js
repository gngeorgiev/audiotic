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
    render() {
        const { playPause, player, source, style, data } = this.props;

        return (
            <TracksViewComponent
                style={style}
                source={source}
                data={data}
                searching={false}
                playingTrack={player.playing}
                currentTrack={player.track}
                onTrackSelected={track => playPause(track)}
            />
        );
    }
}

const mapState = (state, ownProps) => ({
    source: ownProps.source,
    style: ownProps.style,
    data: ownProps.data,
    player: state.player
});

const mapDispatch = dispatch => ({
    playPause: track => dispatch(playPause(track))
});

export default connect(mapState, mapDispatch)(TracksViewContainer);
