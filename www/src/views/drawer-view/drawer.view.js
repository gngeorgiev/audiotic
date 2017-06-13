import React from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableHighlight, ScrollView } from 'react-native';
import Drawer from 'react-native-drawer';
import { Actions, DefaultRenderer } from 'react-native-router-flux';
import { ListItem, Divider, Card, Badge } from 'react-native-elements';

class SideMenuComponent extends React.Component {
    drawerItems = [
        {
            text: 'Home',
            icon: 'home',
            route: 'player'
        },
        {
            text: 'History',
            icon: 'history',
            route: 'history',
            showLabel: true,
            label: ''
        },
        {
            text: 'Favorites',
            icon: 'favorite',
            route: 'favorites',
            showLabel: true,
            label: ''
        },
        {
            text: 'Offline',
            icon: 'offline-pin',
            route: 'offline',
            showLabel: true,
            label: ''
        },
        {
            text: 'Settings',
            icon: 'settings',
            route: 'settings'
        }
    ];

    navigateToDrawerItem(route) {
        this.props.navigation.close();
        Actions[route]();
    }

    renderListItem(item, i) {
        const { label, showLabel, icon, text, route } = item;
        return (
            <ListItem
                key={i}
                leftIcon={{ name: icon }}
                title={text}
                label={showLabel ? <Badge value={label} /> : null}
                hideChevron={true}
                onPress={() => this.navigateToDrawerItem(route)}
            />
        );
    }

    render() {
        const { offlineData, favoriteData, historyData } = this.props;

        this.drawerItems.forEach(item => {
            let count = 0;
            switch (item.route) {
                case 'history':
                    count = historyData.length;
                    break;
                case 'offline':
                    count = offlineData.length;
                    break;
                case 'favorites':
                    count = favoriteData.length;
                    break;
                default:
                    count = 0;
            }

            item.label = count;
        });

        return (
            <Card containerStyle={{ margin: 0 }} title="Audiotic">
                {this.drawerItems.map(
                    (item, i) =>
                        item.divider
                            ? <Divider key={i} />
                            : this.renderListItem(item, i)
                )}
            </Card>
        );
    }
}

class DrawerView extends React.Component {
    render() {
        const state = this.props.navigationState;
        const children = state.children;
        const { offlineData, favoriteData, historyData } = this.props;
        return (
            <Drawer
                ref="navigation"
                open={state.open}
                onOpen={() => Actions.refresh({ key: state.key, open: true })}
                onClose={() => Actions.refresh({ key: state.key, open: false })}
                type="displace"
                content={
                    <View style={{ backgroundColor: 'white', flex: 1 }}>
                        <ScrollView>
                            <SideMenuComponent
                                offlineData={offlineData}
                                favoriteData={favoriteData}
                                historyData={historyData}
                                navigation={this.refs.navigation}
                            />
                        </ScrollView>
                    </View>
                }
                tapToClose={true}
                elevation={1}
                openDrawerOffset={0.2}
                negotiatePan={true}
                sceneStyle={{ marginTop: 56 }}
            >
                <DefaultRenderer
                    navigationState={children[0]}
                    onNavigate={this.props.onNavigate}
                />
            </Drawer>
        );
    }
}

export default connect(state => ({
    historyData: state.historyData,
    favoriteData: state.favoriteData,
    offlineData: state.offlineData
}))(DrawerView);
