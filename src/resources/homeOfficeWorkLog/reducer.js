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

  if (type === actionTypes.ADD_HOME_OFFICE_WORK_LOG_REQUEST) {
    return state
      .setIn(['homeOfficeWorkLog', 'isPosting'], true)
      .setIn(['homeOfficeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_HOME_OFFICE_WORK_LOG_SUCCESS) {
    // Fetch is required to reload home office work log list with added work log
    return state
      .setIn(['homeOfficeWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
      .setIn(['homeOfficeWorkLog', 'isPosting'], false)
      .setIn(['homeOfficeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_HOME_OFFICE_WORK_LOG_FAILURE) {
    return state
      .setIn(['homeOfficeWorkLog', 'data'], null)
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
      .setIn(['homeOfficeWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
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
      .setIn(['homeOfficeWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
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
      .setIn(['homeOfficeWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
      .setIn(['homeOfficeWorkLog', 'isPosting'], false)
      .setIn(['homeOfficeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_HOME_OFFICE_WORK_LOG_REJECTED_FAILURE) {
    return state
      .setIn(['homeOfficeWorkLog', 'data'], null)
      .setIn(['homeOfficeWorkLog', 'isPosting'], false)
      .setIn(['homeOfficeWorkLog', 'isPostingFailure'], true);
  }

  return state;
};
