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

  if (
    type === actionTypes.ADD_VACATION_WORK_LOG_REQUEST
    || type === actionTypes.ADD_MULTIPLE_VACATION_WORK_LOG_REQUEST
  ) {
    return state
      .setIn(['vacationWorkLog', 'isPosting'], true)
      .setIn(['vacationWorkLog', 'isPostingFailure'], false);
  }

  if (
    type === actionTypes.ADD_VACATION_WORK_LOG_SUCCESS
    || type === actionTypes.ADD_MULTIPLE_VACATION_WORK_LOG_SUCCESS
  ) {
    // Fetch is required to reload vacation work log list with added work logs
    return state
      .setIn(['vacationWorkLog', 'isPosting'], false)
      .setIn(['vacationWorkLog', 'isPostingFailure'], false);
  }

  if (
    type === actionTypes.ADD_VACATION_WORK_LOG_FAILURE
    || type === actionTypes.ADD_MULTIPLE_VACATION_WORK_LOG_FAILURE
  ) {
    return state
      .setIn(['vacationWorkLog', 'isPosting'], false)
      .setIn(['vacationWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.DELETE_VACATION_WORK_LOG_REQUEST) {
    return state
      .setIn(['vacationWorkLog', 'isPosting'], true)
      .setIn(['vacationWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_VACATION_WORK_LOG_SUCCESS) {
    // Fetch is required to reload vacation work log list with deleted work log
    return state
      .setIn(['vacationWorkLog', 'data'], null)
      .setIn(['vacationWorkLog', 'isPosting'], false)
      .setIn(['vacationWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_VACATION_WORK_LOG_FAILURE) {
    return state
      .setIn(['vacationWorkLog', 'data'], null)
      .setIn(['vacationWorkLog', 'isPosting'], false)
      .setIn(['vacationWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.EDIT_VACATION_WORK_LOG_REQUEST) {
    return state
      .setIn(['vacationWorkLog', 'isPosting'], true)
      .setIn(['vacationWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.EDIT_VACATION_WORK_LOG_SUCCESS) {
    // Fetch is required to reload vacation work log list with edited work log
    return state
      .setIn(['vacationWorkLog', 'isPosting'], false)
      .setIn(['vacationWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.EDIT_VACATION_WORK_LOG_FAILURE) {
    return state
      .setIn(['vacationWorkLog', 'isPosting'], false)
      .setIn(['vacationWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.FETCH_VACATION_WORK_WORK_LOG_REQUEST) {
    return state
      .setIn(['vacationWorkLog', 'isFetching'], true)
      .setIn(['vacationWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_VACATION_WORK_WORK_LOG_SUCCESS) {
    return state
      .setIn(['vacationWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
      .setIn(['vacationWorkLog', 'isFetching'], false)
      .setIn(['vacationWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_VACATION_WORK_WORK_LOG_FAILURE) {
    return state
      .setIn(['vacationWorkLog', 'data'], null)
      .setIn(['vacationWorkLog', 'isFetching'], false)
      .setIn(['vacationWorkLog', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.MARK_MULTIPLE_VACATION_WORK_LOG_APPROVED_REQUEST) {
    return state
      .setIn(['vacationWorkLog', 'isPosting'], true)
      .setIn(['vacationWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_MULTIPLE_VACATION_WORK_LOG_APPROVED_SUCCESS) {
    // Fetch is required to reload vacation work log list with marked work logs
    return state
      .setIn(['vacationWorkLog', 'isPosting'], false)
      .setIn(['vacationWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_MULTIPLE_VACATION_WORK_LOG_APPROVED_FAILURE) {
    return state
      .setIn(['vacationWorkLog', 'data'], null)
      .setIn(['vacationWorkLog', 'isPosting'], false)
      .setIn(['vacationWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.MARK_MULTIPLE_VACATION_WORK_LOG_REJECTED_REQUEST) {
    return state
      .setIn(['vacationWorkLog', 'isPosting'], true)
      .setIn(['vacationWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_MULTIPLE_VACATION_WORK_LOG_REJECTED_SUCCESS) {
    // Fetch is required to reload vacation work log list with marked work logs
    return state
      .setIn(['vacationWorkLog', 'isPosting'], false)
      .setIn(['vacationWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_MULTIPLE_VACATION_WORK_LOG_REJECTED_FAILURE) {
    return state
      .setIn(['vacationWorkLog', 'data'], null)
      .setIn(['vacationWorkLog', 'isPosting'], false)
      .setIn(['vacationWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.MARK_VACATION_WORK_LOG_APPROVED_REQUEST) {
    return state
      .setIn(['vacationWorkLog', 'isPosting'], true)
      .setIn(['vacationWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_VACATION_WORK_LOG_APPROVED_SUCCESS) {
    // Fetch is required to reload vacation work log list with marked work log
    return state
      .setIn(['vacationWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
      .setIn(['vacationWorkLog', 'isPosting'], false)
      .setIn(['vacationWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_VACATION_WORK_LOG_APPROVED_FAILURE) {
    return state
      .setIn(['vacationWorkLog', 'data'], null)
      .setIn(['vacationWorkLog', 'isPosting'], false)
      .setIn(['vacationWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.MARK_VACATION_WORK_LOG_REJECTED_REQUEST) {
    return state
      .setIn(['vacationWorkLog', 'isPosting'], true)
      .setIn(['vacationWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_VACATION_WORK_LOG_REJECTED_SUCCESS) {
    // Fetch is required to reload vacation work log list with marked work log
    return state
      .setIn(['vacationWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
      .setIn(['vacationWorkLog', 'isPosting'], false)
      .setIn(['vacationWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_VACATION_WORK_LOG_REJECTED_FAILURE) {
    return state
      .setIn(['vacationWorkLog', 'data'], null)
      .setIn(['vacationWorkLog', 'isPosting'], false)
      .setIn(['vacationWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.SUPPORT_VACATION_WORK_LOG_REQUEST) {
    return state
      .setIn(['vacationWorkLogSupport', 'isPosting'], true)
      .setIn(['vacationWorkLogSupport', 'isPostingFailure'], false);
  }

  if (type === actionTypes.SUPPORT_VACATION_WORK_LOG_SUCCESS) {
    // Fetch is required to reload vacation work log list with added work log
    return state
      .setIn(['vacationWorkLogSupport', 'isPosting'], false)
      .setIn(['vacationWorkLogSupport', 'isPostingFailure'], false);
  }

  if (type === actionTypes.SUPPORT_VACATION_WORK_LOG_FAILURE) {
    return state
      .setIn(['vacationWorkLogSupport', 'isPosting'], false)
      .setIn(['vacationWorkLogSupport', 'isPostingFailure'], true);
  }

  return state;
};
