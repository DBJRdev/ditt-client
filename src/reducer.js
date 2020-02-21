import { combineReducers } from 'redux-immutable';
import { reducer as authReducer } from './resources/auth';
import { reducer as banWorkLogReducer } from './resources/banWorkLog';
import { reducer as businessTripWorkLogReducer } from './resources/businessTripWorkLog';
import { reducer as configReducer } from './resources/config';
import { reducer as homeOfficeWorkLogReducer } from './resources/homeOfficeWorkLog';
import { reducer as maternityProtectionWorkLogReducer } from './resources/maternityProtectionWorkLog';
import { reducer as overtimeWorkLogReducer } from './resources/overtimeWorkLog';
import { reducer as parentalLeaveWorkLogReducer } from './resources/parentalLeaveWorkLog';
import { reducer as sickDayUnpaidWorkLogReducer } from './resources/sickDayUnpaidWorkLog';
import { reducer as sickDayWorkLogReducer } from './resources/sickDayWorkLog';
import { reducer as specialLeaveWorkLogReducer } from './resources/specialLeaveWorkLog';
import { reducer as timeOffWorkLogReducer } from './resources/timeOffWorkLog';
import { reducer as userReducer } from './resources/user';
import { reducer as vacationReducer } from './resources/vacation';
import { reducer as vacationWorkLogReducer } from './resources/vacationWorkLog';
import { reducer as workHoursReducer } from './resources/workHours';
import { reducer as workLogReducer } from './resources/workLog';
import { reducer as workMonthReducer } from './resources/workMonth';

const appReducers = combineReducers({
  auth: authReducer,
  banWorkLog: banWorkLogReducer,
  businessTripWorkLog: businessTripWorkLogReducer,
  config: configReducer,
  homeOfficeWorkLog: homeOfficeWorkLogReducer,
  maternityProtectionWorkLog: maternityProtectionWorkLogReducer,
  overtimeWorkLog: overtimeWorkLogReducer,
  parentalLeaveWorkLog: parentalLeaveWorkLogReducer,
  sickDayUnpaidWorkLog: sickDayUnpaidWorkLogReducer,
  sickDayWorkLog: sickDayWorkLogReducer,
  specialLeaveWorkLog: specialLeaveWorkLogReducer,
  timeOffWorkLog: timeOffWorkLogReducer,
  user: userReducer,
  vacation: vacationReducer,
  vacationWorkLog: vacationWorkLogReducer,
  workHours: workHoursReducer,
  workLog: workLogReducer,
  workMonth: workMonthReducer,
});

export default (state, action) => appReducers(state, action);
