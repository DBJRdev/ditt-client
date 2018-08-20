import Immutable from 'immutable';
import { toMomentDateTime } from '../../services/dateTimeService';
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
        supportedHolidays: payload.supportedHolidays.map(date => toMomentDateTime(date)),
        supportedYear: payload.supportedYear,
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
