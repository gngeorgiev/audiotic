import React, { PropTypes } from 'react';
import { Slider } from 'react-native-elements';

import { AudioPlayer } from '../modules/AudioPlayer';

export class TrackSlider extends React.Component {
    static propTypes = {
        style: PropTypes.object
    };

    state = {
        position: 0,
        length: 0
    };

    componentWillMount() {
        this._positionListener = AudioPlayer.addListener('position', position =>
            this.setState({
                position,
                length: +AudioPlayer.current.length
            })
        );
    }

    componentWillUnmount() {
        this._positionListener.remove();
    }

    render() {
        const { onSeek, style } = this.props;
        const { position, length } = this.state;

        return (
            <Slider
                thumbTouchSize={{ width: 130, height: 150 }}
                trackStyle={{ ...style, ...styles.progress }}
                value={position}
                minimumValue={0}
                maximumValue={length}
                step={1}
                minimumTrackTintColor="#00BAC1"
                thumbStyle={{ width: 5, height: 5, borderRadius: 0 }}
                onSlidingComplete={position => {
                    AudioPlayer.seek(position);
                }}
            />
        );
    }
}

const styles = {
    progress: {
        margin: 0,
        padding: 0,
        backgroundColor: '#4ff9f4'
    }
};
