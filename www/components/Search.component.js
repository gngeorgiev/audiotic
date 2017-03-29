import React from 'react';
import { ListView } from 'react-native';
import { YouTube } from 'audiotic';

class SearchComponent extends React.Component {
    constructor() {
        super();

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            ds,
            dataSource: ds.cloneWithRows([]),
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.active) {
            return;
        }

        this.search(nextProps.searchString);
    }

    async search(str) {
        const videos = await YouTube.search('ariana grande');
        this.setState({
            dataSource: this.state.ds.cloneWithRows(videos)
        });
    }

    render() {
        return (
            
        )
    }
}

export default SearchComponent;