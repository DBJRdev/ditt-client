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
    destination: data.destination,
    expectedArrival: data.expectedArrival,
    expectedDeparture: data.expectedDeparture,
    id: parseInt(data.id, 10),
    purpose: data.purpose,
    rejectionMessage: data.rejectionMessage,
    status: resolveWorkLogStatus(data),
    timeApproved: data.timeApproved ? toMomentDateTime(data.timeApproved) : null,
    timeRejected: data.timeRejected ? toMomentDateTime(data.timeRejected) : null,
    transport: data.transport,
  });

  if (type === actionTypes.ADD_BUSINESS_TRIP_WORK_LOG_REQUEST) {
    return state
      .setIn(['businessTripWorkLog', 'isPosting'], true)
      .setIn(['businessTripWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_BUSINESS_TRIP_WORK_LOG_SUCCESS) {
    // Fetch is required to reload business trip work log list with added work log
    return state
      .setIn(['businessTripWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
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
      .setIn(['businessTripWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
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
      .setIn(['businessTripWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
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
      .setIn(['businessTripWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
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
