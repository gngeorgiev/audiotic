const defaultState = {
    player: {
        track: {
            default: true,
            thumbnail: require('../res/music-player.png'),
            title: 'Nothing playing',
            length: 0
        },
        playing: false,
        loading: false
    },
    offlineData: [],
    historyData: [],
    onlineData: []
};

export default defaultState;
