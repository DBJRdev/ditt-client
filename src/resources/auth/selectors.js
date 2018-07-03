import { createSelector } from 'reselect';

const getJwt = state => state.getIn(['auth', 'jwt']);
const getNewPassword = state => state.getIn(['auth', 'newPassword']);
const getResetPassword = state => state.getIn(['auth', 'resetPassword']);

export const selectJwtToken = createSelector([getJwt], data => data.get('token'));
export const selectJwtMeta = createSelector([getJwt], data => ({
  isPosting: data.get('isPosting'),
  isPostingFailure: data.get('isPostingFailure'),
}));

export const selectNewPasswordMeta = createSelector([getNewPassword], data => ({
  isPosting: data.get('isPosting'),
  isPostingFailure: data.get('isPostingFailure'),
}));

export const selectResetPasswordMeta = createSelector([getResetPassword], data => ({
  isPosting: data.get('isPosting'),
  isPostingFailure: data.get('isPostingFailure'),
}));
