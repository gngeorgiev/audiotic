import React from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { updatePosition, playPause, seek } from './player.actions';
import PlayerComponent from './player.component';
import FullScreenPlayerComponent from './player-full-screen.component';

class PlayerContainer extends React.Component {
    componentDidMount() {
        this._positionInterval = setInterval(
            () => this.props.updatePosition(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this._positionInterval);
    }

    render() {
        const { player, onPlayPauseTap, onSeek, fullScreen } = this.props;
        const { track, position, playing } = player;

        return fullScreen
            ? <FullScreenPlayerComponent
                  track={track}
                  position={position}
                  playing={playing}
                  onPlayPauseTap={() => onPlayPauseTap()}
                  onSeek={position => onSeek(position)}
                  onBack={() => Actions.pop()}
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
    updatePosition: () => dispatch(updatePosition())
});

export default connect(mapState, mapDispatch)(PlayerContainer);
