import React from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import {
    updatePosition,
    playPause,
    seek,
    playNext,
    playPrev,
    download,
    favorite
} from './player.actions';
import audioPlayer from '../../modules/audio-player/audio-player.module';
import PlayerComponent from './player.component';
import FullScreenPlayerComponent from './player-full-screen.component';

class PlayerContainer extends React.Component {
    //the position is in the state, not managed by redux due to it's constant updates, which cause performance hit
    state = { position: 0 };

    componentDidMount() {
        this._trackEndListener = audioPlayer.addListener('end', () =>
            this.props.playNext()
        );

        this._positionListener = audioPlayer.addListener('position', position =>
            this.setState({ position })
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
            playPrev,
            download,
            favorite
        } = this.props;
        const { track, playing } = player;
        const { position } = this.state;

        return fullScreen
            ? <FullScreenPlayerComponent
                  track={track}
                  position={position}
                  playing={playing}
                  isTrackOffline={player.isOffline}
                  isTrackFavorite={player.isFavorite}
                  onPlayPauseTap={() => onPlayPauseTap()}
                  onSeek={position => onSeek(position)}
                  onBack={() => Actions.pop()}
                  onForwardTap={() => playNext()}
                  onBackwardTap={() => playPrev()}
                  onDownloadTap={track => download(track)}
                  onFavoriteTap={track => favorite(track)}
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
    playPrev: () => dispatch(playPrev()),
    download: track => dispatch(download(track)),
    favorite: track => dispatch(favorite(track))
});

export default connect(mapState, mapDispatch)(PlayerContainer);
