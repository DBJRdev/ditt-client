import { createSelector } from 'reselect';

const getAddUser = (state) => state.getIn(['user', 'addUser']);
const getArchiveUser = (state) => state.getIn(['user', 'archiveUser']);
const getDeleteUser = (state) => state.getIn(['user', 'deleteUser']);
const getEditUser = (state) => state.getIn(['user', 'editUser']);
const getSupervisedUserList = (state) => state.getIn(['user', 'supervisedUserList']);
const getUser = (state) => state.getIn(['user', 'user']);
const geUserList = (state) => state.getIn(['user', 'userList']);
const geUserListPartial = (state) => state.getIn(['user', 'userListPartial']);
const getUnarchiveUser = (state) => state.getIn(['user', 'unarchiveUser']);

export const selectAddUser = createSelector([getAddUser], (data) => data.get('data'));
export const selectAddUserMeta = createSelector([getAddUser], (data) => ({
  isPosting: data.get('isPosting'),
  isPostingFailure: data.get('isPostingFailure'),
}));

export const selectArchiveUserMeta = createSelector([getArchiveUser], (data) => ({
  isPosting: data.get('isPosting'),
  isPostingFailure: data.get('isPostingFailure'),
}));

export const selectDeleteUserMeta = createSelector([getDeleteUser], (data) => ({
  isPosting: data.get('isPosting'),
  isPostingFailure: data.get('isPostingFailure'),
}));

export const selectEditUser = createSelector([getEditUser], (data) => data.get('data'));
export const selectEditUserMeta = createSelector([getEditUser], (data) => ({
  isPosting: data.get('isPosting'),
  isPostingFailure: data.get('isPostingFailure'),
}));

export const selectSupervisedUserList = createSelector([getSupervisedUserList], (data) => data.get('data'));
export const selectSupervisedUserListMeta = createSelector([getSupervisedUserList], (data) => ({
  isFetching: data.get('isFetching'),
  isFetchingFailure: data.get('isFetchingFailure'),
}));

export const selectUnarchiveUserMeta = createSelector([getUnarchiveUser], (data) => ({
  isPosting: data.get('isPosting'),
  isPostingFailure: data.get('isPostingFailure'),
}));

export const selectUser = createSelector([getUser], (data) => data.get('data'));
export const selectUserMeta = createSelector([getUser], (data) => ({
  isFetching: data.get('isFetching'),
  isFetchingFailure: data.get('isFetchingFailure'),
  isPosting: data.get('isPosting'),
  isPostingFailure: data.get('isPostingFailure'),
}));

export const selectUserList = createSelector([geUserList], (data) => data.get('data'));
export const selectUserListMeta = createSelector([geUserList], (data) => ({
  isFetching: data.get('isFetching'),
  isFetchingFailure: data.get('isFetchingFailure'),
}));

export const selectUserListPartial = createSelector([geUserListPartial], (data) => data.get('data'));
export const selectUserListPartialMeta = createSelector([geUserListPartial], (data) => ({
  isFetching: data.get('isFetching'),
  isFetchingFailure: data.get('isFetchingFailure'),
}));
