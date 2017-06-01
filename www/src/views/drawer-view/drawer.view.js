import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import Drawer from 'react-native-drawer';
import { Actions, DefaultRenderer } from 'react-native-router-flux';
import { ListItem } from 'react-native-elements';

class SideMenu extends React.Component {
    drawerItems = [
        {
            text: 'Home',
            icon: 'home',
            route: 'player'
        },
        {
            text: 'History',
            icon: 'history',
            route: 'history'
        },
        {
            text: 'Favorites',
            icon: 'favorite',
            route: 'favorties'
        },
        {
            text: 'Offline',
            icon: 'offline-pin',
            route: 'offline'
        }
    ];

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.drawerItems.map(i => (
                    <ListItem
                        key={i.text}
                        leftIcon={{ name: i.icon }}
                        title={i.text}
                        onPress={() => Actions[i.route]()}
                    />
                ))}
            </View>
        );
    }
}

export default class DrawerView extends React.Component {
    render() {
        const state = this.props.navigationState;
        const children = state.children;
        return (
            <Drawer
                ref="navigation"
                open={state.open}
                onOpen={() => Actions.refresh({ key: state.key, open: true })}
                onClose={() => Actions.refresh({ key: state.key, open: false })}
                type="displace"
                content={<SideMenu />}
                tapToClose={true}
                openDrawerOffset={0.2}
                panCloseMask={0.2}
                negotiatePan={true}
                tweenHandler={ratio => ({
                    main: { opacity: Math.max(0.54, 1 - ratio) }
                })}
            >
                <DefaultRenderer
                    navigationState={children[0]}
                    onNavigate={this.props.onNavigate}
                />
            </Drawer>
        );
    }
}
