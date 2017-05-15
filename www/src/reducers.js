import { combineReducers } from 'redux';

import * as playerReducers from './components/player/player.reducers';
import * as tracksReducers from './components/tracks-view/tracks-view.reducers';

export const reducers = combineReducers({
    ...playerReducers,
    ...tracksReducers
});
