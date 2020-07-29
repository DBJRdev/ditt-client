import Immutable from 'immutable';
import { transformBusinessTripWorkLog } from './dataTransformers';
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
      .setIn(['businessTripWorkLog', 'isPosting'], true)
      .setIn(['businessTripWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_BUSINESS_TRIP_WORK_LOG_SUCCESS) {
    // Fetch is required to reload business trip work log list with added work log
    return state
      .setIn(['businessTripWorkLog', 'data'], Immutable.fromJS(transformBusinessTripWorkLog(payload)))
      .setIn(['businessTripWorkLog', 'isPosting'], false)
      .setIn(['businessTripWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_BUSINESS_TRIP_WORK_LOG_FAILURE) {
    return state
      .setIn(['businessTripWorkLog', 'data'], null)
      .setIn(['businessTripWorkLog', 'isPosting'], false)
      .setIn(['businessTripWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.DELETE_BUSINESS_TRIP_WORK_LOG_REQUEST) {
    return state
      .setIn(['businessTripWorkLog', 'isPosting'], true)
      .setIn(['businessTripWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_BUSINESS_TRIP_WORK_LOG_SUCCESS) {
    // Fetch is required to reload business trip  work log list with deleted work log
    return state
      .setIn(['businessTripWorkLog', 'data'], null)
      .setIn(['businessTripWorkLog', 'isPosting'], false)
      .setIn(['businessTripWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_BUSINESS_TRIP_WORK_LOG_FAILURE) {
    return state
      .setIn(['businessTripWorkLog', 'data'], null)
      .setIn(['businessTripWorkLog', 'isPosting'], false)
      .setIn(['businessTripWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.FETCH_BUSINESS_TRIP_WORK_LOG_REQUEST) {
    return state
      .setIn(['businessTripWorkLog', 'isFetching'], true)
      .setIn(['businessTripWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_BUSINESS_TRIP_WORK_LOG_SUCCESS) {
    return state
      .setIn(['businessTripWorkLog', 'data'], Immutable.fromJS(transformBusinessTripWorkLog(payload)))
      .setIn(['businessTripWorkLog', 'isFetching'], false)
      .setIn(['businessTripWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_BUSINESS_TRIP_WORK_LOG_FAILURE) {
    return state
      .setIn(['businessTripWorkLog', 'data'], null)
      .setIn(['businessTripWorkLog', 'isFetching'], false)
      .setIn(['businessTripWorkLog', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.MARK_BUSINESS_TRIP_WORK_LOG_APPROVED_REQUEST) {
    return state
      .setIn(['businessTripWorkLog', 'isPosting'], true)
      .setIn(['businessTripWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_BUSINESS_TRIP_WORK_LOG_APPROVED_SUCCESS) {
    // Fetch is required to reload business trip work log list with marked work log
    return state
      .setIn(['businessTripWorkLog', 'data'], Immutable.fromJS(transformBusinessTripWorkLog(payload)))
      .setIn(['businessTripWorkLog', 'isPosting'], false)
      .setIn(['businessTripWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_BUSINESS_TRIP_WORK_LOG_APPROVED_FAILURE) {
    return state
      .setIn(['businessTripWorkLog', 'data'], null)
      .setIn(['businessTripWorkLog', 'isPosting'], false)
      .setIn(['businessTripWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.MARK_BUSINESS_TRIP_WORK_LOG_REJECTED_REQUEST) {
    return state
      .setIn(['businessTripWorkLog', 'isPosting'], true)
      .setIn(['businessTripWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_BUSINESS_TRIP_WORK_LOG_REJECTED_SUCCESS) {
    // Fetch is required to reload business trip work log list with marked work log
    return state
      .setIn(['businessTripWorkLog', 'data'], Immutable.fromJS(transformBusinessTripWorkLog(payload)))
      .setIn(['businessTripWorkLog', 'isPosting'], false)
      .setIn(['businessTripWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_BUSINESS_TRIP_WORK_LOG_REJECTED_FAILURE) {
    return state
      .setIn(['businessTripWorkLog', 'data'], null)
      .setIn(['businessTripWorkLog', 'isPosting'], false)
      .setIn(['businessTripWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.SUPPORT_BUSINESS_TRIP_WORK_LOG_REQUEST) {
    return state
      .setIn(['businessTripWorkLogSupport', 'isPosting'], true)
      .setIn(['businessTripWorkLogSupport', 'isPostingFailure'], false);
  }

  if (type === actionTypes.SUPPORT_BUSINESS_TRIP_WORK_LOG_SUCCESS) {
    // Fetch is required to reload business trip work log list with added work log
    return state
      .setIn(['businessTripWorkLogSupport', 'isPosting'], false)
      .setIn(['businessTripWorkLogSupport', 'isPostingFailure'], false);
  }

  if (type === actionTypes.SUPPORT_BUSINESS_TRIP_WORK_LOG_FAILURE) {
    return state
      .setIn(['businessTripWorkLogSupport', 'isPosting'], false)
      .setIn(['businessTripWorkLogSupport', 'isPostingFailure'], true);
  }

  return state;
};
