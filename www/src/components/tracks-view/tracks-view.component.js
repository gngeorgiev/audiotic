import React, { PropTypes } from 'react';
import { ScrollView, View } from 'react-native';
import { TrackListItem } from '../../dumb-components/track-list-item.component';
import { List, SearchBar } from 'react-native-elements';

export class TracksViewComponent extends React.Component {
    static propTypes = {
        onTrackSelected: PropTypes.func,
        searching: PropTypes.bool
    };

    static defaultProps = {
        onTrackSelected: () => {},
        searching: false
    };

    render() {
        const {
            data,
            searching,
            onTrackSelected,
            playingTrack,
            currentTrack,
            style
        } = this.props;

        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <List
                        containerStyle={{
                            borderTopWidth: 0,
                            borderBottomWidth: 0
                        }}
                    >
                        {data.map(track => (
                            <TrackListItem
                                key={track.id}
                                track={track}
                                onSelected={track => onTrackSelected(track)}
                                playingTrack={playingTrack}
                                currentTrack={currentTrack}
                            />
                        ))}
                    </List>
                </ScrollView>
            </View>
        );
    }
}
