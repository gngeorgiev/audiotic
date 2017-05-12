import React, { PropTypes } from 'react';
import { ScrollView, View } from 'react-native';
import { VideoListItem } from './VideoListItem';
import { List, SearchBar } from 'react-native-elements';
import { OfflineTracksManager } from '../modules/OfflineTracksManager';

export class TracksViewComponent extends React.Component {
    static propTypes = {
        onSearch: PropTypes.func,
        offlineMode: PropTypes.bool
    };

    constructor() {
        super();

        this.state = {
            searching: false,
            text: '',
            dataSource: []
        };
    }

    async componentDidMount() {
        const { offlineMode } = this.props;

        if (offlineMode) {
            if (!OfflineTracksManager._loaded) {
                OfflineTracksManager.once('loaded', () =>
                    this.setState({
                        dataSource: OfflineTracksManager.data
                    })
                );
            } else {
                this.setState({
                    dataSource: OfflineTracksManager.data
                });
            }
        }
    }

    render() {
        const { onSearch } = this.props;

        return (
            <View>
                <ScrollView>
                    <SearchBar
                        placeholder="e.g. Martin Garrix"
                        lightTheme={true}
                        showLoadingIcon={this.state.searching}
                        onChangeText={text => this.setState({ text })}
                        onSubmitEditing={async () => {
                            this.setState({ searching: true });
                            const dataSource = await onSearch(this.state.text);
                            this.setState({
                                searching: false,
                                dataSource
                            });
                        }}
                    />
                    <List
                        containerStyle={{
                            borderTopWidth: 0,
                            borderBottomWidth: 0
                        }}
                    >
                        {this.state.dataSource.map(track => (
                            <VideoListItem key={track.id} track={track} />
                        ))}
                    </List>
                </ScrollView>
            </View>
        );
    }
}
