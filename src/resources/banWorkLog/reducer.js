import Immutable from 'immutable';
import initialState from './initialState';
import * as actionTypes from './actionTypes';
import { transformBanWorkLog } from './dataTransformers';

export default (state, action) => {
  if (typeof state === 'undefined') {
    return initialState;
  }

  const {
    payload,
    type,
  } = action;

  if (type === actionTypes.ADD_MULTIPLE_BAN_WORK_LOG_REQUEST) {
    return state
      .setIn(['banWorkLog', 'isPosting'], true)
      .setIn(['banWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_MULTIPLE_BAN_WORK_LOG_SUCCESS) {
    // Fetch is required to reload ban work log list with added work logs
    return state
      .setIn(['banWorkLog', 'isPosting'], false)
      .setIn(['banWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_MULTIPLE_BAN_WORK_LOG_FAILURE) {
    return state
      .setIn(['banWorkLog', 'isPosting'], false)
      .setIn(['banWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.EDIT_BAN_WORK_LOG_REQUEST) {
    return state
      .setIn(['banWorkLog', 'isPosting'], true)
      .setIn(['banWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.EDIT_BAN_WORK_LOG_SUCCESS) {
    // Fetch is required to reload ban work log list with edited work log
    return state
      .setIn(['banWorkLog', 'isPosting'], false)
      .setIn(['banWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.EDIT_BAN_WORK_LOG_FAILURE) {
    return state
      .setIn(['banWorkLog', 'isPosting'], false)
      .setIn(['banWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.DELETE_BAN_WORK_LOG_REQUEST) {
    return state
      .setIn(['banWorkLog', 'isPosting'], true)
      .setIn(['banWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_BAN_WORK_LOG_SUCCESS) {
    // Fetch is required to reload ban work log list with deleted work log
    return state
      .setIn(['banWorkLog', 'data'], null)
      .setIn(['banWorkLog', 'isPosting'], false)
      .setIn(['banWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_BAN_WORK_LOG_FAILURE) {
    return state
      .setIn(['banWorkLog', 'data'], null)
      .setIn(['banWorkLog', 'isPosting'], false)
      .setIn(['banWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.FETCH_BAN_WORK_LOG_REQUEST) {
    return state
      .setIn(['banWorkLog', 'isFetching'], true)
      .setIn(['banWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_BAN_WORK_LOG_SUCCESS) {
    return state
      .setIn(['banWorkLog', 'data'], Immutable.fromJS(transformBanWorkLog(payload)))
      .setIn(['banWorkLog', 'isFetching'], false)
      .setIn(['banWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_BAN_WORK_LOG_FAILURE) {
    return state
      .setIn(['banWorkLog', 'data'], null)
      .setIn(['banWorkLog', 'isFetching'], false)
      .setIn(['banWorkLog', 'isFetchingFailure'], true);
  }

  return state;
};
