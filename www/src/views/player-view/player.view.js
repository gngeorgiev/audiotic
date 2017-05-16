import React from 'react';
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

export default class PlayerView extends React.Component {
    state = {
        screen: states.search
    };

    _renderTab(stateName, source) {
        return (
            <Tab
                key={stateName}
                selected={this.state.screen === stateName}
                renderIcon={() => <Icon name={stateName} />}
                renderSelectedIcon={() => (
                    <Icon name={stateName} color={'#6296f9'} />
                )}
                onPress={() =>
                    this.setState({
                        screen: stateName
                    })}
            >
                <TracksViewContainer
                    active={this.state.screen === stateName}
                    hidden={this.state.screen !== stateName}
                    source={source}
                />
            </Tab>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Player />

                <View style={{ flex: 2 }}>
                    <Tabs>
                        {[
                            {
                                state: states.search,
                                source: 'online'
                            },
                            {
                                state: states.history,
                                source: 'history'
                            },
                            {
                                state: states.favorite,
                                source: 'favorite'
                            },
                            {
                                state: states.saved,
                                source: 'offline'
                            }
                        ].map(({ state, source }) =>
                            this._renderTab(state, source)
                        )}
                    </Tabs>
                </View>
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
