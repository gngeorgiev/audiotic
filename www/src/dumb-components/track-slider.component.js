import React, { PropTypes } from 'react';
import { Slider } from 'react-native-elements';

export class TrackSlider extends React.Component {
    static propTypes = {
        style: PropTypes.object,
        position: PropTypes.number,
        length: PropTypes.number,
        onSeek: PropTypes.func
    };

    static defaultProps = {
        onSeek: () => {}
    };

    render() {
        const { onSeek, style, position, length } = this.props;

        return (
            <Slider
                thumbTouchSize={{ width: 130, height: 150 }}
                trackStyle={{ ...styles.progress, ...style }}
                style={style}
                value={position}
                minimumValue={0}
                maximumValue={length}
                step={1}
                minimumTrackTintColor="#00BAC1"
                thumbStyle={{ width: 5, height: 5, borderRadius: 0 }}
                onSlidingComplete={position => onSeek(position)}
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
