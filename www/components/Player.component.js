import React, { PropTypes } from 'react';
import { View, Image, Text, TouchableHighlight, Keyboard } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { YouTube } from 'audiotic-core';

import { AudioPlayer } from '../modules/AudioPlayer';
import { TrackSlider } from '../elements/TrackSlider.element';
import { PlayPauseButton } from '../elements/PlayPauseButton.element';

export class PlayerComponent extends React.Component {
    static propTypes = {
        onPress: PropTypes.func.isRequired
    }

    state = {
        track: AudioPlayer.current,
        position: 0,
        hide: false
    }

    onTrackPlayed(track) {
        this.setState({track})
    }

    componentWillMount() {
        this._trackPlayedListener = AudioPlayer.addListener('play', track => this.onTrackPlayed(track));
        this._keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({hide: true}));
        this._keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.setState({hide: false}));
        this._trackEndListener = AudioPlayer.addListener('end', () => AudioPlayer.playNextTrack(YouTube.resolve.bind(YouTube)));
        this._positionListener = AudioPlayer.addListener('position', position => this.setState({position}));
    }

    componentWillUnmount() {
        this._trackPlayedListener.remove();
        this._keyboardDidHideListener.remove();
        this._keyboardDidShowListener.remove();
        this._trackEndListener.remove();
        this._positionListener.remove();
    }

    render() {
        const { track, position, hide } = this.state;

        return (
            hide ? <View></View> :
            <TouchableHighlight style={{flex: 1}} onPress={() => this.props.onPress()}>
                <Image source={track.default ? track.thumbnail : {uri: track.thumbnail}} style={styles.thumbnail}>
                    <View style={styles.thumbnailContainer}>
                    </View>
                    <View style={styles.progressContainer}>
                        <TrackSlider />
                    </View>
                    <View style={styles.playContainer}>
                        <View style={styles.playTextContainer}>
                            <View style={styles.currentTrackContainer}>
                                <Text style={styles.currentTrack}>{track.title}</Text>
                            </View>
                            <View style={styles.currentPlaylistContainer}>
                                {/*TODO: Current playlist context*/}
                                <Text style={styles.currentPlaylist}>
                                    {AudioPlayer.secondsToTime(track.length)} / 
                                    <Text style={{color: '#00BAC1'}}> {AudioPlayer.secondsToTime(position)}</Text>
                                </Text>
                            </View>
                        </View>
                        <View style={styles.playButton}>
                            <PlayPauseButton />
                        </View>
                    </View>
                </Image>
            </TouchableHighlight>
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