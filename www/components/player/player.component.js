import React, { PropTypes } from 'react';
import { View, Image, Text, TouchableHighlight, Keyboard } from 'react-native';
import { Button, Icon } from 'react-native-elements';

import { AudioPlayer } from '../../modules/AudioPlayer';
import { TrackSlider } from './track-slider.element';
import { PlayPauseButton } from '../../elements/PlayPauseButton.element';

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
        const {
            player,
            position,
            playing,
            track,
            onPlayPauseTap,
            onSeek
        } = this.props;
        const { hide } = this.state;

        return hide
            ? <View />
            : <TouchableHighlight
                  style={{ flex: 1 }}
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
                      <View style={styles.thumbnailContainer} />
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
                                  <Text style={styles.currentTrack}>
                                      {track.title}
                                  </Text>
                              </View>
                              <View style={styles.currentPlaylistContainer}>
                                  {/*TODO: Current playlist context*/}
                                  <Text style={styles.currentPlaylist}>
                                      {AudioPlayer.secondsToTime(track.length)}
                                      {' '}
                                      /
                                      {' '}
                                      <Text style={{ color: '#00BAC1' }}>
                                          {' '}
                                          {AudioPlayer.secondsToTime(position)}
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
        flexDirection: 'row',
        backgroundColor: 'rgba(71, 77, 86, 0.8)'
    },
    playTextContainer: {
        flex: 0.8,
        flexDirection: 'column'
    },
    currentTrackContainer: {
        padding: 10
    },
    currentTrack: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fafafa'
    },
    currentPlaylistContainer: {
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
