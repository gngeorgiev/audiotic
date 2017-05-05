import React, { PropTypes } from 'react';

import { AudioPlayer } from '../modules/AudioPlayer';
import ActionButton from 'react-native-circular-action-menu';
import { Icon } from 'react-native-elements';

export class PlayPauseButton extends React.Component {
    static propTypes = {
        style: PropTypes.object,
        size: PropTypes.number
    }

    render() {
        const {
            size = 60
        } = this.props;

        return (
            <ActionButton
                size={size}
                icon={
                    AudioPlayer.playing ?
                    <Icon name='pause' color='#fff' /> :
                    <Icon name='play-arrow' color='#fff' />
                }
                onPress={() => AudioPlayer.pauseResumeTrack()}
                buttonColor='#00BAC1'
            />
        )
    }
}