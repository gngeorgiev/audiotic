import React from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import {
    updatePosition,
    playPause,
    seek,
    playNext,
    playPrev
} from './player.actions';
import audioPlayer from '../../modules/audio-player/audio-player.module';
import PlayerComponent from './player.component';
import FullScreenPlayerComponent from './player-full-screen.component';

class PlayerContainer extends React.Component {
    componentDidMount() {
        this._trackEndListener = audioPlayer.addListener('end', () =>
            this.props.playNext()
        );

        this._positionListener = audioPlayer.addListener('position', () =>
            this.props.updatePosition()
        );
    }

    componentWillUnmount() {
        this._trackEndListener.remove();
        this._positionListener.remove();
    }

    render() {
        const {
            player,
            onPlayPauseTap,
            onSeek,
            fullScreen,
            playNext,
            playPrev
        } = this.props;
        const { track, position, playing } = player;

        return fullScreen
            ? <FullScreenPlayerComponent
                  track={track}
                  position={position}
                  playing={playing}
                  isTrackOffline={player.isOffline}
                  onPlayPauseTap={() => onPlayPauseTap()}
                  onSeek={position => onSeek(position)}
                  onBack={() => Actions.pop()}
                  onForwardTap={() => playNext()}
                  onBackwardTap={() => playPrev()}
              />
            : <PlayerComponent
                  track={track}
                  position={position}
                  playing={playing}
                  onPlayPauseTap={() => onPlayPauseTap()}
                  onSeek={position => onSeek(position)}
                  onPress={() => Actions.fullScreenPlayer()}
              />;
    }
}

const mapState = (state, props) => ({
    player: state.player,
    fullScreen: props.fullScreen
});

const mapDispatch = dispatch => ({
    onPlayPauseTap: track => dispatch(playPause(track)),
    onSeek: position => dispatch(seek(position)),
    updatePosition: () => dispatch(updatePosition()),
    playNext: () => dispatch(playNext()),
    playPrev: () => dispatch(playPrev())
});

export default connect(mapState, mapDispatch)(PlayerContainer);
