import React, { PropTypes } from 'react';
import { Slider } from 'react-native-elements';

export class TrackSlider extends React.Component {
    state = {
        updateValue: true
    };

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
        const { onSeek, style, length, position } = this.props;

        let newValue;
        if (this.state.updateValue) {
            newValue = position;
            this.previousPosition = position;
        } else {
            newValue = this.previousPosition;
        }

        return (
            <Slider
                thumbTouchSize={{ width: 130, height: 150 }}
                trackStyle={{ ...styles.progress, ...style }}
                style={style}
                value={newValue}
                minimumValue={0}
                maximumValue={length}
                step={1}
                minimumTrackTintColor="#00BAC1"
                thumbStyle={{ width: 5, height: 5, borderRadius: 0 }}
                onSlidingStart={() => this.setState({ updateValue: false })}
                onSlidingComplete={position => {
                    onSeek(position);
                    //TODO: in the native code we can wait for the seek to complete and then invoke the promise, this way we will just await the onSeek func, this is temporary workaround
                    setTimeout(
                        () => this.setState({ updateValue: true }),
                        1000
                    );
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
