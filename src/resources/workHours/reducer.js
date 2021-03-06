import Immutable from 'immutable';
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

  const filterWorkHour = (data) => ({
    month: parseInt(data.month, 10),
    requiredHours: data.requiredHours,
    year: parseInt(data.year.year, 10),
  });

  if (type === actionTypes.FETCH_WORK_HOURS_LIST_REQUEST) {
    return state
      .setIn(['workHoursList', 'isFetching'], true)
      .setIn(['workHoursList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_WORK_HOURS_LIST_SUCCESS) {
    return state
      .setIn(['workHoursList', 'data'], Immutable.fromJS(payload.map(filterWorkHour)))
      .setIn(['workHoursList', 'isFetching'], false)
      .setIn(['workHoursList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_WORK_HOURS_LIST_FAILURE) {
    return state
      .setIn(['workHoursList', 'data'], Immutable.fromJS([]))
      .setIn(['workHoursList', 'isFetching'], false)
      .setIn(['workHoursList', 'isFetchingFailure'], true);
  }

  return state;
};
