import Immutable from 'immutable';
import { createDate } from '../../services/dateTimeService';
import initialState from './initialState';
import * as actionTypes from './actionTypes';

export default (state, action) => {
  if (typeof state === 'undefined') {
    return initialState;
  }

  const {
    payload,
    type,
  } = action;

  if (type === actionTypes.FETCH_CONFIG_REQUEST) {
    return state
      .setIn(['config', 'isFetching'], true)
      .setIn(['config', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_CONFIG_SUCCESS) {
    return state
      .setIn(['config', 'data'], Immutable.fromJS({
        supportedHolidays: payload.supportedHolidays.map(date => createDate(
          date.year.year,
          date.month - 1,
          date.day
        )),
        supportedYears: payload.supportedYears.map(supportedYear => supportedYear.year),
        workedHoursLimits: payload.workedHoursLimits,
      }))
      .setIn(['config', 'isFetching'], false)
      .setIn(['config', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_CONFIG_FAILURE) {
    return state
      .setIn(['config', 'data'], null)
      .setIn(['config', 'isFetching'], false)
      .setIn(['config', 'isFetchingFailure'], true);
  }

  return state;
};
