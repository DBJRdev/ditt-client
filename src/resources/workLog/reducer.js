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
      .setIn(['workLogList', 'data'])
      .setIn(['workLogList', 'isFetching'], false)
      .setIn(['workLogList', 'isFetchingFailure'], true);
  }

  return state;
};
