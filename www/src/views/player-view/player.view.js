import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';
import { Tabs, Tab, Icon } from 'react-native-elements';

import Player from '../../components/player/player.container';
import TracksViewContainer
    from '../../components/tracks-view/tracks-view.container';

const states = {
    search: 'search',
    history: 'history',
    saved: 'save',
    favorite: 'favorite'
};

class PlayerView extends React.Component {
    state = {
        screen: states.search
    };

    render() {
        const {
            offlineData,
            historyData,
            favoriteData,
            onlineData,

            source
        } = this.props;

        let data;

        switch (source) {
            case 'offline':
                data = offlineData;
                break;
            case 'history':
                data = historyData;
                break;
            case 'favorite':
                data = favoriteData;
                break;
            default:
                data = onlineData;
        }

        data = data || [];

        return (
            <View style={styles.container}>
                <TracksViewContainer
                    active={true}
                    hidden={false}
                    data={data}
                    source={'online'}
                />

                <Player />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff'
    },
    bottomNavigation: {
        flex: 1
    },
    bottomNavigationAction: {
        flex: 0.33
    }
});

const mapState = (state, props) => ({
    ...props,

    offlineData: state.offlineData,
    historyData: state.historyData,
    favoriteData: state.favoriteData,
    onlineData: state.onlineData
});

export default connect(mapState)(PlayerView);
