import React from 'react';
import { connect } from 'react-redux';

import Drawer from '../../components/drawer/drawer.container';
import SideMenu from './player-view-side-menu';

class PlayerDrawer extends React.Component {
    render() {
        return <Drawer component={SideMenu} {...this.props} />;
    }
}

export default connect(state => ({
    historyData: state.historyData,
    favoriteData: state.favoriteData,
    offlineData: state.offlineData
}))(PlayerDrawer);
