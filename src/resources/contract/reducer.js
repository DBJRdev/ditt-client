import Immutable from 'immutable';
import initialState from './initialState';
import * as actionTypes from './actionTypes';
import { transformContract } from './dataTransformers';

export default (state, action) => {
  if (typeof state === 'undefined') {
    return initialState;
  }

  const {
    payload,
    type,
  } = action;

  if (type === actionTypes.FETCH_CONTRACT_LIST_REQUEST) {
    return state
      .setIn(['contractList', 'isFetching'], true)
      .setIn(['contractList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_CONTRACT_LIST_SUCCESS) {
    return state
      .setIn(['contractList', 'data'], Immutable.fromJS(payload.map(transformContract)))
      .setIn(['contractList', 'isFetching'], false)
      .setIn(['contractList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_CONTRACT_LIST_FAILURE) {
    return state
      .setIn(['contractList', 'data'], Immutable.fromJS([]))
      .setIn(['contractList', 'isFetching'], false)
      .setIn(['contractList', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.TERMINATE_CONTRACT_REQUEST) {
    return state
      .setIn(['contract', 'isPosting'], true)
      .setIn(['contract', 'isPostingFailure'], false);
  }

  if (type === actionTypes.TERMINATE_CONTRACT_SUCCESS) {
    return state
      .setIn(['contract', 'isPosting'], false)
      .setIn(['contract', 'isPostingFailure'], false);
  }

  if (type === actionTypes.TERMINATE_CONTRACT_FAILURE) {
    return state
      .setIn(['contract', 'isPosting'], false)
      .setIn(['contract', 'isPostingFailure'], true);
  }

  return state;
};
