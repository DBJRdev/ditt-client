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

  const filterWorkLog = (data) => ({
    date: toMomentDateTime(data.date),
    id: parseInt(data.id, 10),
  });

  if (type === actionTypes.ADD_MULTIPLE_SICK_DAY_UNPAID_WORK_LOG_REQUEST) {
    return state
      .setIn(['sickDayUnpaidWorkLog', 'isPosting'], true)
      .setIn(['sickDayUnpaidWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_MULTIPLE_SICK_DAY_UNPAID_WORK_LOG_SUCCESS) {
    // Fetch is required to reload sick day unpaid work log list with added work logs
    return state
      .setIn(['sickDayUnpaidWorkLog', 'isPosting'], false)
      .setIn(['sickDayUnpaidWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_MULTIPLE_SICK_DAY_UNPAID_WORK_LOG_FAILURE) {
    return state
      .setIn(['sickDayUnpaidWorkLog', 'isPosting'], false)
      .setIn(['sickDayUnpaidWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.DELETE_SICK_DAY_UNPAID_WORK_LOG_REQUEST) {
    return state
      .setIn(['sickDayUnpaidWorkLog', 'isPosting'], true)
      .setIn(['sickDayUnpaidWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_SICK_DAY_UNPAID_WORK_LOG_SUCCESS) {
    // Fetch is required to reload sick day unpaid work log list with deleted work log
    return state
      .setIn(['sickDayUnpaidWorkLog', 'data'], null)
      .setIn(['sickDayUnpaidWorkLog', 'isPosting'], false)
      .setIn(['sickDayUnpaidWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_SICK_DAY_UNPAID_WORK_LOG_FAILURE) {
    return state
      .setIn(['sickDayUnpaidWorkLog', 'data'], null)
      .setIn(['sickDayUnpaidWorkLog', 'isPosting'], false)
      .setIn(['sickDayUnpaidWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.FETCH_SICK_DAY_UNPAID_WORK_LOG_REQUEST) {
    return state
      .setIn(['sickDayUnpaidWorkLog', 'isFetching'], true)
      .setIn(['sickDayUnpaidWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_SICK_DAY_UNPAID_WORK_LOG_SUCCESS) {
    return state
      .setIn(['sickDayUnpaidWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
      .setIn(['sickDayUnpaidWorkLog', 'isFetching'], false)
      .setIn(['sickDayUnpaidWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_SICK_DAY_UNPAID_WORK_LOG_FAILURE) {
    return state
      .setIn(['sickDayUnpaidWorkLog', 'data'], null)
      .setIn(['sickDayUnpaidWorkLog', 'isFetching'], false)
      .setIn(['sickDayUnpaidWorkLog', 'isFetchingFailure'], true);
  }

  return state;
};
