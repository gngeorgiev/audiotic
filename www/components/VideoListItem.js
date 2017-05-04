import React, { PropTypes } from 'react';
import { ListItem } from 'react-native-elements';
import { AudioPlayer } from '../modules/AudioPlayer';
import { YouTube } from 'audiotic-core';

export class VideoListItem extends React.Component {
    static propTypes = {
        track: PropTypes.object
    }

    state = {
        loading: false
    }

    refreshItem() {
        this.setState(this.state);
    }

    componentWillMount() {
        this._playListener = AudioPlayer.addListener('play', () => this.refreshItem());
        this._pauseListener = AudioPlayer.addListener('pause', () => this.refreshItem());
        this._resumeListener = AudioPlayer.addListener('resume', () => this.refreshItem());
    }

    componentWillUnmount() {
        this._playListener.remove();
        this._pauseListener.remove();
        this._resumeListener.remove();
    }

    async play(id) {
        this.setState({loading: true});

        const { playing, current } = AudioPlayer;

        if (current && !playing && current.id === id) {
            await AudioPlayer.resume();
        } else if (current && playing && current.id === id) {
            await AudioPlayer.pause();
        } else {
            const track = await YouTube.resolve(id);
            await AudioPlayer.play(track);
        }

        this.setState({loading: false});
    }

    render() {
        const { track } = this.props;
        const { loading } = this.state;
        const { playing, current } = AudioPlayer;

        let iconName;
        if (loading) {
            iconName = 'cached';
        } else {
            iconName = current && playing && current.id === track.id ? 'pause' : 'play-arrow';
        }

        return (
            <ListItem
                rightIcon={{name: iconName}}
                avatar={{uri: track.thumbnail}}
                title={track.title}
                onPress={() => this.play(track.id)}
            />
        )
    }
}