import React from 'react';
import { View } from 'react-native';

import { Toolbar } from 'react-native-material-ui';

export default class Header extends React.Component {
    render() {
        const {
            title,
            searchable,
            leftElement = 'menu',
            onLeftElementPress = () => {},
            transparent
        } = this.props;

        return (
            <View
                style={{
                    height: 56,
                    marginBottom: 56,
                    elevation: 4,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0
                }}
            >
                <Toolbar
                    style={
                        transparent
                            ? {
                                  container: {
                                      backgroundColor: '#212121'
                                  }
                              }
                            : {}
                    }
                    leftElement={leftElement}
                    onLeftElementPress={onLeftElementPress}
                    centerElement={title}
                    searchable={
                        searchable
                            ? {
                                  autoFocus: true,
                                  placeholder: 'Search music',
                                  onSearchPressed: () => {}
                              }
                            : null
                    }
                />
            </View>
        );
    }
}
