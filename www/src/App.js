import React from 'react';
import Display from 'react-native-display';
import { Provider } from 'react-redux';
import { Scene, Router } from 'react-native-router-flux';

import store from './store';
import PlayerView from './views/player-view/player.view';
import FullScreenPlayerView
    from './views/full-screen-player-view/full-screen-player-view';

export default class App extends React.Component {
    async componentWillUnmount() {
        await AudioPlayer.stop();
    }

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Scene key="root" hideNavBar={true}>
                        <Scene key="player" component={PlayerView} />
                        <Scene
                            key="fullScreenPlayer"
                            component={FullScreenPlayerView}
                        />
                    </Scene>
                </Router>
            </Provider>
        );
    }
}
