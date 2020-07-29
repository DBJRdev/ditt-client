import Immutable from 'immutable';
import { transformHomeOfficeWorkLog } from './dataTransformers';
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

  if (
    type === actionTypes.ADD_HOME_OFFICE_WORK_LOG_REQUEST
    || type === actionTypes.ADD_MULTIPLE_HOME_OFFICE_WORK_LOG_REQUEST
  ) {
    return state
      .setIn(['homeOfficeWorkLog', 'isPosting'], true)
      .setIn(['homeOfficeWorkLog', 'isPostingFailure'], false);
  }

  if (
    type === actionTypes.ADD_HOME_OFFICE_WORK_LOG_SUCCESS
    || type === actionTypes.ADD_MULTIPLE_HOME_OFFICE_WORK_LOG_SUCCESS
  ) {
    // Fetch is required to reload home office work log list with added work log
    return state
      .setIn(['homeOfficeWorkLog', 'isPosting'], false)
      .setIn(['homeOfficeWorkLog', 'isPostingFailure'], false);
  }

  if (
    type === actionTypes.ADD_HOME_OFFICE_WORK_LOG_FAILURE
    || type === actionTypes.ADD_MULTIPLE_HOME_OFFICE_WORK_LOG_FAILURE
  ) {
    return state
      .setIn(['homeOfficeWorkLog', 'isPosting'], false)
      .setIn(['homeOfficeWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.DELETE_HOME_OFFICE_WORK_LOG_REQUEST) {
    return state
      .setIn(['homeOfficeWorkLog', 'isPosting'], true)
      .setIn(['homeOfficeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_HOME_OFFICE_WORK_LOG_SUCCESS) {
    // Fetch is required to reload home office work log list with deleted work log
    return state
      .setIn(['homeOfficeWorkLog', 'data'], null)
      .setIn(['homeOfficeWorkLog', 'isPosting'], false)
      .setIn(['homeOfficeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_HOME_OFFICE_WORK_LOG_FAILURE) {
    return state
      .setIn(['homeOfficeWorkLog', 'data'], null)
      .setIn(['homeOfficeWorkLog', 'isPosting'], false)
      .setIn(['homeOfficeWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.FETCH_HOME_OFFICE_WORK_LOG_REQUEST) {
    return state
      .setIn(['homeOfficeWorkLog', 'isFetching'], true)
      .setIn(['homeOfficeWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_HOME_OFFICE_WORK_LOG_SUCCESS) {
    return state
      .setIn(['homeOfficeWorkLog', 'data'], Immutable.fromJS(transformHomeOfficeWorkLog(payload)))
      .setIn(['homeOfficeWorkLog', 'isFetching'], false)
      .setIn(['homeOfficeWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_HOME_OFFICE_WORK_LOG_FAILURE) {
    return state
      .setIn(['homeOfficeWorkLog', 'data'], null)
      .setIn(['homeOfficeWorkLog', 'isFetching'], false)
      .setIn(['homeOfficeWorkLog', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.MARK_HOME_OFFICE_WORK_LOG_APPROVED_REQUEST) {
    return state
      .setIn(['homeOfficeWorkLog', 'isPosting'], true)
      .setIn(['homeOfficeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_HOME_OFFICE_WORK_LOG_APPROVED_SUCCESS) {
    // Fetch is required to reload home office work log list with marked work log
    return state
      .setIn(['homeOfficeWorkLog', 'data'], Immutable.fromJS(transformHomeOfficeWorkLog(payload)))
      .setIn(['homeOfficeWorkLog', 'isPosting'], false)
      .setIn(['homeOfficeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_HOME_OFFICE_WORK_LOG_APPROVED_FAILURE) {
    return state
      .setIn(['homeOfficeWorkLog', 'data'], null)
      .setIn(['homeOfficeWorkLog', 'isPosting'], false)
      .setIn(['homeOfficeWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.MARK_HOME_OFFICE_WORK_LOG_REJECTED_REQUEST) {
    return state
      .setIn(['homeOfficeWorkLog', 'isPosting'], true)
      .setIn(['homeOfficeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_HOME_OFFICE_WORK_LOG_REJECTED_SUCCESS) {
    // Fetch is required to reload home office work log list with marked work log
    return state
      .setIn(['homeOfficeWorkLog', 'data'], Immutable.fromJS(transformHomeOfficeWorkLog(payload)))
      .setIn(['homeOfficeWorkLog', 'isPosting'], false)
      .setIn(['homeOfficeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_HOME_OFFICE_WORK_LOG_REJECTED_FAILURE) {
    return state
      .setIn(['homeOfficeWorkLog', 'data'], null)
      .setIn(['homeOfficeWorkLog', 'isPosting'], false)
      .setIn(['homeOfficeWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.SUPPORT_HOME_OFFICE_WORK_LOG_REQUEST) {
    return state
      .setIn(['homeOfficeWorkLogSupport', 'isPosting'], true)
      .setIn(['homeOfficeWorkLogSupport', 'isPostingFailure'], false);
  }

  if (type === actionTypes.SUPPORT_HOME_OFFICE_WORK_LOG_SUCCESS) {
    // Fetch is required to reload home office work log list with added work log
    return state
      .setIn(['homeOfficeWorkLogSupport', 'isPosting'], false)
      .setIn(['homeOfficeWorkLogSupport', 'isPostingFailure'], false);
  }

  if (type === actionTypes.SUPPORT_HOME_OFFICE_WORK_LOG_FAILURE) {
    return state
      .setIn(['homeOfficeWorkLogSupport', 'isPosting'], false)
      .setIn(['homeOfficeWorkLogSupport', 'isPostingFailure'], true);
  }

  return state;
};
