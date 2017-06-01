import React from 'react';
import { View } from 'react-native';
import Display from 'react-native-display';
import { Provider } from 'react-redux';
import { Scene, Router, Actions } from 'react-native-router-flux';
import { ThemeProvider } from 'react-native-material-ui';

import store from './store';
import PlayerView from './views/player-view/player.view';
import FullScreenPlayerView
    from './views/full-screen-player-view/full-screen-player-view';
import Header from './components/header/header.container';
import Drawer from './views/drawer-view/drawer.view';

const dev = !!__DEV__;

export default class App extends React.Component {
    async componentWillUnmount() {
        await AudioPlayer.stop();
    }

    render() {
        return (
            <ThemeProvider>
                <Provider store={store}>
                    <Router duration={dev ? 0 : 300} navBar={Header}>
                        <Scene key="drawer" component={Drawer} open={false}>
                            <Scene key="root" tabs={false}>
                                <Scene
                                    key="player"
                                    title="Music"
                                    searchable={true}
                                    component={PlayerView}
                                    source="online"
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
