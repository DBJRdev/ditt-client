import Immutable from 'immutable';
import { transformTrainingWorkLog } from './dataTransformers';
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
    type === actionTypes.ADD_TRAINING_WORK_LOG_REQUEST
    || type === actionTypes.ADD_MULTIPLE_TRAINING_WORK_LOG_REQUEST
  ) {
    return state
      .setIn(['trainingWorkLog', 'isPosting'], true)
      .setIn(['trainingWorkLog', 'isPostingFailure'], false);
  }

  if (
    type === actionTypes.ADD_TRAINING_WORK_LOG_SUCCESS
    || type === actionTypes.ADD_MULTIPLE_TRAINING_WORK_LOG_SUCCESS
  ) {
    // Fetch is required to reload training work log list with added work log
    return state
      .setIn(['trainingWorkLog', 'isPosting'], false)
      .setIn(['trainingWorkLog', 'isPostingFailure'], false);
  }

  if (
    type === actionTypes.ADD_TRAINING_WORK_LOG_FAILURE
    || type === actionTypes.ADD_MULTIPLE_TRAINING_WORK_LOG_FAILURE
  ) {
    return state
      .setIn(['trainingWorkLog', 'isPosting'], false)
      .setIn(['trainingWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.DELETE_TRAINING_WORK_LOG_REQUEST) {
    return state
      .setIn(['trainingWorkLog', 'isPosting'], true)
      .setIn(['trainingWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_TRAINING_WORK_LOG_SUCCESS) {
    // Fetch is required to reload training  work log list with deleted work log
    return state
      .setIn(['trainingWorkLog', 'data'], null)
      .setIn(['trainingWorkLog', 'isPosting'], false)
      .setIn(['trainingWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_TRAINING_WORK_LOG_FAILURE) {
    return state
      .setIn(['trainingWorkLog', 'data'], null)
      .setIn(['trainingWorkLog', 'isPosting'], false)
      .setIn(['trainingWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.EDIT_TRAINING_WORK_LOG_REQUEST) {
    return state
      .setIn(['trainingWorkLog', 'isPosting'], true)
      .setIn(['trainingWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.EDIT_TRAINING_WORK_LOG_SUCCESS) {
    // Fetch is required to reload training work log list with edited work log
    return state
      .setIn(['trainingWorkLog', 'isPosting'], false)
      .setIn(['trainingWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.EDIT_TRAINING_WORK_LOG_FAILURE) {
    return state
      .setIn(['trainingWorkLog', 'isPosting'], false)
      .setIn(['trainingWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.FETCH_TRAINING_WORK_LOG_REQUEST) {
    return state
      .setIn(['trainingWorkLog', 'isFetching'], true)
      .setIn(['trainingWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_TRAINING_WORK_LOG_SUCCESS) {
    return state
      .setIn(['trainingWorkLog', 'data'], Immutable.fromJS(transformTrainingWorkLog(payload)))
      .setIn(['trainingWorkLog', 'isFetching'], false)
      .setIn(['trainingWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_TRAINING_WORK_LOG_FAILURE) {
    return state
      .setIn(['trainingWorkLog', 'data'], null)
      .setIn(['trainingWorkLog', 'isFetching'], false)
      .setIn(['trainingWorkLog', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.MARK_TRAINING_WORK_LOG_APPROVED_REQUEST) {
    return state
      .setIn(['trainingWorkLog', 'isPosting'], true)
      .setIn(['trainingWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_TRAINING_WORK_LOG_APPROVED_SUCCESS) {
    // Fetch is required to reload training work log list with marked work log
    return state
      .setIn(['trainingWorkLog', 'data'], Immutable.fromJS(transformTrainingWorkLog(payload)))
      .setIn(['trainingWorkLog', 'isPosting'], false)
      .setIn(['trainingWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_TRAINING_WORK_LOG_APPROVED_FAILURE) {
    return state
      .setIn(['trainingWorkLog', 'data'], null)
      .setIn(['trainingWorkLog', 'isPosting'], false)
      .setIn(['trainingWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.MARK_TRAINING_WORK_LOG_REJECTED_REQUEST) {
    return state
      .setIn(['trainingWorkLog', 'isPosting'], true)
      .setIn(['trainingWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_TRAINING_WORK_LOG_REJECTED_SUCCESS) {
    // Fetch is required to reload training work log list with marked work log
    return state
      .setIn(['trainingWorkLog', 'data'], Immutable.fromJS(transformTrainingWorkLog(payload)))
      .setIn(['trainingWorkLog', 'isPosting'], false)
      .setIn(['trainingWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_MULTIPLE_TRAINING_WORK_LOG_APPROVED_REQUEST) {
    return state
      .setIn(['trainingWorkLog', 'isPosting'], true)
      .setIn(['trainingWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_MULTIPLE_TRAINING_WORK_LOG_APPROVED_SUCCESS) {
    // Fetch is required to reload training work log list with marked work logs
    return state
      .setIn(['trainingWorkLog', 'isPosting'], false)
      .setIn(['trainingWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_MULTIPLE_TRAINING_WORK_LOG_APPROVED_FAILURE) {
    return state
      .setIn(['trainingWorkLog', 'data'], null)
      .setIn(['trainingWorkLog', 'isPosting'], false)
      .setIn(['trainingWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.MARK_MULTIPLE_TRAINING_WORK_LOG_REJECTED_REQUEST) {
    return state
      .setIn(['trainingWorkLog', 'isPosting'], true)
      .setIn(['trainingWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_MULTIPLE_TRAINING_WORK_LOG_REJECTED_SUCCESS) {
    // Fetch is required to reload training work log list with marked work logs
    return state
      .setIn(['trainingWorkLog', 'isPosting'], false)
      .setIn(['trainingWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_MULTIPLE_TRAINING_WORK_LOG_REJECTED_FAILURE) {
    return state
      .setIn(['trainingWorkLog', 'data'], null)
      .setIn(['trainingWorkLog', 'isPosting'], false)
      .setIn(['trainingWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.MARK_TRAINING_WORK_LOG_REJECTED_FAILURE) {
    return state
      .setIn(['trainingWorkLog', 'data'], null)
      .setIn(['trainingWorkLog', 'isPosting'], false)
      .setIn(['trainingWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.SUPPORT_TRAINING_WORK_LOG_REQUEST) {
    return state
      .setIn(['trainingWorkLogSupport', 'isPosting'], true)
      .setIn(['trainingWorkLogSupport', 'isPostingFailure'], false);
  }

  if (type === actionTypes.SUPPORT_TRAINING_WORK_LOG_SUCCESS) {
    // Fetch is required to reload training work log list with added work log
    return state
      .setIn(['trainingWorkLogSupport', 'isPosting'], false)
      .setIn(['trainingWorkLogSupport', 'isPostingFailure'], false);
  }

  if (type === actionTypes.SUPPORT_TRAINING_WORK_LOG_FAILURE) {
    return state
      .setIn(['trainingWorkLogSupport', 'isPosting'], false)
      .setIn(['trainingWorkLogSupport', 'isPostingFailure'], true);
  }

  return state;
};
