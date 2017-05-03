import React, { PropTypes } from 'react';
import { ListItem } from 'react-native-elements';
import { AudioPlayer } from '../modules/AudioPlayer';
import { YouTube } from 'audiotic-core';

export class VideoListItem extends React.Component {
    static propTypes = {
        video: PropTypes.object
    }

    async play(id) {
        const track = await YouTube.resolve(id);
        return await AudioPlayer.play(track.url);
    }

    render() {
        const { video } = this.props;

        return (
            <ListItem
                avatar={{uri: video.thumbnail}}
                title={video.title}
                onPress={this.play.bind(this, video.id)}
            />
        )
    }
}