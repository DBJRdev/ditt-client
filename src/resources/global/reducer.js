import Immutable from 'immutable';
import * as actionTypes from './actionTypes';
import initialState from './initialState';

export default (state, action) => {
  if (typeof state === 'undefined') {
    return initialState;
  }

  const {
    payload,
    type,
  } = action;

  if (type === actionTypes.FETCH_DATA_REQUEST) {
    return state
      .setIn(['data', 'isFetching'], true)
      .setIn(['data', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_DATA_SUCCESS) {
    return state
      .setIn(['data', 'data'], Immutable.fromJS(payload))
      .setIn(['data', 'isFetching'], false)
      .setIn(['data', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_DATA_FAILURE) {
    return state
      .setIn(['data', 'data'])
      .setIn(['data', 'isFetching'], false)
      .setIn(['data', 'isFetchingFailure'], true);
  }

  return state;
};
