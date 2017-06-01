import React from 'react';
import { View } from 'react-native';
import { Toolbar } from 'react-native-material-ui';
import { Actions, DefaultRenderer } from 'react-native-router-flux';

export default class Header extends React.Component {
    state = { text: '' };

    render() {
        const {
            title,
            searchable,
            leftElement = 'menu',
            onLeftElementPress = () =>
                Actions.refresh({ key: 'drawer', open: value => !value }),
            transparent,
            search
        } = this.props;

        const { text } = this.state;

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
                                  onChangeText: text => this.setState({ text }),
                                  onSubmitEditing: () => search(text)
                              }
                            : null
                    }
                />
            </View>
        );
    }
}
