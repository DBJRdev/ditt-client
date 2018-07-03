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

  if (type === actionTypes.LOGIN_REQUEST) {
    return state
      .setIn(['jwt', 'isPosting'], true)
      .setIn(['jwt', 'isPostingFailure'], false);
  }

  if (type === actionTypes.LOGIN_SUCCESS) {
    if (window.localStorage) {
      window.localStorage.setItem('jwt', payload.token);
    }
    return state
      .setIn(['jwt', 'isPosting'], false)
      .setIn(['jwt', 'isPostingFailure'], false)
      .setIn(['jwt', 'token'], payload.token);
  }

  if (type === actionTypes.LOGIN_FAILURE) {
    return state
      .setIn(['jwt', 'isPosting'], false)
      .setIn(['jwt', 'isPostingFailure'], true)
      .setIn(['jwt', 'token'], null);
  }

  if (type === actionTypes.LOGOUT_REQUEST) {
    return state
      .setIn(['jwt', 'isFetching'], true)
      .setIn(['jwt', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.LOGOUT_SUCCESS) {
    if (window.localStorage) {
      window.localStorage.removeItem('jwt');
    }

    return state
      .setIn(['jwt', 'isFetching'], false)
      .setIn(['jwt', 'isFetchingFailure'], false)
      .setIn(['jwt', 'token'], null);
  }

  if (type === actionTypes.LOGOUT_FAILURE) {
    return state
      .setIn(['jwt', 'isFetching'], false)
      .setIn(['jwt', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.RESET) {
    return state
      .setIn(['jwt', 'isFetching'], false)
      .setIn(['jwt', 'isFetchingFailure'], false)
      .setIn(['jwt', 'token'], null);
  }

  if (type === actionTypes.NEW_PASSWORD_REQUEST) {
    return state
      .setIn(['newPassword', 'isPosting'], true)
      .setIn(['newPassword', 'isPostingFailure'], false);
  }

  if (type === actionTypes.NEW_PASSWORD_SUCCESS) {
    return state
      .setIn(['newPassword', 'isPosting'], false)
      .setIn(['newPassword', 'isPostingFailure'], false);
  }

  if (type === actionTypes.NEW_PASSWORD_FAILURE) {
    return state
      .setIn(['newPassword', 'isPosting'], false)
      .setIn(['newPassword', 'isPostingFailure'], true);
  }

  if (type === actionTypes.RESET_PASSWORD_REQUEST) {
    return state
      .setIn(['resetPassword', 'isPosting'], true)
      .setIn(['resetPassword', 'isPostingFailure'], false);
  }

  if (type === actionTypes.RESET_PASSWORD_SUCCESS) {
    return state
      .setIn(['resetPassword', 'isPosting'], false)
      .setIn(['resetPassword', 'isPostingFailure'], false);
  }

  if (type === actionTypes.RESET_PASSWORD_FAILURE) {
    return state
      .setIn(['resetPassword', 'isPosting'], false)
      .setIn(['resetPassword', 'isPostingFailure'], true);
  }

  return state;
};
