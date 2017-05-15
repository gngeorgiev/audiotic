import React from 'react';

import Player from '../../components/player/player.container';

export default class FullSreenPlayerView extends React.Component {
    render() {
        return <Player fullScreen={true} />;
    }
}
