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

  const filterWorkLog = data => ({
    date: toMomentDateTime(data.date),
    id: parseInt(data.id, 10),
    reason: data.reason,
    rejectionMessage: data.rejectionMessage,
    status: resolveWorkLogStatus(data),
    timeApproved: data.timeApproved ? toMomentDateTime(data.timeApproved) : null,
    timeRejected: data.timeRejected ? toMomentDateTime(data.timeRejected) : null,
  });

  if (type === actionTypes.ADD_OVERTIME_WORK_LOG_REQUEST) {
    return state
      .setIn(['overtimeWorkLog', 'isPosting'], true)
      .setIn(['overtimeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_OVERTIME_WORK_LOG_SUCCESS) {
    // Fetch is required to reload overtime work log list with added work log
    return state
      .setIn(['overtimeWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
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

  if (type === actionTypes.FETCH_OVERTIME_WORK_LOG_REQUEST) {
    return state
      .setIn(['overtimeWorkLog', 'isFetching'], true)
      .setIn(['overtimeWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_OVERTIME_WORK_LOG_SUCCESS) {
    return state
      .setIn(['overtimeWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
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
      .setIn(['overtimeWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
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
      .setIn(['overtimeWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
      .setIn(['overtimeWorkLog', 'isPosting'], false)
      .setIn(['overtimeWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_OVERTIME_WORK_LOG_REJECTED_FAILURE) {
    return state
      .setIn(['overtimeWorkLog', 'data'], null)
      .setIn(['overtimeWorkLog', 'isPosting'], false)
      .setIn(['overtimeWorkLog', 'isPostingFailure'], true);
  }

  return state;
};
