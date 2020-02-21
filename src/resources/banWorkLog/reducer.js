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
    workTimeLimit: parseInt(data.workTimeLimit, 10),
  });

  if (type === actionTypes.ADD_MULTIPLE_BAN_WORK_LOG_REQUEST) {
    return state
      .setIn(['banWorkLog', 'isPosting'], true)
      .setIn(['banWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_MULTIPLE_BAN_WORK_LOG_SUCCESS) {
    // Fetch is required to reload ban work log list with added work logs
    return state
      .setIn(['banWorkLog', 'isPosting'], false)
      .setIn(['banWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_MULTIPLE_BAN_WORK_LOG_FAILURE) {
    return state
      .setIn(['banWorkLog', 'isPosting'], false)
      .setIn(['banWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.DELETE_BAN_WORK_LOG_REQUEST) {
    return state
      .setIn(['banWorkLog', 'isPosting'], true)
      .setIn(['banWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_BAN_WORK_LOG_SUCCESS) {
    // Fetch is required to reload ban work log list with deleted work log
    return state
      .setIn(['banWorkLog', 'data'], null)
      .setIn(['banWorkLog', 'isPosting'], false)
      .setIn(['banWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_BAN_WORK_LOG_FAILURE) {
    return state
      .setIn(['banWorkLog', 'data'], null)
      .setIn(['banWorkLog', 'isPosting'], false)
      .setIn(['banWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.FETCH_BAN_WORK_LOG_REQUEST) {
    return state
      .setIn(['banWorkLog', 'isFetching'], true)
      .setIn(['banWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_BAN_WORK_LOG_SUCCESS) {
    return state
      .setIn(['banWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
      .setIn(['banWorkLog', 'isFetching'], false)
      .setIn(['banWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_BAN_WORK_LOG_FAILURE) {
    return state
      .setIn(['banWorkLog', 'data'], null)
      .setIn(['banWorkLog', 'isFetching'], false)
      .setIn(['banWorkLog', 'isFetchingFailure'], true);
  }

  return state;
};
