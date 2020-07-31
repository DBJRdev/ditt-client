import Immutable from 'immutable';
import { transformOvertimeWorkLog } from './dataTransformers';
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

  if (type === actionTypes.ADD_OVERTIME_WORK_LOG_REQUEST) {
    return state
      .setIn(['overtimeWorkLog', 'isPosting'], true)
      .setIn(['overtimeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_OVERTIME_WORK_LOG_SUCCESS) {
    // Fetch is required to reload overtime work log list with added work log
    return state
      .setIn(['overtimeWorkLog', 'data'], Immutable.fromJS(transformOvertimeWorkLog(payload)))
      .setIn(['overtimeWorkLog', 'isPosting'], false)
      .setIn(['overtimeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_OVERTIME_WORK_LOG_FAILURE) {
    return state
      .setIn(['overtimeWorkLog', 'data'], null)
      .setIn(['overtimeWorkLog', 'isPosting'], false)
      .setIn(['overtimeWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.DELETE_OVERTIME_WORK_LOG_REQUEST) {
    return state
      .setIn(['overtimeWorkLog', 'isPosting'], true)
      .setIn(['overtimeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_OVERTIME_WORK_LOG_SUCCESS) {
    // Fetch is required to reload overtime work log list with deleted work log
    return state
      .setIn(['overtimeWorkLog', 'data'], null)
      .setIn(['overtimeWorkLog', 'isPosting'], false)
      .setIn(['overtimeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_OVERTIME_WORK_LOG_FAILURE) {
    return state
      .setIn(['overtimeWorkLog', 'data'], null)
      .setIn(['overtimeWorkLog', 'isPosting'], false)
      .setIn(['overtimeWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.EDIT_OVERTIME_WORK_LOG_REQUEST) {
    return state
      .setIn(['overtimeWorkLog', 'isPosting'], true)
      .setIn(['overtimeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.EDIT_OVERTIME_WORK_LOG_SUCCESS) {
    // Fetch is required to reload overtime work log list with edited work log
    return state
      .setIn(['overtimeWorkLog', 'isPosting'], false)
      .setIn(['overtimeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.EDIT_OVERTIME_WORK_LOG_FAILURE) {
    return state
      .setIn(['overtimeWorkLog', 'isPosting'], false)
      .setIn(['overtimeWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.FETCH_OVERTIME_WORK_LOG_REQUEST) {
    return state
      .setIn(['overtimeWorkLog', 'isFetching'], true)
      .setIn(['overtimeWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_OVERTIME_WORK_LOG_SUCCESS) {
    return state
      .setIn(['overtimeWorkLog', 'data'], Immutable.fromJS(transformOvertimeWorkLog(payload)))
      .setIn(['overtimeWorkLog', 'isFetching'], false)
      .setIn(['overtimeWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_OVERTIME_WORK_LOG_FAILURE) {
    return state
      .setIn(['overtimeWorkLog', 'data'], null)
      .setIn(['overtimeWorkLog', 'isFetching'], false)
      .setIn(['overtimeWorkLog', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.MARK_OVERTIME_WORK_LOG_APPROVED_REQUEST) {
    return state
      .setIn(['overtimeWorkLog', 'isPosting'], true)
      .setIn(['overtimeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_OVERTIME_WORK_LOG_APPROVED_SUCCESS) {
    // Fetch is required to reload overtime work log list with marked work log
    return state
      .setIn(['overtimeWorkLog', 'data'], Immutable.fromJS(transformOvertimeWorkLog(payload)))
      .setIn(['overtimeWorkLog', 'isPosting'], false)
      .setIn(['overtimeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_OVERTIME_WORK_LOG_APPROVED_FAILURE) {
    return state
      .setIn(['overtimeWorkLog', 'data'], null)
      .setIn(['overtimeWorkLog', 'isPosting'], false)
      .setIn(['overtimeWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.MARK_OVERTIME_WORK_LOG_REJECTED_REQUEST) {
    return state
      .setIn(['overtimeWorkLog', 'isPosting'], true)
      .setIn(['overtimeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_OVERTIME_WORK_LOG_REJECTED_SUCCESS) {
    // Fetch is required to reload overtime work log list with marked work log
    return state
      .setIn(['overtimeWorkLog', 'data'], Immutable.fromJS(transformOvertimeWorkLog(payload)))
      .setIn(['overtimeWorkLog', 'isPosting'], false)
      .setIn(['overtimeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_OVERTIME_WORK_LOG_REJECTED_FAILURE) {
    return state
      .setIn(['overtimeWorkLog', 'data'], null)
      .setIn(['overtimeWorkLog', 'isPosting'], false)
      .setIn(['overtimeWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.SUPPORT_OVERTIME_WORK_LOG_REQUEST) {
    return state
      .setIn(['overtimeWorkLogSupport', 'isPosting'], true)
      .setIn(['overtimeWorkLogSupport', 'isPostingFailure'], false);
  }

  if (type === actionTypes.SUPPORT_OVERTIME_WORK_LOG_SUCCESS) {
    // Fetch is required to reload overtime work log list with added work log
    return state
      .setIn(['overtimeWorkLogSupport', 'isPosting'], false)
      .setIn(['overtimeWorkLogSupport', 'isPostingFailure'], false);
  }

  if (type === actionTypes.SUPPORT_OVERTIME_WORK_LOG_FAILURE) {
    return state
      .setIn(['overtimeWorkLogSupport', 'isPosting'], false)
      .setIn(['overtimeWorkLogSupport', 'isPostingFailure'], true);
  }

  return state;
};
