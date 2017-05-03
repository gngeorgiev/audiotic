import React from 'react';
import { ScrollView, View } from 'react-native';
import { YouTube } from 'audiotic-core';
import { VideoListItem } from './VideoListItem';
import { List, SearchBar } from 'react-native-elements';

export class SearchComponent extends React.Component {
    constructor() {
        super();

        this.state = {
            searching: false,
            text: '',
            dataSource: []
        };
    }

    async search(str) {
        this.setState({searching: true});

        const videos = await YouTube.search(str);
        videos.forEach(v => v.provider = 'YouTube'); //TODO:

        this.setState({
            searching: false,
            dataSource: videos
        });
    }

    render() {
        return (
            <View>
                <ScrollView>
                    <SearchBar
                        placeholder='e.g. Martin Garrix'
                        lightTheme={true}
                        showLoadingIcon={this.state.searching}
                        onChangeText={text => this.setState({text})}
                        onSubmitEditing={() => this.search(this.state.text)}
                    />
                    <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                        {
                            this.state.dataSource.map(video => (
                                <VideoListItem key={video.id} video={video} />
                            ))
                        }
                    </List>
                </ScrollView>
            </View>
            
        )
    }
}