import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tabs, Tab, Icon } from 'react-native-elements';
import Display from 'react-native-display';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { registerCustomResolver } from 'audiotic-core';

import { reducers } from './reducers';
import defaultState from './defaultState';

import Player from './components/player/player.container';
import {
    FullScreenPlayerComponent
} from './components/FullScreenPlayer.component';
import { AudioPlayer } from './modules/AudioPlayer';
import TracksViewContainer
    from './components/tracks-view/tracks-view.container';
import { OfflineTracksResolver } from './modules/OfflineTracksManager';

registerCustomResolver(new OfflineTracksResolver());

const states = {
    search: 'search',
    history: 'history',
    saved: 'save'
};

class App extends React.Component {
    state = {
        screen: states.search,
        showFullScreenPlayer: false
    };

    searchText = '';

    async componentWillUnmount() {
        await AudioPlayer.stop();
    }

    render() {
        const { showFullScreenPlayer } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <Display
                    keepAlive={true}
                    enable={showFullScreenPlayer}
                    style={{ flex: 1 }}
                >
                    <FullScreenPlayerComponent
                        onBackPress={() =>
                            this.setState({ showFullScreenPlayer: false })}
                    />
                </Display>

                <Display
                    enable={!showFullScreenPlayer}
                    style={{ flex: 1 }}
                    keepAlive={true}
                >
                    <View style={styles.container}>
                        <Player
                            onPress={() =>
                                this.setState({ showFullScreenPlayer: true })}
                        />

                        <View style={{ flex: 2 }}>
                            <Tabs>
                                <Tab
                                    title="Search"
                                    selected={
                                        this.state.screen === states.search
                                    }
                                    renderIcon={() => (
                                        <Icon name={states.search} />
                                    )}
                                    renderSelectedIcon={() => (
                                        <Icon
                                            name={states.search}
                                            color={'#6296f9'}
                                        />
                                    )}
                                    onPress={() =>
                                        this.setState({
                                            screen: states.search
                                        })}
                                >
                                    <TracksViewContainer
                                        active={
                                            this.state.screen === states.search
                                        }
                                        hidden={
                                            this.state.screen !== states.search
                                        }
                                        source="online"
                                    />
                                </Tab>
                                <Tab
                                    title="History"
                                    selected={
                                        this.state.screen === states.history
                                    }
                                    renderIcon={() => (
                                        <Icon name={states.history} />
                                    )}
                                    renderSelectedIcon={() => (
                                        <Icon
                                            name={states.history}
                                            color={'#6296f9'}
                                        />
                                    )}
                                    onPress={() =>
                                        this.setState({
                                            screen: states.history
                                        })}
                                />

                                <Tab
                                    title="Saved"
                                    selected={
                                        this.state.screen === states.saved
                                    }
                                    renderIcon={() => (
                                        <Icon name={states.saved} />
                                    )}
                                    renderSelectedIcon={() => (
                                        <Icon
                                            name={states.saved}
                                            color={'#6296f9'}
                                        />
                                    )}
                                    onPress={() =>
                                        this.setState({ screen: states.saved })}
                                >
                                    {/*<TracksViewContainer
                                        active={
                                            this.state.screen === states.search
                                        }
                                        hidden={
                                            this.state.screen !== states.search
                                        }
                                        searchString={this.state.searchString}
                                        offlineMode={true}
                                        onSearch={str =>
                                            AudioPlayer.search(str, 'offline')}
                                    />*/}
                                </Tab>
                            </Tabs>
                        </View>

                    </View>
                </Display>

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

const store = createStore(reducers, defaultState, applyMiddleware(thunk));

export default class ReduxApp extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        );
    }
}
