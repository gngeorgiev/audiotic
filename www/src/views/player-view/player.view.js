import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tabs, Tab, Icon } from 'react-native-elements';

import Player from '../../components/player/player.container';
import TracksViewContainer
    from '../../components/tracks-view/tracks-view.container';

const states = {
    search: 'search',
    history: 'history',
    saved: 'save'
};

export default class PlayerView extends React.Component {
    state = {
        screen: states.search
    };

    render() {
        return (
            <View style={styles.container}>
                <Player />

                <View style={{ flex: 2 }}>
                    <Tabs>
                        <Tab
                            selected={this.state.screen === states.search}
                            renderIcon={() => <Icon name={states.search} />}
                            renderSelectedIcon={() => (
                                <Icon name={states.search} color={'#6296f9'} />
                            )}
                            onPress={() =>
                                this.setState({
                                    screen: states.search
                                })}
                        >
                            <TracksViewContainer
                                active={this.state.screen === states.search}
                                hidden={this.state.screen !== states.search}
                                source="online"
                            />
                        </Tab>
                        <Tab
                            selected={this.state.screen === states.history}
                            renderIcon={() => <Icon name={states.history} />}
                            renderSelectedIcon={() => (
                                <Icon name={states.history} color={'#6296f9'} />
                            )}
                            onPress={() =>
                                this.setState({
                                    screen: states.history
                                })}
                        />

                        <Tab
                            selected={this.state.screen === states.saved}
                            renderIcon={() => <Icon name={states.saved} />}
                            renderSelectedIcon={() => (
                                <Icon name={states.saved} color={'#6296f9'} />
                            )}
                            onPress={() =>
                                this.setState({
                                    screen: states.saved
                                })}
                        >
                            <TracksViewContainer
                                active={this.state.screen === states.saved}
                                hidden={this.state.screen !== states.saved}
                                source="offline"
                            />
                        </Tab>
                    </Tabs>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff'
    },
    bottomNavigation: {
        flex: 1
    },
    bottomNavigationAction: {
        flex: 0.33
    }
});
