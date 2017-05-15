import React, { PropTypes } from 'react';
import { View, Button, Dimensions, Text, Image } from 'react-native';
import { Icon, Avatar } from 'react-native-elements';
import ActionButton from 'react-native-circular-action-menu';

import { secondsToTime } from '../../utils/audio-player-utils';
import { TrackSlider } from '../../dumb-components/track-slider.component';
import {
    PlayPauseButton
} from '../../dumb-components/play-pause-button.component';

const { width, height } = Dimensions.get('window');

export default class FullScreenPlayerComponent extends React.Component {
    static propTypes = {
        track: PropTypes.object,
        position: PropTypes.number,
        playing: PropTypes.bool,
        onPlayPauseTap: PropTypes.func,
        onSeek: PropTypes.func,
        onBack: PropTypes.func,
        isTrackOffline: PropTypes.bool,
        onForwardTap: PropTypes.func,
        onBackwardTap: PropTypes.func,
        onDownloadTap: PropTypes.func
    };

    static defaultProps = {
        onPlayPauseTap: () => {},
        onSeek: () => {},
        onBack: () => {}
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

    render() {
        const {
            position,
            playing,
            track,
            onPlayPauseTap,
            onSeek,
            isTrackOffline,
            onBack,
            onForwardTap,
            onBackwardTap,
            onDownloadTap
        } = this.props;

        return (
            <View style={styles.fullScreenPlayer}>
                <View style={styles.playerContainer}>
                    <View style={styles.playerToolbarContainer}>
                        {this._renderButton(styles.button, 'arrow-back', () =>
                            onBack()
                        )}
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{track.title}</Text>
                    </View>
                    <View style={styles.previewContainer}>
                        <Image
                            style={styles.previewAvatar}
                            width={width * 0.75}
                            height={height * 0.45}
                            source={
                                track.default
                                    ? track.thumbnail
                                    : { uri: track.thumbnail }
                            }
                        />

                        <View style={styles.timeContainer}>
                            <Text style={{ color: '#00BAC1' }}>
                                {secondsToTime(position)}
                            </Text>
                            <Text style={{ color: '#fff' }}>
                                {secondsToTime(track.length)}
                            </Text>
                        </View>
                        <View style={styles.sliderContainer}>
                            <TrackSlider
                                position={position}
                                length={track.length}
                                style={{ width: width * 0.95 }}
                                onSeek={position => onSeek(position)}
                            />
                        </View>
                        <View style={styles.extraButtonsContainer}>
                            {this._renderButton(styles.button, 'favorite')}
                            {this._renderButton(
                                styles.button,
                                'cloud-download',
                                () => onDownloadTap(track),
                                isTrackOffline ? '#f4424b' : '#fff'
                            )}
                        </View>
                    </View>
                    <View style={styles.controlContainer}>
                        <View style={{ flex: 1 }}>
                            {this._renderControlButton('fast-rewind', () =>
                                onBackwardTap()
                            )}
                        </View>
                        <View style={{ flex: 1 }}>
                            <PlayPauseButton
                                playing={playing}
                                style={styles.controlButton}
                                onPress={() => onPlayPauseTap()}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            {this._renderControlButton('fast-forward', () =>
                                onForwardTap()
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
