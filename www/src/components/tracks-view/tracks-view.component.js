import React, { PropTypes } from 'react';
import { ScrollView, View } from 'react-native';
import { TrackListItem } from '../../dumb-components/track-list-item.component';
import { List, SearchBar } from 'react-native-elements';

export class TracksViewComponent extends React.Component {
    static propTypes = {
        onSearch: PropTypes.func,
        onTrackSelected: PropTypes.func,
        searching: PropTypes.bool
    };

    static defaultProps = {
        onSearch: () => {},
        onTrackSelected: () => {},
        searching: false
    };

    constructor() {
        super();

        this.state = { text: '' };
    }

    render() {
        const { text } = this.state;
        const {
            onSearch,
            data,
            searching,
            onTrackSelected,
            playingTrack,
            currentTrack
        } = this.props;

        return (
            <View>
                <ScrollView>
                    <SearchBar
                        placeholder="e.g. Martin Garrix"
                        lightTheme={true}
                        showLoadingIcon={searching}
                        onChangeText={text => this.setState({ text })}
                        onSubmitEditing={() => onSearch(text)}
                    />
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
