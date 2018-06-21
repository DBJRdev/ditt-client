import Immutable from 'immutable';
import { toMomentDateTime } from '../../services/dateTimeService';
import {
  STATUS_APPROVED,
  STATUS_REJECTED,
  STATUS_WAITING_FOR_APPROVAL,
} from './constants';
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

  const filterWorkMonth = date => ({
    businessTripWorkLogs: date.businessTripWorkLogs.map(businessTripWorkLogsData => ({
      data: toMomentDateTime(businessTripWorkLogsData.data),
      id: parseInt(businessTripWorkLogsData.id, 10),
      status: resolveWorkLogStatus(businessTripWorkLogsData),
    })),
    homeOfficeWorkLogs: date.homeOfficeWorkLogs.map(homeOfficeWorkLogsData => ({
      data: toMomentDateTime(homeOfficeWorkLogsData.data),
      id: parseInt(homeOfficeWorkLogsData.id, 10),
      status: resolveWorkLogStatus(homeOfficeWorkLogsData),
    })),
    id: date.id,
    month: parseInt(date.month, 10),
    status: date.status,
    timeOffWorkLogs: date.timeOffWorkLogs.map(timeOffWorkLogsData => ({
      data: toMomentDateTime(timeOffWorkLogsData.data),
      id: parseInt(timeOffWorkLogsData.id, 10),
      status: resolveWorkLogStatus(timeOffWorkLogsData),
    })),
    workLogs: date.workLogs.map(workLogData => ({
      endTime: toMomentDateTime(workLogData.endTime),
      id: parseInt(workLogData.id, 10),
      startTime: toMomentDateTime(workLogData.startTime),
    })),
    year: parseInt(date.year, 10),
  });

  if (type === actionTypes.FETCH_WORK_MONTH_REQUEST) {
    return state
      .setIn(['workMonth', 'isFetching'], true)
      .setIn(['workMonth', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_WORK_MONTH_SUCCESS) {
    return state
      .setIn(['workMonth', 'data'], Immutable.fromJS(filterWorkMonth(payload)))
      .setIn(['workMonth', 'isFetching'], false)
      .setIn(['workMonth', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_WORK_MONTH_FAILURE) {
    return state
      .setIn(['workMonth', 'data'], null)
      .setIn(['workMonth', 'isFetching'], false)
      .setIn(['workMonth', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.FETCH_WORK_MONTH_LIST_REQUEST) {
    return state
      .setIn(['workMonthList', 'isFetching'], true)
      .setIn(['workMonthList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_WORK_MONTH_LIST_SUCCESS) {
    return state
      .setIn(['workMonthList', 'data'], Immutable.fromJS(payload))
      .setIn(['workMonthList', 'isFetching'], false)
      .setIn(['workMonthList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_WORK_MONTH_LIST_FAILURE) {
    return state
      .setIn(['workMonthList', 'data'], Immutable.fromJS([]))
      .setIn(['workMonthList', 'isFetching'], false)
      .setIn(['workMonthList', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.MARK_WORK_MONTH_APPROVED_REQUEST) {
    return state
      .setIn(['workMonth', 'isPosting'], true)
      .setIn(['workMonth', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_WORK_MONTH_APPROVED_SUCCESS) {
    return state
      .setIn(['workMonth', 'data'], Immutable.fromJS(filterWorkMonth(payload)))
      .setIn(['workMonth', 'isPosting'], false)
      .setIn(['workMonth', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_WORK_MONTH_APPROVED_FAILURE) {
    return state
      .setIn(['workMonth', 'isPosting'], false)
      .setIn(['workMonth', 'isPostingFailure'], true);
  }

  if (type === actionTypes.MARK_WORK_MONTH_WAITING_FOR_APPROVAL_REQUEST) {
    return state
      .setIn(['workMonth', 'isPosting'], true)
      .setIn(['workMonth', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_WORK_MONTH_WAITING_FOR_APPROVAL_SUCCESS) {
    return state
      .setIn(['workMonth', 'data'], Immutable.fromJS(filterWorkMonth(payload)))
      .setIn(['workMonth', 'isPosting'], false)
      .setIn(['workMonth', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_WORK_MONTH_WAITING_FOR_APPROVAL_FAILURE) {
    return state
      .setIn(['workMonth', 'isPosting'], false)
      .setIn(['workMonth', 'isPostingFailure'], true);
  }

  return state;
};
