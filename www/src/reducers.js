import { combineReducers } from 'redux';

import * as playerReducers from './components/player/player.reducers';
import * as tracksReducers from './components/tracks-view/tracks-view.reducers';
import * as headerReducers from './components/header/header.reducers';

export const reducers = combineReducers({
    ...playerReducers,
    ...tracksReducers,
    ...headerReducers
});
