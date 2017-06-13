import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { reducers } from './reducers';
import defaultState from './defaultState';

export default async () => {
    const state = await defaultState();
    const store = createStore(reducers, state, applyMiddleware(thunk));
    console.log(store);
    return store;
};
