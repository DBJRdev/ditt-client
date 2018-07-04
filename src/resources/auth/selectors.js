import { createSelector } from 'reselect';

const getJwt = state => state.getIn(['auth', 'jwt']);
const getResetPassword = state => state.getIn(['auth', 'resetPassword']);
const getSetNewPassword = state => state.getIn(['auth', 'setNewPassword']);

export const selectJwtToken = createSelector([getJwt], data => data.get('token'));
export const selectJwtMeta = createSelector([getJwt], data => ({
  isPosting: data.get('isPosting'),
  isPostingFailure: data.get('isPostingFailure'),
}));

export const selectResetPasswordMeta = createSelector([getResetPassword], data => ({
  isPosting: data.get('isPosting'),
  isPostingFailure: data.get('isPostingFailure'),
}));

export const selectSetNewPasswordMeta = createSelector([getSetNewPassword], data => ({
  isPosting: data.get('isPosting'),
  isPostingFailure: data.get('isPostingFailure'),
}));
