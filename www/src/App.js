import React from 'react';
import Display from 'react-native-display';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { registerCustomResolver } from 'audiotic-core';
import { Scene, Router } from 'react-native-router-flux';

import { reducers } from './reducers';
import defaultState from './defaultState';
import { OfflineTracksResolver } from './modules/OfflineTracksManager';

import PlayerView from './views/player-view/player.view';
import FullScreenPlayerView
    from './views/full-screen-player-view/full-screen-player-view';

registerCustomResolver(new OfflineTracksResolver());

class App extends React.Component {
    render() {
        return (
            <Router>
                <Scene key="root" hideNavBar={true}>
                    <Scene key="player" component={PlayerView} />
                    <Scene
                        key="fullScreenPlayer"
                        component={FullScreenPlayerView}
                    />
                </Scene>
            </Router>
        );
    }
}

const store = createStore(reducers, defaultState, applyMiddleware(thunk));

export default class ReduxApp extends React.Component {
    async componentWillUnmount() {
        await AudioPlayer.stop();
    }

    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        );
    }
}
