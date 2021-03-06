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

  const filterWorkLog = (data) => ({
    date: toMomentDateTime(data.date),
    id: parseInt(data.id, 10),
  });

  if (type === actionTypes.ADD_MULTIPLE_PARENTAL_LEAVE_WORK_LOG_REQUEST) {
    return state
      .setIn(['parentalLeaveWorkLog', 'isPosting'], true)
      .setIn(['parentalLeaveWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_MULTIPLE_PARENTAL_LEAVE_WORK_LOG_SUCCESS) {
    // Fetch is required to reload parental leave work log list with added work logs
    return state
      .setIn(['parentalLeaveWorkLog', 'isPosting'], false)
      .setIn(['parentalLeaveWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_MULTIPLE_PARENTAL_LEAVE_WORK_LOG_FAILURE) {
    return state
      .setIn(['parentalLeaveWorkLog', 'isPosting'], false)
      .setIn(['parentalLeaveWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.DELETE_PARENTAL_LEAVE_WORK_LOG_REQUEST) {
    return state
      .setIn(['parentalLeaveWorkLog', 'isPosting'], true)
      .setIn(['parentalLeaveWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_PARENTAL_LEAVE_WORK_LOG_SUCCESS) {
    // Fetch is required to reload parental leave work log list with deleted work log
    return state
      .setIn(['parentalLeaveWorkLog', 'data'], null)
      .setIn(['parentalLeaveWorkLog', 'isPosting'], false)
      .setIn(['parentalLeaveWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_PARENTAL_LEAVE_WORK_LOG_FAILURE) {
    return state
      .setIn(['parentalLeaveWorkLog', 'data'], null)
      .setIn(['parentalLeaveWorkLog', 'isPosting'], false)
      .setIn(['parentalLeaveWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.FETCH_PARENTAL_LEAVE_WORK_LOG_REQUEST) {
    return state
      .setIn(['parentalLeaveWorkLog', 'isFetching'], true)
      .setIn(['parentalLeaveWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_PARENTAL_LEAVE_WORK_LOG_SUCCESS) {
    return state
      .setIn(['parentalLeaveWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
      .setIn(['parentalLeaveWorkLog', 'isFetching'], false)
      .setIn(['parentalLeaveWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_PARENTAL_LEAVE_WORK_LOG_FAILURE) {
    return state
      .setIn(['parentalLeaveWorkLog', 'data'], null)
      .setIn(['parentalLeaveWorkLog', 'isFetching'], false)
      .setIn(['parentalLeaveWorkLog', 'isFetchingFailure'], true);
  }

  return state;
};
