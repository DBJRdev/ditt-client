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
    date: toMomentDateTime(data.date),
    id: parseInt(data.id, 10),
    rejectionMessage: data.rejectionMessage,
    status: resolveWorkLogStatus(data),
    timeApproved: data.timeApproved ? toMomentDateTime(data.timeApproved) : null,
    timeRejected: data.timeRejected ? toMomentDateTime(data.timeRejected) : null,
  });

  if (type === actionTypes.ADD_MULTIPLE_SPECIAL_LEAVE_WORK_LOG_REQUEST) {
    return state
      .setIn(['specialLeaveWorkLog', 'isPosting'], true)
      .setIn(['specialLeaveWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_MULTIPLE_SPECIAL_LEAVE_WORK_LOG_SUCCESS) {
    // Fetch is required to reload special leave work log list with added work logs
    return state
      .setIn(['specialLeaveWorkLog', 'isPosting'], false)
      .setIn(['specialLeaveWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_MULTIPLE_SPECIAL_LEAVE_WORK_LOG_FAILURE) {
    return state
      .setIn(['specialLeaveWorkLog', 'isPosting'], false)
      .setIn(['specialLeaveWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.ADD_SPECIAL_LEAVE_WORK_LOG_REQUEST) {
    return state
      .setIn(['specialLeaveWorkLog', 'isPosting'], true)
      .setIn(['specialLeaveWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_SPECIAL_LEAVE_WORK_LOG_SUCCESS) {
    // Fetch is required to reload special leave work log list with deleted work log
    return state
      .setIn(['specialLeaveWorkLog', 'data'], null)
      .setIn(['specialLeaveWorkLog', 'isPosting'], false)
      .setIn(['specialLeaveWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_SPECIAL_LEAVE_WORK_LOG_FAILURE) {
    return state
      .setIn(['specialLeaveWorkLog', 'data'], null)
      .setIn(['specialLeaveWorkLog', 'isPosting'], false)
      .setIn(['specialLeaveWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.FETCH_VACATION_WORK_LOG_REQUEST) {
    return state
      .setIn(['specialLeaveWorkLog', 'isFetching'], true)
      .setIn(['specialLeaveWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_VACATION_WORK_LOG_SUCCESS) {
    return state
      .setIn(['specialLeaveWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
      .setIn(['specialLeaveWorkLog', 'isFetching'], false)
      .setIn(['specialLeaveWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_VACATION_WORK_LOG_FAILURE) {
    return state
      .setIn(['specialLeaveWorkLog', 'data'], null)
      .setIn(['specialLeaveWorkLog', 'isFetching'], false)
      .setIn(['specialLeaveWorkLog', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.MARK_MULTIPLE_SPECIAL_LEAVE_WORK_LOG_APPROVED_REQUEST) {
    return state
      .setIn(['specialLeaveWorkLog', 'isPosting'], true)
      .setIn(['specialLeaveWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_MULTIPLE_SPECIAL_LEAVE_WORK_LOG_APPROVED_SUCCESS) {
    // Fetch is required to reload special leave work log list with marked work logs
    return state
      .setIn(['specialLeaveWorkLog', 'isPosting'], false)
      .setIn(['specialLeaveWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_MULTIPLE_SPECIAL_LEAVE_WORK_LOG_APPROVED_FAILURE) {
    return state
      .setIn(['specialLeaveWorkLog', 'data'], null)
      .setIn(['specialLeaveWorkLog', 'isPosting'], false)
      .setIn(['specialLeaveWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.MARK_MULTIPLE_SPECIAL_LEAVE_WORK_LOG_REJECTED_REQUEST) {
    return state
      .setIn(['specialLeaveWorkLog', 'isPosting'], true)
      .setIn(['specialLeaveWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_MULTIPLE_SPECIAL_LEAVE_WORK_LOG_REJECTED_SUCCESS) {
    // Fetch is required to reload special leave work log list with marked work logs
    return state
      .setIn(['specialLeaveWorkLog', 'isPosting'], false)
      .setIn(['specialLeaveWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_MULTIPLE_SPECIAL_LEAVE_WORK_LOG_REJECTED_FAILURE) {
    return state
      .setIn(['specialLeaveWorkLog', 'data'], null)
      .setIn(['specialLeaveWorkLog', 'isPosting'], false)
      .setIn(['specialLeaveWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.MARK_SPECIAL_LEAVE_WORK_LOG_APPROVED_REQUEST) {
    return state
      .setIn(['specialLeaveWorkLog', 'isPosting'], true)
      .setIn(['specialLeaveWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_SPECIAL_LEAVE_WORK_LOG_APPROVED_SUCCESS) {
    // Fetch is required to reload special leave work log list with marked work log
    return state
      .setIn(['specialLeaveWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
      .setIn(['specialLeaveWorkLog', 'isPosting'], false)
      .setIn(['specialLeaveWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_SPECIAL_LEAVE_WORK_LOG_APPROVED_FAILURE) {
    return state
      .setIn(['specialLeaveWorkLog', 'data'], null)
      .setIn(['specialLeaveWorkLog', 'isPosting'], false)
      .setIn(['specialLeaveWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.MARK_SPECIAL_LEAVE_WORK_LOG_REJECTED_REQUEST) {
    return state
      .setIn(['specialLeaveWorkLog', 'isPosting'], true)
      .setIn(['specialLeaveWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_SPECIAL_LEAVE_WORK_LOG_REJECTED_SUCCESS) {
    // Fetch is required to reload special leave work log list with marked work log
    return state
      .setIn(['specialLeaveWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
      .setIn(['specialLeaveWorkLog', 'isPosting'], false)
      .setIn(['specialLeaveWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_SPECIAL_LEAVE_WORK_LOG_REJECTED_FAILURE) {
    return state
      .setIn(['specialLeaveWorkLog', 'data'], null)
      .setIn(['specialLeaveWorkLog', 'isPosting'], false)
      .setIn(['specialLeaveWorkLog', 'isPostingFailure'], true);
  }

  return state;
};
