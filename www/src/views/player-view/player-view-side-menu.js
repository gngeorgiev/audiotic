import React from 'react';
import { View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { ListItem, Divider, Card, Badge } from 'react-native-elements';

export default class SideMenuComponent extends React.Component {
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
