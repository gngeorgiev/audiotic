const defaultState = {
    player: {
        track: {
            default: true,
            thumbnail: require('../res/music-player.png'),
            title: 'Nothing playing',
            length: 0
        },
        playing: false,
        loading: false,
        position: 0
    },
    offlineData: [],
    historyData: [],
    onlineData: []
};

export default defaultState;
