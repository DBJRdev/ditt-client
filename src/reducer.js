import { combineReducers } from 'redux-immutable';
import { reducer as authReducer } from './resources/auth';
import { reducer as workLogReducer } from './resources/workLog';

const appReducers = combineReducers({
  auth: authReducer,
  workLog: workLogReducer,
});

export default (state, action) => appReducers(state, action);
