import React, { PropTypes } from 'react';
import { ListItem } from 'react-native-elements';

export class TrackListItem extends React.Component {
    static propTypes = {
        track: PropTypes.object,
        onSelected: PropTypes.func
    };

    state = {
        selected: false
    };

    render() {
        const {
            track,
            onSelected,
            loadingTrack,
            currentTrack,
            playingTrack
        } = this.props;

        const { selected } = this.state;
        const thisIsPlaying = currentTrack && currentTrack.id === track.id;

        let iconName;
        if (selected && !thisIsPlaying) {
            iconName = 'cached';
        } else {
            iconName = thisIsPlaying && playingTrack ? 'pause' : 'play-arrow';

            if (selected) {
                setTimeout(() => this.setState({ selected: false }));
            }
        }

        return (
            <ListItem
                rightIcon={{ name: iconName }}
                avatar={{ uri: track.thumbnail }}
                title={track.title}
                onPress={() => {
                    onSelected(track);
                    if (!thisIsPlaying) {
                        this.setState({ selected: true });
                    }
                }}
            />
        );
    }
}
