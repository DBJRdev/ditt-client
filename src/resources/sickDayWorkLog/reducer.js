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

  const filterWorkLog = data => ({
    childDateOfBirth: data.childDateOfBirth ? toMomentDateTime(data.childDateOfBirth) : null,
    childName: data.childName,
    date: toMomentDateTime(data.date),
    id: parseInt(data.id, 10),
    variant: data.variant,
  });

  if (type === actionTypes.ADD_SICK_DAY_WORK_LOG_REQUEST) {
    return state
      .setIn(['sickDayWorkLog', 'isPosting'], true)
      .setIn(['sickDayWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_SICK_DAY_WORK_LOG_SUCCESS) {
    // Fetch is required to reload sick day work log list with added work log
    return state
      .setIn(['sickDayWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
      .setIn(['sickDayWorkLog', 'isPosting'], false)
      .setIn(['sickDayWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_SICK_DAY_WORK_LOG_FAILURE) {
    return state
      .setIn(['sickDayWorkLog', 'data'], null)
      .setIn(['sickDayWorkLog', 'isPosting'], false)
      .setIn(['sickDayWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.DELETE_SICK_DAY_WORK_LOG_REQUEST) {
    return state
      .setIn(['sickDayWorkLog', 'isPosting'], true)
      .setIn(['sickDayWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_SICK_DAY_WORK_LOG_SUCCESS) {
    // Fetch is required to reload sick day work log list with deleted work log
    return state
      .setIn(['sickDayWorkLog', 'data'], null)
      .setIn(['sickDayWorkLog', 'isPosting'], false)
      .setIn(['sickDayWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_SICK_DAY_WORK_LOG_FAILURE) {
    return state
      .setIn(['sickDayWorkLog', 'data'], null)
      .setIn(['sickDayWorkLog', 'isPosting'], false)
      .setIn(['sickDayWorkLog', 'isPostingFailure'], true);
  }

  return state;
};
