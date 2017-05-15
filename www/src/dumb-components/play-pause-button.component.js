import React, { PropTypes } from 'react';

import ActionButton from 'react-native-circular-action-menu';
import { Icon } from 'react-native-elements';

export class PlayPauseButton extends React.Component {
    static propTypes = {
        style: PropTypes.object,
        size: PropTypes.number,
        onPress: PropTypes.func,
        playing: PropTypes.bool
    };

    static defaultProps = {
        size: 60,
        onPress: () => {}
    };

    render() {
        const { size, onPress, playing } = this.props;

        return (
            <ActionButton
                size={size}
                icon={
                    playing
                        ? <Icon name="pause" color="#fff" />
                        : <Icon name="play-arrow" color="#fff" />
                }
                onPress={() => onPress()}
                buttonColor="#00BAC1"
            />
        );
    }
}
