import Immutable from 'immutable';
import initialState from './initialState';
import * as actionTypes from './actionTypes';
import { transformVacation } from './dataTransformers';

export default (state, action) => {
  if (typeof state === 'undefined') {
    return initialState;
  }

  const {
    payload,
    type,
  } = action;

  if (type === actionTypes.FETCH_VACATION_LIST_REQUEST) {
    return state
      .setIn(['vacationList', 'isFetching'], true)
      .setIn(['vacationList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_VACATION_LIST_SUCCESS) {
    return state
      .setIn(['vacationList', 'data'], Immutable.fromJS(payload.map(transformVacation)))
      .setIn(['vacationList', 'isFetching'], false)
      .setIn(['vacationList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_VACATION_LIST_FAILURE) {
    return state
      .setIn(['vacationList', 'data'], Immutable.fromJS([]))
      .setIn(['vacationList', 'isFetching'], false)
      .setIn(['vacationList', 'isFetchingFailure'], true);
  }

  return state;
};
