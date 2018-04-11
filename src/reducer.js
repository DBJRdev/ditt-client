import { combineReducers } from 'redux-immutable';
import { reducer as workLogReducer } from './resources/workLog';

const appReducers = combineReducers({
  workLog: workLogReducer,
});

export default (state, action) => appReducers(state, action);
