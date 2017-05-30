import React from 'react';
import { connect } from 'react-redux';

import Header from './header.component';
import { search } from './header.actions';

class HeaderContainer extends React.Component {
    render() {
        return <Header {...this.props} />;
    }
}

const mapState = (state, props) => ({
    ...props
});

const mapDispatch = dispatch => ({
    search: str => dispatch(search(str, 'online'))
});

export default connect(mapState, mapDispatch)(HeaderContainer);
