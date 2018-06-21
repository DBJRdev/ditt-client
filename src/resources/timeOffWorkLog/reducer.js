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

  if (type === actionTypes.ADD_TIME_OFF_WORK_LOG_REQUEST) {
    return state
      .setIn(['addTimeOffWorkLog', 'isPosting'], true)
      .setIn(['addTimeOffWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_TIME_OFF_WORK_LOG_SUCCESS) {
    const addTimeOffWorkLogData = {
      date: toMomentDateTime(payload.date),
      id: parseInt(payload.id, 10),
    };

    // Fetch is required to reload home office work log list with added work log
    return state
      .setIn(['addTimeOffWorkLog', 'data'], Immutable.fromJS(addTimeOffWorkLogData))
      .setIn(['addTimeOffWorkLog', 'isPosting'], false)
      .setIn(['addTimeOffWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_TIME_OFF_WORK_LOG_FAILURE) {
    return state
      .setIn(['addTimeOffWorkLog', 'data'], null)
      .setIn(['addTimeOffWorkLog', 'isPosting'], false)
      .setIn(['addTimeOffWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.DELETE_TIME_OFF_WORK_LOG_REQUEST) {
    return state
      .setIn(['deleteTimeOffWorkLog', 'isPosting'], true)
      .setIn(['deleteTimeOffWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_TIME_OFF_WORK_LOG_SUCCESS) {
    // Fetch is required to reload home office work log list with deleted work log
    return state
      .setIn(['deleteTimeOffWorkLog', 'isPosting'], false)
      .setIn(['deleteTimeOffWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_TIME_OFF_WORK_LOG_FAILURE) {
    return state
      .setIn(['deleteTimeOffWorkLog', 'isPosting'], false)
      .setIn(['deleteTimeOffWorkLog', 'isPostingFailure'], true);
  }

  return state;
};
