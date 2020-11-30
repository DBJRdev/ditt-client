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
      .setIn(['jwt', 'token'], null)
      .set('lastRequestBrowserTime', null);
  }

  if (type === actionTypes.LOGOUT_FAILURE) {
    return state
      .setIn(['jwt', 'isFetching'], false)
      .setIn(['jwt', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.REFRESH_TOKEN_SUCCESS) {
    if (window.localStorage) {
      window.localStorage.setItem('jwt', payload.token);
    }

    return state.setIn(['jwt', 'token'], payload.token);
  }

  if (type === actionTypes.SET_LAST_REQUEST_BROWSER_TIME) {
    return state.set('lastRequestBrowserTime', payload);
  }

  if (type === actionTypes.SET_LOGOUT_LOCALLY) {
    if (window.localStorage) {
      window.localStorage.removeItem('jwt');
    }

    return state
      .setIn(['jwt', 'isFetching'], false)
      .setIn(['jwt', 'isFetchingFailure'], false)
      .setIn(['jwt', 'token'], null)
      .set('isLoggedOutLocally', true)
      .set('lastRequestBrowserTime', null);
  }

  if (type === actionTypes.RESET_LOGOUT_LOCALLY) {
    return state.set('isLoggedOutLocally', false);
  }

  if (type === actionTypes.RESET) {
    return state
      .setIn(['jwt', 'isFetching'], false)
      .setIn(['jwt', 'isFetchingFailure'], false)
      .setIn(['jwt', 'token'], null)
      .set('lastRequestBrowserTime', null);
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

  if (type === actionTypes.SET_NEW_PASSWORD_REQUEST) {
    return state
      .setIn(['setNewPassword', 'isPosting'], true)
      .setIn(['setNewPassword', 'isPostingFailure'], false);
  }

  if (type === actionTypes.SET_NEW_PASSWORD_SUCCESS) {
    return state
      .setIn(['setNewPassword', 'isPosting'], false)
      .setIn(['setNewPassword', 'isPostingFailure'], false);
  }

  if (type === actionTypes.SET_NEW_PASSWORD_FAILURE) {
    return state
      .setIn(['setNewPassword', 'isPosting'], false)
      .setIn(['setNewPassword', 'isPostingFailure'], true);
  }

  return state;
};
