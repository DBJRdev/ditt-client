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

  if (type === actionTypes.ADD_BUSINESS_TRIP_WORK_LOG_REQUEST) {
    return state
      .setIn(['addBusinessTripWorkLog', 'isPosting'], true)
      .setIn(['addBusinessTripWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_BUSINESS_TRIP_WORK_LOG_SUCCESS) {
    const addBusinessTripWorkLogData = {
      date: toMomentDateTime(payload.date),
      id: parseInt(payload.id, 10),
    };

    // Fetch is required to reload business trip work log list with added work log
    return state
      .setIn(['addBusinessTripWorkLog', 'data'], Immutable.fromJS(addBusinessTripWorkLogData))
      .setIn(['addBusinessTripWorkLog', 'isPosting'], false)
      .setIn(['addBusinessTripWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_BUSINESS_TRIP_WORK_LOG_FAILURE) {
    return state
      .setIn(['addBusinessTripWorkLog', 'data'], null)
      .setIn(['addBusinessTripWorkLog', 'isPosting'], false)
      .setIn(['addBusinessTripWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.DELETE_BUSINESS_TRIP_WORK_LOG_REQUEST) {
    return state
      .setIn(['deleteBusinessTripWorkLog', 'isPosting'], true)
      .setIn(['deleteBusinessTripWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_BUSINESS_TRIP_WORK_LOG_SUCCESS) {
    // Fetch is required to reload business trip  work log list with deleted work log
    return state
      .setIn(['deleteBusinessTripWorkLog', 'isPosting'], false)
      .setIn(['deleteBusinessTripWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_BUSINESS_TRIP_WORK_LOG_FAILURE) {
    return state
      .setIn(['deleteBusinessTripWorkLog', 'isPosting'], false)
      .setIn(['deleteBusinessTripWorkLog', 'isPostingFailure'], true);
  }

  return state;
};
