import { combineReducers } from 'redux-immutable';
import { reducer as globalReducer } from './resources/global/index';

const appReducers = combineReducers({
  global: globalReducer,
});

export default (state, action) => appReducers(state, action);
