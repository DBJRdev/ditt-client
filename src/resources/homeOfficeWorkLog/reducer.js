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

  if (type === actionTypes.ADD_HOME_OFFICE_WORK_LOG_REQUEST) {
    return state
      .setIn(['addHomeOfficeWorkLog', 'isPosting'], true)
      .setIn(['addHomeOfficeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_HOME_OFFICE_WORK_LOG_SUCCESS) {
    const addHomeOfficeWorkLogData = {
      date: toMomentDateTime(payload.date),
      id: parseInt(payload.id, 10),
    };

    // Fetch is required to reload home office work log list with added work log
    return state
      .setIn(['addHomeOfficeWorkLog', 'data'], Immutable.fromJS(addHomeOfficeWorkLogData))
      .setIn(['addHomeOfficeWorkLog', 'isPosting'], false)
      .setIn(['addHomeOfficeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_HOME_OFFICE_WORK_LOG_FAILURE) {
    return state
      .setIn(['addHomeOfficeWorkLog', 'data'], null)
      .setIn(['addHomeOfficeWorkLog', 'isPosting'], false)
      .setIn(['addHomeOfficeWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.DELETE_HOME_OFFICE_WORK_LOG_REQUEST) {
    return state
      .setIn(['deleteHomeOfficeWorkLog', 'isPosting'], true)
      .setIn(['deleteHomeOfficeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_HOME_OFFICE_WORK_LOG_SUCCESS) {
    // Fetch is required to reload home office work log list with deleted work log
    return state
      .setIn(['deleteHomeOfficeWorkLog', 'isPosting'], false)
      .setIn(['deleteHomeOfficeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_HOME_OFFICE_WORK_LOG_FAILURE) {
    return state
      .setIn(['deleteHomeOfficeWorkLog', 'isPosting'], false)
      .setIn(['deleteHomeOfficeWorkLog', 'isPostingFailure'], true);
  }

  return state;
};
