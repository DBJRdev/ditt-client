import Immutable from 'immutable';
import { toMomentDateTime } from '../../services/dateTimeService';
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

  if (type === actionTypes.FETCH_WORK_MONTH_REQUEST) {
    return state
      .setIn(['workMonth', 'isFetching'], true)
      .setIn(['workMonth', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_WORK_MONTH_SUCCESS) {
    const workMonthData = {
      id: payload.id,
      month: parseInt(payload.month, 10),
      status: payload.status,
      workLogs: payload.workLogs.map(workLogData => ({
        endTime: toMomentDateTime(workLogData.endTime),
        id: parseInt(workLogData.id, 10),
        startTime: toMomentDateTime(workLogData.startTime),
      })),
      year: parseInt(payload.year, 10),
    };

    return state
      .setIn(['workMonth', 'data'], Immutable.fromJS(workMonthData))
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
    const workMonthData = {
      id: payload.id,
      month: parseInt(payload.month, 10),
      status: payload.status,
      workLogs: payload.workLogs.map(workLogData => ({
        endTime: toMomentDateTime(workLogData.endTime),
        id: parseInt(workLogData.id, 10),
        startTime: toMomentDateTime(workLogData.startTime),
      })),
      year: parseInt(payload.year, 10),
    };

    return state
      .setIn(['workMonth', 'data'], Immutable.fromJS(workMonthData))
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
    const workMonthData = {
      id: payload.id,
      month: parseInt(payload.month, 10),
      status: payload.status,
      workLogs: payload.workLogs.map(workLogData => ({
        endTime: toMomentDateTime(workLogData.endTime),
        id: parseInt(workLogData.id, 10),
        startTime: toMomentDateTime(workLogData.startTime),
      })),
      year: parseInt(payload.year, 10),
    };

    return state
      .setIn(['workMonth', 'data'], Immutable.fromJS(workMonthData))
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
