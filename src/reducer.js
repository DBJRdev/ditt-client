import { combineReducers } from 'redux-immutable';
import { reducer as authReducer } from './resources/auth';
import { reducer as userReducer } from './resources/user';
import { reducer as workHoursReducer } from './resources/workHours';
import { reducer as workLogReducer } from './resources/workLog';
import { reducer as workMonthReducer } from './resources/workMonth';

const appReducers = combineReducers({
  auth: authReducer,
  user: userReducer,
  workHours: workHoursReducer,
  workLog: workLogReducer,
  workMonth: workMonthReducer,
});

export default (state, action) => appReducers(state, action);
