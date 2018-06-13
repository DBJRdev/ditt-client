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

  if (type === actionTypes.ADD_WORK_LOG_REQUEST) {
    return state
      .setIn(['addWorkLog', 'isPosting'], true)
      .setIn(['addWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_WORK_LOG_SUCCESS) {
    const addWorkLogData = {
      endTime: toMomentDateTime(payload.endTime),
      id: parseInt(payload.id, 10),
      startTime: toMomentDateTime(payload.startTime),
    };

    // Fetch is required to reload work log list with added work log
    return state
      .setIn(['addWorkLog', 'data'], Immutable.fromJS(addWorkLogData))
      .setIn(['addWorkLog', 'isPosting'], false)
      .setIn(['addWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_WORK_LOG_FAILURE) {
    return state
      .setIn(['addWorkLog', 'data'], null)
      .setIn(['addWorkLog', 'isPosting'], false)
      .setIn(['addWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.DELETE_WORK_LOG_REQUEST) {
    return state
      .setIn(['deleteWorkLog', 'isPosting'], true)
      .setIn(['deleteWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_WORK_LOG_SUCCESS) {
    // Fetch is required to reload  work log list with deleted work log
    return state
      .setIn(['deleteWorkLog', 'isPosting'], false)
      .setIn(['deleteWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_WORK_LOG_FAILURE) {
    return state
      .setIn(['deleteWorkLog', 'isPosting'], false)
      .setIn(['deleteWorkLog', 'isPostingFailure'], true);
  }

  return state;
};
