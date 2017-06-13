import React from 'react';
import { Text, View } from 'react-native';
import Display from 'react-native-display';
import { Provider } from 'react-redux';
import { Scene, Router, Actions } from 'react-native-router-flux';
import { ThemeProvider } from 'react-native-material-ui';

import store from './store';
import PlayerView from './views/player-view/player.view';
import FullScreenPlayerView
    from './views/full-screen-player-view/full-screen-player-view';
import Header from './components/header/header.container';
import Drawer from './views/player-view/player-view-drawer.js';

export default class App extends React.Component {
    state = { store: null };

    constructor() {
        super();
        store().then(initializedStore => {
            this.setState({
                store: initializedStore
            });
        });
    }

    async componentWillUnmount() {
        await AudioPlayer.stop();
    }

    render() {
        if (!this.state.store) {
            return <Text>Loading...</Text>;
        }

        return (
            <ThemeProvider>
                <Provider store={this.state.store}>
                    <Router duration={__DEV__ ? 0 : 300} navBar={Header}>
                        <Scene key="drawer" component={Drawer} open={false}>
                            <Scene
                                key="root"
                                tabs={false}
                                style={{ paddingTop: 50 }}
                            >
                                <Scene
                                    key="player"
                                    title="Music"
                                    searchable={true}
                                    component={PlayerView}
                                    source="online"
                                />
                                {/*TODO: search in history, favorites, offline*/}
                                <Scene
                                    key="history"
                                    title="History"
                                    searchable={false}
                                    component={PlayerView}
                                    source="history"
                                />
                                <Scene
                                    key="favorites"
                                    title="Favorites"
                                    searchable={false}
                                    component={PlayerView}
                                    source="favorites"
                                />
                                <Scene
                                    key="offline"
                                    title="Offline"
                                    searchable={false}
                                    component={PlayerView}
                                    source="offline"
                                />
                                <Scene
                                    key="fullScreenPlayer"
                                    leftElement="arrow-back"
                                    transparent={true}
                                    onLeftElementPress={Actions.pop}
                                    component={FullScreenPlayerView}
                                />
                            </Scene>
                        </Scene>
                    </Router>
                </Provider>
            </ThemeProvider>
        );
    }
}
