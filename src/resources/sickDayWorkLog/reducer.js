import Immutable from 'immutable';
import { transformSickDayWorkLog } from './dataTransformers';
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
    type === actionTypes.ADD_SICK_DAY_WORK_LOG_REQUEST
    || type === actionTypes.ADD_MULTIPLE_SICK_DAY_WORK_LOG_REQUEST
  ) {
    return state
      .setIn(['sickDayWorkLog', 'isPosting'], true)
      .setIn(['sickDayWorkLog', 'isPostingFailure'], false);
  }

  if (
    type === actionTypes.ADD_SICK_DAY_WORK_LOG_SUCCESS
    || type === actionTypes.ADD_MULTIPLE_SICK_DAY_WORK_LOG_SUCCESS
  ) {
    // Fetch is required to reload sick day work log list with added work log
    return state
      .setIn(['sickDayWorkLog', 'isPosting'], false)
      .setIn(['sickDayWorkLog', 'isPostingFailure'], false);
  }

  if (
    type === actionTypes.ADD_SICK_DAY_WORK_LOG_FAILURE
    || type === actionTypes.ADD_MULTIPLE_SICK_DAY_WORK_LOG_FAILURE
  ) {
    return state
      .setIn(['sickDayWorkLog', 'isPosting'], false)
      .setIn(['sickDayWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.DELETE_SICK_DAY_WORK_LOG_REQUEST) {
    return state
      .setIn(['sickDayWorkLog', 'isPosting'], true)
      .setIn(['sickDayWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_SICK_DAY_WORK_LOG_SUCCESS) {
    // Fetch is required to reload sick day work log list with deleted work log
    return state
      .setIn(['sickDayWorkLog', 'data'], null)
      .setIn(['sickDayWorkLog', 'isPosting'], false)
      .setIn(['sickDayWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_SICK_DAY_WORK_LOG_FAILURE) {
    return state
      .setIn(['sickDayWorkLog', 'data'], null)
      .setIn(['sickDayWorkLog', 'isPosting'], false)
      .setIn(['sickDayWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.EDIT_SICK_DAY_WORK_LOG_REQUEST) {
    return state
      .setIn(['sickDayWorkLog', 'isPosting'], true)
      .setIn(['sickDayWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.EDIT_SICK_DAY_WORK_LOG_SUCCESS) {
    // Fetch is required to reload sick day work log list with edited work log
    return state
      .setIn(['sickDayWorkLog', 'isPosting'], false)
      .setIn(['sickDayWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.EDIT_SICK_DAY_WORK_LOG_FAILURE) {
    return state
      .setIn(['sickDayWorkLog', 'isPosting'], false)
      .setIn(['sickDayWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.FETCH_SICK_DAY_WORK_LOG_REQUEST) {
    return state
      .setIn(['sickDayWorkLog', 'isFetching'], true)
      .setIn(['sickDayWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_SICK_DAY_WORK_LOG_SUCCESS) {
    return state
      .setIn(['sickDayWorkLog', 'data'], Immutable.fromJS(transformSickDayWorkLog(payload)))
      .setIn(['sickDayWorkLog', 'isFetching'], false)
      .setIn(['sickDayWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_SICK_DAY_WORK_LOG_FAILURE) {
    return state
      .setIn(['sickDayWorkLog', 'data'], null)
      .setIn(['sickDayWorkLog', 'isFetching'], false)
      .setIn(['sickDayWorkLog', 'isFetchingFailure'], true);
  }

  return state;
};
