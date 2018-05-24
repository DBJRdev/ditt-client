import Immutable from 'immutable';
import { toMomentDateTime } from '../../services/dateTimeService';
import initialState from './initialState';
import * as actionTypes from './actionTypes';

export default (state, action) => {
  if (typeof state === 'undefined') {
    return initialState;
  }

  const {
    meta,
    payload,
    type,
  } = action;

  if (type === actionTypes.ADD_WORK_LOG_REQUEST) {
    return state
      .setIn(['addWorkLog', 'isPosting'], true)
      .setIn(['addWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_WORK_LOG_SUCCESS) {
    const addWorkLogData = {
      endTime: toMomentDateTime(payload.endTime),
      id: payload.id,
      startTime: toMomentDateTime(payload.startTime),
    };

    let workLogList = state.getIn(['workLogList', 'data']);
    workLogList = workLogList.set(workLogList.size, Immutable.fromJS(addWorkLogData));

    return state
      .setIn(['workLogList', 'data'], workLogList)
      .setIn(['addWorkLog', 'data'], Immutable.fromJS(addWorkLogData))
      .setIn(['addWorkLog', 'isPosting'], false)
      .setIn(['addWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_WORK_LOG_FAILURE) {
    return state
      .setIn(['addWorkLog', 'data'], null)
      .setIn(['addWorkLog', 'isPosting'], false)
      .setIn(['addWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.DELETE_WORK_LOG_REQUEST) {
    return state
      .setIn(['deleteWorkLog', 'isPosting'], true)
      .setIn(['deleteWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_WORK_LOG_SUCCESS) {
    let workLogList = state.getIn(['workLogList', 'data']);
    workLogList = workLogList.filter(workLog => (
      workLog.get('id') !== meta.id
    ));

    return state
      .setIn(['workLogList', 'data'], workLogList)
      .setIn(['deleteWorkLog', 'isPosting'], false)
      .setIn(['deleteWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_WORK_LOG_FAILURE) {
    return state
      .setIn(['deleteWorkLog', 'isPosting'], false)
      .setIn(['deleteWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.FETCH_WORK_LOG_LIST_REQUEST) {
    return state
      .setIn(['workLogList', 'isFetching'], true)
      .setIn(['workLogList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_WORK_LOG_LIST_SUCCESS) {
    const workLogListData = payload.map(data => ({
      endTime: toMomentDateTime(data.endTime),
      id: data.id,
      startTime: toMomentDateTime(data.startTime),
    }));

    return state
      .setIn(['workLogList', 'data'], Immutable.fromJS(workLogListData))
      .setIn(['workLogList', 'isFetching'], false)
      .setIn(['workLogList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_WORK_LOG_LIST_FAILURE) {
    return state
      .setIn(['workLogList', 'data'], Immutable.fromJS([]))
      .setIn(['workLogList', 'isFetching'], false)
      .setIn(['workLogList', 'isFetchingFailure'], true);
  }

  return state;
};
