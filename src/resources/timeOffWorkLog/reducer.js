import Immutable from 'immutable';
import { toMomentDateTime } from '../../services/dateTimeService';
import {
  STATUS_APPROVED,
  STATUS_REJECTED,
  STATUS_WAITING_FOR_APPROVAL,
} from '../workMonth';
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

  const resolveWorkLogStatus = (workLog) => {
    if (workLog.timeApproved) {
      return STATUS_APPROVED;
    }

    if (workLog.timeRejected) {
      return STATUS_REJECTED;
    }

    return STATUS_WAITING_FOR_APPROVAL;
  };

  const filterWorkLog = (data) => ({
    comment: data.comment,
    date: toMomentDateTime(data.date),
    id: parseInt(data.id, 10),
    rejectionMessage: data.rejectionMessage,
    status: resolveWorkLogStatus(data),
    timeApproved: data.timeApproved ? toMomentDateTime(data.timeApproved) : null,
    timeRejected: data.timeRejected ? toMomentDateTime(data.timeRejected) : null,
  });

  if (type === actionTypes.ADD_TIME_OFF_WORK_LOG_REQUEST) {
    return state
      .setIn(['timeOffWorkLog', 'isPosting'], true)
      .setIn(['timeOffWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_TIME_OFF_WORK_LOG_SUCCESS) {
    // Fetch is required to reload time off work log list with added work log
    return state
      .setIn(['timeOffWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
      .setIn(['timeOffWorkLog', 'isPosting'], false)
      .setIn(['timeOffWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_TIME_OFF_WORK_LOG_FAILURE) {
    return state
      .setIn(['timeOffWorkLog', 'data'], null)
      .setIn(['timeOffWorkLog', 'isPosting'], false)
      .setIn(['timeOffWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.DELETE_TIME_OFF_WORK_LOG_REQUEST) {
    return state
      .setIn(['timeOffWorkLog', 'isPosting'], true)
      .setIn(['timeOffWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_TIME_OFF_WORK_LOG_SUCCESS) {
    // Fetch is required to reload time off work log list with deleted work log
    return state
      .setIn(['timeOffWorkLog', 'data'], null)
      .setIn(['timeOffWorkLog', 'isPosting'], false)
      .setIn(['timeOffWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_TIME_OFF_WORK_LOG_FAILURE) {
    return state
      .setIn(['timeOffWorkLog', 'data'], null)
      .setIn(['timeOffWorkLog', 'isPosting'], false)
      .setIn(['timeOffWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.FETCH_TIME_OFF_WORK_LOG_REQUEST) {
    return state
      .setIn(['timeOffWorkLog', 'isFetching'], true)
      .setIn(['timeOffWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_TIME_OFF_WORK_LOG_SUCCESS) {
    return state
      .setIn(['timeOffWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
      .setIn(['timeOffWorkLog', 'isFetching'], false)
      .setIn(['timeOffWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_TIME_OFF_WORK_LOG_FAILURE) {
    return state
      .setIn(['timeOffWorkLog', 'data'], null)
      .setIn(['timeOffWorkLog', 'isFetching'], false)
      .setIn(['timeOffWorkLog', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.MARK_TIME_OFF_WORK_LOG_APPROVED_REQUEST) {
    return state
      .setIn(['timeOffWorkLog', 'isPosting'], true)
      .setIn(['timeOffWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_TIME_OFF_WORK_LOG_APPROVED_SUCCESS) {
    // Fetch is required to reload time off work log list with marked work log
    return state
      .setIn(['timeOffWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
      .setIn(['timeOffWorkLog', 'isPosting'], false)
      .setIn(['timeOffWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_TIME_OFF_WORK_LOG_APPROVED_FAILURE) {
    return state
      .setIn(['timeOffWorkLog', 'data'], null)
      .setIn(['timeOffWorkLog', 'isPosting'], false)
      .setIn(['timeOffWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.MARK_TIME_OFF_WORK_LOG_REJECTED_REQUEST) {
    return state
      .setIn(['timeOffWorkLog', 'isPosting'], true)
      .setIn(['timeOffWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_TIME_OFF_WORK_LOG_REJECTED_SUCCESS) {
    // Fetch is required to reload time off work log list with marked work log
    return state
      .setIn(['timeOffWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
      .setIn(['timeOffWorkLog', 'isPosting'], false)
      .setIn(['timeOffWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_TIME_OFF_WORK_LOG_REJECTED_FAILURE) {
    return state
      .setIn(['timeOffWorkLog', 'data'], null)
      .setIn(['timeOffWorkLog', 'isPosting'], false)
      .setIn(['timeOffWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.SUPPORT_TIME_OFF_WORK_LOG_REQUEST) {
    return state
      .setIn(['timeOffWorkLogSupport', 'isPosting'], true)
      .setIn(['timeOffWorkLogSupport', 'isPostingFailure'], false);
  }

  if (type === actionTypes.SUPPORT_TIME_OFF_WORK_LOG_SUCCESS) {
    // Fetch is required to reload time off work log list with added work log
    return state
      .setIn(['timeOffWorkLogSupport', 'isPosting'], false)
      .setIn(['timeOffWorkLogSupport', 'isPostingFailure'], false);
  }

  if (type === actionTypes.SUPPORT_TIME_OFF_WORK_LOG_FAILURE) {
    return state
      .setIn(['timeOffWorkLogSupport', 'isPosting'], false)
      .setIn(['timeOffWorkLogSupport', 'isPostingFailure'], true);
  }

  return state;
};
