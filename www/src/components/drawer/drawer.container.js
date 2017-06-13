import React from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableHighlight, ScrollView } from 'react-native';
import Drawer from 'react-native-drawer';
import { Actions, DefaultRenderer } from 'react-native-router-flux';
import { ListItem, Divider, Card, Badge } from 'react-native-elements';

class DrawerContainer extends React.Component {
    render() {
        const state = this.props.navigationState;
        const children = state.children;
        const { component } = this.props;
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
                            <component
                                {...this.props}
                                navigation={this.refs.navigation}
                            />
                            {/*<SideMenuComponent
                                offlineData={offlineData}
                                favoriteData={favoriteData}
                                historyData={historyData}
                                navigation={this.refs.navigation}
                            />*/}
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

export default connect((state, ownProps) => ({
    ...ownProps
}))(DrawerContainer);
