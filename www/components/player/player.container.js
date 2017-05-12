import React from 'react';
import { connect } from 'react-redux';
import { updatePosition, playPause, seek } from './player.actions';

import PlayerComponent from './player.component';

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
        const { player, onPlayPauseTap, onSeek } = this.props;
        const { track, position, playing } = player;

        return (
            <PlayerComponent
                track={track}
                position={position}
                playing={playing}
                onPlayPauseTap={() => onPlayPauseTap()}
                onSeek={position => onSeek(position)}
            />
        );
    }
}

const mapState = state => ({
    player: state.player
});

const mapDispatch = dispatch => ({
    onPlayPauseTap: track => dispatch(playPause(track)),
    onSeek: position => dispatch(seek(position)),
    updatePosition: () => dispatch(updatePosition())
});

export default connect(mapState, mapDispatch)(PlayerContainer);
