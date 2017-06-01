import React from 'react';
import { Image, View } from 'react-native';

export class BlurTrackThumbnail extends React.Component {
    render() {
        const { track, style, imageStyle } = this.props;

        return (
            <View style={{ flex: 1 }}>
                <Image
                    source={{ uri: track.thumbnail }}
                    style={[
                        {
                            flex: 1,
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            right: 0,
                            opacity: 0.7
                        },
                        imageStyle
                    ]}
                    blurRadius={5}
                />
                {this.props.children}
            </View>
        );
    }
}
