import React from 'react';
import { View, Image } from 'react-native';

import { AudioPlayer } from '../modules/AudioPlayer';

export class PlayerComponent extends React.Component {
    render() {
        let currentTrack = AudioPlayer.current;
        if (!currentTrack) {
            currentTrack = {
                thumbnail: ''
            }
        }

        return (
            <View>
                <Image source={{uri: currentTrack.thumbnail}} />
            </View>
        )
    }
}