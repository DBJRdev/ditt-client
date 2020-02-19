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

  if (type === actionTypes.ADD_MULTIPLE_MATERNITY_PROTECTION_WORK_LOG_REQUEST) {
    return state
      .setIn(['maternityProtectionWorkLog', 'isPosting'], true)
      .setIn(['maternityProtectionWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_MULTIPLE_MATERNITY_PROTECTION_WORK_LOG_SUCCESS) {
    // Fetch is required to reload maternity protection work log list with added work logs
    return state
      .setIn(['maternityProtectionWorkLog', 'isPosting'], false)
      .setIn(['maternityProtectionWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_MULTIPLE_MATERNITY_PROTECTION_WORK_LOG_FAILURE) {
    return state
      .setIn(['maternityProtectionWorkLog', 'isPosting'], false)
      .setIn(['maternityProtectionWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.DELETE_MATERNITY_PROTECTION_WORK_LOG_REQUEST) {
    return state
      .setIn(['maternityProtectionWorkLog', 'isPosting'], true)
      .setIn(['maternityProtectionWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_MATERNITY_PROTECTION_WORK_LOG_SUCCESS) {
    // Fetch is required to reload maternity protection work log list with deleted work log
    return state
      .setIn(['maternityProtectionWorkLog', 'data'], null)
      .setIn(['maternityProtectionWorkLog', 'isPosting'], false)
      .setIn(['maternityProtectionWorkLog', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_MATERNITY_PROTECTION_WORK_LOG_FAILURE) {
    return state
      .setIn(['maternityProtectionWorkLog', 'data'], null)
      .setIn(['maternityProtectionWorkLog', 'isPosting'], false)
      .setIn(['maternityProtectionWorkLog', 'isPostingFailure'], true);
  }

  if (type === actionTypes.FETCH_MATERNITY_PROTECTION_WORK_LOG_REQUEST) {
    return state
      .setIn(['maternityProtectionWorkLog', 'isFetching'], true)
      .setIn(['maternityProtectionWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_MATERNITY_PROTECTION_WORK_LOG_SUCCESS) {
    return state
      .setIn(['maternityProtectionWorkLog', 'data'], Immutable.fromJS(filterWorkLog(payload)))
      .setIn(['maternityProtectionWorkLog', 'isFetching'], false)
      .setIn(['maternityProtectionWorkLog', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_MATERNITY_PROTECTION_WORK_LOG_FAILURE) {
    return state
      .setIn(['maternityProtectionWorkLog', 'data'], null)
      .setIn(['maternityProtectionWorkLog', 'isFetching'], false)
      .setIn(['maternityProtectionWorkLog', 'isFetchingFailure'], true);
  }

  return state;
};
