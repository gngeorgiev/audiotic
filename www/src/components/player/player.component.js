import React, { PropTypes } from 'react';
import { View, Image, Text, TouchableHighlight, Keyboard } from 'react-native';
import { Button, Icon } from 'react-native-elements';

import { secondsToTime } from '../../utils/audio-player-utils';
import { TrackSlider } from '../../dumb-components/track-slider.component';
import {
    PlayPauseButton
} from '../../dumb-components/play-pause-button.component';

export default class PlayerComponent extends React.Component {
    static propTypes = {
        onPress: PropTypes.func,
        track: PropTypes.object,
        position: PropTypes.number,
        playing: PropTypes.bool,
        onPlayPauseTap: PropTypes.func,
        onSeek: PropTypes.func
    };

    static defaultProps = {
        onPress: () => {},
        onPlayPauseTap: () => {},
        onSeek: () => {}
    };

    state = { hide: false };

    componentWillMount() {
        this._keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => this.setState({ hide: true })
        );
        this._keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => this.setState({ hide: false })
        );
    }

    componentWillUnmount() {
        this._keyboardDidHideListener.remove();
        this._keyboardDidShowListener.remove();
    }

    render() {
        const { hide } = this.state;
        const { position, playing, track, onPlayPauseTap, onSeek } = this.props;

        return hide
            ? <View />
            : <TouchableHighlight
                  style={{ flex: 0.5 }}
                  onPress={() => this.props.onPress()}
              >
                  <Image
                      source={
                          track.default
                              ? track.thumbnail
                              : { uri: track.thumbnail }
                      }
                      style={styles.thumbnail}
                  >
                      <View style={styles.progressContainer}>
                          <TrackSlider
                              position={position}
                              length={track.length}
                              onSeek={position => onSeek(position)}
                          />
                      </View>
                      <View style={styles.playContainer}>
                          <View style={styles.playTextContainer}>
                              <View style={styles.currentTrackContainer}>
                                  <Text
                                      numberOfLines={2}
                                      style={styles.currentTrack}
                                  >
                                      {track.title}
                                  </Text>
                              </View>
                              <View style={styles.currentPlaylistContainer}>
                                  <Text style={styles.currentPlaylist}>
                                      <Text style={{ color: '#00BAC1' }}>
                                          {secondsToTime(position)}
                                      </Text>
                                      {' / '}
                                      <Text style={{ color: '#eee' }}>
                                          {secondsToTime(track.length)}
                                      </Text>
                                  </Text>
                              </View>
                          </View>
                          <View style={styles.playButton}>
                              <PlayPauseButton
                                  playing={playing}
                                  onPress={() => onPlayPauseTap()}
                              />
                          </View>
                      </View>
                  </Image>
              </TouchableHighlight>;
    }
}

const styles = {
    thumbnail: {
        flex: 1,
        resizeMode: Image.resizeMode.cover
    },
    thumbnailContainer: {
        flex: 1
    },
    progressContainer: {
        marginBottom: -18
    },
    playContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    playTextContainer: {
        flex: 0.8,
        flexDirection: 'column'
    },
    currentTrackContainer: {
        flex: 0.5,
        padding: 10
    },
    currentTrack: {
        fontSize: 18,
        fontWeight: '600',
        color: '#eee'
    },
    currentPlaylistContainer: {
        flex: 0.5,
        padding: 10
    },
    currentPlaylist: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fafafa'
    },
    playButton: {
        width: 130,
        height: 90
    }
};
