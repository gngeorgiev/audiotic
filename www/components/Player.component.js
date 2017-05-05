import React from 'react';
import { View, Image, Text, TouchableNativeFeedback, Keyboard } from 'react-native';
import { Slider, Button, Icon } from 'react-native-elements';
import ActionButton from 'react-native-circular-action-menu';
import { YouTube } from 'audiotic-core';

import { AudioPlayer } from '../modules/AudioPlayer';

export class PlayerComponent extends React.Component {
    state = {
        track: {
            default: true,
            thumbnail: require('../res/music-player.png'),
            title: 'Nothing playing',
            length: 0
        },
        position: 0,
        hide: false
    }

    _getReadableTimeFromSeconds(seconds) {
        seconds = Math.round(seconds);
        let minutesReadable = Math.round(seconds / 60);
        let secondsReadable = Math.round(seconds % 60);

        if (minutesReadable.toString().length === 1) {
            minutesReadable = `0${minutesReadable}`;
        }

        if (secondsReadable.toString().length === 1) {
            secondsReadable = `0${secondsReadable}`;
        }

        return `${minutesReadable}:${secondsReadable}`;
    }

    onTrackPlayed(track) {
        this.setState({track})
    }

    async pauseResumeTrack() {
        if (AudioPlayer.playing) {
            await AudioPlayer.pause();
        } else {
            await AudioPlayer.resume();
        }
    }

    async seek(position) {
        await AudioPlayer.seek(position * 1000);
        this.setState({position});
    }

    async playNextTrack() {
        const { current } = AudioPlayer;
        if (!current.related.length) {
            return;
        }

        const nextTrackUnresolved = current.related.find(t => !!t.id);
        if (!nextTrackUnresolved) {
            return;
        }

        const nextTrack = await YouTube.resolve(nextTrackUnresolved.id);
        await AudioPlayer.play(nextTrack);
    }

    componentWillMount() {
        this._updateTrackInterval = setInterval(async () => {
            const position = await AudioPlayer.currentPosition() / 1000;
            if (position >= 0) {
                this.setState({position});
            }
        }, 500);

        this._trackPlayedListener = AudioPlayer.addListener('play', track => this.onTrackPlayed(track));
        this._keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({hide: true}));
        this._keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.setState({hide: false}));
        this._trackEndListener = AudioPlayer.addListener('end', () => this.playNextTrack());
    }

    componentWillUnmount() {
        clearInterval(this._updateTrackInterval);

        this._trackPlayedListener.remove();
        this._keyboardDidHideListener.remove();
        this._keyboardDidShowListener.remove();
        this._trackEndListener.remove();
    }

    render() {
        let { track, position, hide } = this.state;

        return (
            hide ? <View></View> :
            <Image source={track.default ? track.thumbnail : {uri: track.thumbnail}} style={styles.thumbnail}>
                <View style={styles.thumbnailContainer}>
                </View>
                <View style={styles.progressContainer}>
                    <Slider
                        thumbTouchSize={{width: 100, height: 100}}
                        trackStyle={styles.progress}
                        value={position}
                        minimumValue={0}
                        maximumValue={+track.length}
                        step={1}
                        minimumTrackTintColor='#00BAC1'
                        thumbStyle={{width: 5, height: 5, borderRadius: 0}}
                        onSlidingComplete={position => this.seek(position)}
                    />
                </View>
                <View style={styles.playContainer}>
                    <View style={styles.playTextContainer}>
                        <View style={styles.currentTrackContainer}>
                            <Text style={styles.currentTrack}>{track.title}</Text>
                        </View>
                        <View style={styles.currentPlaylistContainer}>
                            {/*TODO: Current playlist context*/}
                            <Text style={styles.currentPlaylist}>
                                {this._getReadableTimeFromSeconds(track.length)} / 
                                <Text style={{color: '#00BAC1'}}> {this._getReadableTimeFromSeconds(position)}</Text>
                            </Text>
                        </View>
                    </View>
                    <View style={styles.playButton}>
                        <ActionButton 
                            icon={
                                AudioPlayer.playing ?
                                <Icon name='pause' color='#fff' /> :
                                <Icon name='play-arrow' color='#fff' />
                            }
                            onPress={() => this.pauseResumeTrack()}
                            buttonColor='#00BAC1'
                        />
                    </View>
                </View>
            </Image>
        )
    }
}

const styles = {
    thumbnail: {
        flex: 1,
        resizeMode: Image.resizeMode.cover
    },
    thumbnailContainer: {
        flex: 1,
    },
    progressContainer: {
        marginBottom: -18
    },
    progress: {
        margin: 0,
        padding: 0,
        backgroundColor: '#4ff9f4'
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
        padding: 10,
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
}