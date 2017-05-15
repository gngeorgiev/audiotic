import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { reducers } from './reducers';
import defaultState from './defaultState';

const store = createStore(reducers, defaultState, applyMiddleware(thunk));
export default store;
