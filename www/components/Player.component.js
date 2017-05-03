import React from 'react';
import { View, Image, Text, TouchableNativeFeedback } from 'react-native';
import { Slider, Button } from 'react-native-elements';

import { AudioPlayer } from '../modules/AudioPlayer';

export class PlayerComponent extends React.Component {
    render() {
        let currentTrack = AudioPlayer.current;
        let thumbnail;
        if (!currentTrack) {
            currentTrack = {
                thumbnail: require('../res/music-player.png'),
                title: 'Nothing playing'
            }
            thumbnail = currentTrack.thumbnail;
        } else {
            thumbnail = {uri: currentTrack.thumbnail}
        }

        return (
            <View style={{flex: 1}}>
                <View style={styles.thumbnailContainer}>
                    <Image source={thumbnail} style={styles.thumbnail} />
                </View>
                <View style={styles.progressContainer}>
                    <Slider
                        trackStyle={styles.progress}
                        value={50}
                        minimumValue={0}
                        maximumValue={150}
                        step={1}
                        thumbStyle={{width:10, height: 10}}
                    />
                </View>
                <View style={styles.playContainer}>
                    <Button
                        raised
                        icon={{name: 'play-arrow'}}
                        onPress={() => {}}
                        color='#fff'
                        backgroundColor='#00BAC1'
                        borderRadius={50}
                        buttonStyle={styles.playButton}
                    />
                    <View style={styles.currentTrackContainer}>
                        <Text style={styles.currentTrack}>{currentTrack.title}</Text>
                    </View>
                    <View style={styles.currentPlaylistContainer}>
                        <Text style={styles.currentPlaylist}>TODO</Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = {
    thumbnail: {
        flex: 1,
        resizeMode: Image.resizeMode.center
    },
    thumbnailContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    progressContainer: {
        margin: -15,
        padding: -15
    },
    progress: {
        margin: 0,
        padding: 0
    },
    playContainer: {

    },
    currentTrackContainer: {
        padding: 10,
    },
    currentTrack: {
        fontSize: 20,
        fontWeight: '600'
    },
    currentPlaylistContainer: {
        padding: 10
    },
    currentPlaylist: {
        fontSize: 20,
        fontWeight: '600'
    },
    playButton: {
        width: 50,
        height: 50,
        position: 'absolute',
        right: 20,
        top: 5,
        paddingLeft: 15,
        paddingRight: 5,
        borderRadius: 50
    }
}