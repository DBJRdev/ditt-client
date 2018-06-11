import Immutable from 'immutable';
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

  if (type === actionTypes.ADD_USER_REQUEST) {
    return state
      .setIn(['addUser', 'isPosting'], true)
      .setIn(['addUser', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_USER_SUCCESS) {
    let userList = state.getIn(['userList', 'data']);
    userList = userList.set(userList.size, Immutable.fromJS(payload));

    return state
      .setIn(['userList', 'data'], userList)
      .setIn(['addUser', 'data'], Immutable.fromJS(payload))
      .setIn(['addUser', 'isPosting'], false)
      .setIn(['addUser', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_USER_FAILURE) {
    return state
      .setIn(['addUser', 'data'], null)
      .setIn(['addUser', 'isPosting'], false)
      .setIn(['addUser', 'isPostingFailure'], true);
  }

  if (type === actionTypes.DELETE_USER_REQUEST) {
    return state
      .setIn(['deleteUser', 'isPosting'], true)
      .setIn(['deleteUser', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_USER_SUCCESS) {
    let userList = state.getIn(['userList', 'data']);
    userList = userList.filter(user => (
      user.get('id') !== meta.id
    ));

    return state
      .setIn(['userList', 'data'], userList)
      .setIn(['deleteUser', 'isPosting'], false)
      .setIn(['deleteUser', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_USER_FAILURE) {
    return state
      .setIn(['deleteUser', 'isPosting'], false)
      .setIn(['deleteUser', 'isPostingFailure'], true);
  }

  if (type === actionTypes.EDIT_USER_REQUEST) {
    return state
      .setIn(['editUser', 'isPosting'], true)
      .setIn(['editUser', 'isPostingFailure'], false);
  }

  if (type === actionTypes.EDIT_USER_SUCCESS) {
    let userList = state.getIn(['userList', 'data']);
    userList = userList.map((user) => {
      if (user.get('id') !== meta.id) {
        return user;
      }

      return Immutable.fromJS(payload);
    });

    return state
      .setIn(['userList', 'data'], userList)
      .setIn(['editUser', 'data'], Immutable.fromJS(payload))
      .setIn(['editUser', 'isPosting'], false)
      .setIn(['editUser', 'isPostingFailure'], false);
  }

  if (type === actionTypes.EDIT_USER_FAILURE) {
    return state
      .setIn(['editUser', 'data'], null)
      .setIn(['editUser', 'isPosting'], false)
      .setIn(['editUser', 'isPostingFailure'], true);
  }

  if (type === actionTypes.FETCH_SUPERVISED_USER_LIST_REQUEST) {
    return state
      .setIn(['supervisedUserList', 'isFetching'], true)
      .setIn(['supervisedUserList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_SUPERVISED_USER_LIST_SUCCESS) {
    return state
      .setIn(['supervisedUserList', 'data'], Immutable.fromJS(payload))
      .setIn(['supervisedUserList', 'isFetching'], false)
      .setIn(['supervisedUserList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_SUPERVISED_USER_LIST_FAILURE) {
    return state
      .setIn(['supervisedUserList', 'data'], Immutable.fromJS([]))
      .setIn(['supervisedUserList', 'isFetching'], false)
      .setIn(['supervisedUserList', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.FETCH_USER_REQUEST) {
    return state
      .setIn(['user', 'isFetching'], true)
      .setIn(['user', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_USER_SUCCESS) {
    return state
      .setIn(['user', 'data'], Immutable.fromJS(payload))
      .setIn(['user', 'isFetching'], false)
      .setIn(['user', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_USER_FAILURE) {
    return state
      .setIn(['user', 'data'], null)
      .setIn(['user', 'isFetching'], false)
      .setIn(['user', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.FETCH_USER_LIST_REQUEST) {
    return state
      .setIn(['userList', 'isFetching'], true)
      .setIn(['userList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_USER_LIST_SUCCESS) {
    return state
      .setIn(['userList', 'data'], Immutable.fromJS(payload))
      .setIn(['userList', 'isFetching'], false)
      .setIn(['userList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_USER_LIST_FAILURE) {
    return state
      .setIn(['userList', 'data'], Immutable.fromJS([]))
      .setIn(['userList', 'isFetching'], false)
      .setIn(['userList', 'isFetchingFailure'], true);
  }

  return state;
};
