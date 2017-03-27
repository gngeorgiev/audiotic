import React, {Component} from 'react';
import {Provider} from "react-redux";
import {Router, Route, browserHistory} from 'react-router';
import store from "../common/utilities/storage/store";
import HomeComponent from './screens/Home.web';

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router history={browserHistory}>
                    <Route path="/" component={HomeComponent}/>
                </Router>
            </Provider>
        )
    }
}

