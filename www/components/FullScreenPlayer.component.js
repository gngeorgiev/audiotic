import React, { PropTypes } from 'react';
import { View, Button, Dimensions, Text, Image } from 'react-native';
import { Icon, Avatar } from 'react-native-elements';
import ActionButton from 'react-native-circular-action-menu';

import { PlayerComponent } from './Player.component';
import { AudioPlayer } from '../modules/AudioPlayer';

import { TrackSlider } from '../elements/TrackSlider.element';
import { PlayPauseButton } from '../elements/PlayPauseButton.element';

const { width, height } = Dimensions.get('window');

export class FullScreenPlayerComponent extends PlayerComponent {
    static propTypes = {
        onBackPress: PropTypes.func.isRequired
    };

    state = {
        position: 0,
        trackDownloaded: false
    };

    _renderButton(style, icon, onPress, color = '#fff') {
        return (
            <Icon
                style={style}
                raised
                size={35}
                color={color}
                name={icon}
                onPress={onPress}
                underlayColor="rgba(0,0,0,0)"
            />
        );
    }

    _renderControlButton(iconName, action) {
        return (
            <ActionButton
                size={60}
                icon={<Icon name={iconName} color="#6B6B6B" />}
                onPress={() => action()}
                buttonColor="#272929"
            />
        );
    }

    async _checkIfTrackIsDownloaded(track) {
        const trackDownloaded = await AudioPlayer.isOffline(track);

        this.setState({ trackDownloaded });
    }

    componentDidMount() {
        this._positionListener = AudioPlayer.addListener('position', position =>
            this.setState({ position })
        );

        this._playListener = AudioPlayer.addListener('play', track =>
            this._checkIfTrackIsDownloaded(track)
        );

        if (AudioPlayer.playing) {
            this._checkIfTrackIsDownloaded(AudioPlayer.current);
        }
    }

    componentWillUnmount() {
        this._positionListener.remove();
        this._playListener.remove();
    }

    render() {
        const { current } = AudioPlayer;
        const { position, trackDownloaded } = this.state;

        return (
            <View style={styles.fullScreenPlayer}>
                <View style={styles.playerContainer}>
                    <View style={styles.playerToolbarContainer}>
                        {this._renderButton(styles.button, 'arrow-back', () =>
                            this.props.onBackPress()
                        )}
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{current.title}</Text>
                    </View>
                    <View style={styles.previewContainer}>
                        <Image
                            style={styles.previewAvatar}
                            width={width * 0.75}
                            height={height * 0.45}
                            source={
                                current.default
                                    ? current.thumbnail
                                    : { uri: current.thumbnail }
                            }
                        />

                        <View style={styles.timeContainer}>
                            <Text style={{ color: '#fff' }}>
                                {AudioPlayer.secondsToTime(current.length)}
                            </Text>
                            <Text style={{ color: '#00BAC1' }}>
                                {AudioPlayer.secondsToTime(position)}
                            </Text>
                        </View>
                        <View style={styles.sliderContainer}>
                            <TrackSlider
                                position={position}
                                length={current.length}
                                style={{ width: width * 0.95 }}
                                onSeek={() => {}}
                            />
                        </View>
                        <View style={styles.extraButtonsContainer}>
                            {this._renderButton(styles.button, 'favorite')}
                            {this._renderButton(
                                styles.button,
                                'cloud-download',
                                async () => {
                                    await AudioPlayer.downloadTrack(current);
                                    await this._checkIfTrackIsDownloaded(
                                        current
                                    );
                                },
                                trackDownloaded ? '#f4424b' : '#fff'
                            )}
                        </View>
                    </View>
                    <View style={styles.controlContainer}>
                        <View style={{ flex: 1 }}>
                            {this._renderControlButton('fast-rewind', () =>
                                AudioPlayer.playPreviousTrack()
                            )}
                        </View>
                        <View style={{ flex: 1 }}>
                            <PlayPauseButton style={styles.controlButton} />
                        </View>
                        <View style={{ flex: 1 }}>
                            {this._renderControlButton('fast-forward', () =>
                                AudioPlayer.playNextTrack()
                            )}
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = {
    fullScreenPlayer: {
        width: width,
        height: height,
        backgroundColor: '#000',
        flex: 1
    },
    playerContainer: {
        flex: 1
    },
    playerToolbarContainer: {
        flex: 0.5,
        alignItems: 'flex-start'
    },
    button: {
        padding: 10,
        margin: 10
    },
    titleContainer: {
        flex: 0.5
    },
    title: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 25
    },
    previewContainer: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    previewAvatar: {},
    extraButtonsContainer: {
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    controlContainer: {
        flex: 0.6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width
    },
    sliderContainer: {
        flex: 0.1,
        flexDirection: 'column',
        height: 10
    },
    timeContainer: {
        flex: 0.2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width * 0.9
    }
};
