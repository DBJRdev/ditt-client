import { createSelector } from 'reselect';

const getJwt = state => state.getIn(['auth', 'jwt']);

export const selectJwtToken = createSelector([getJwt], data => data.get('token'));
export const selectJwtMeta = createSelector([getJwt], data => ({
  isPosting: data.get('isPosting'),
  isPostingFailure: data.get('isPostingFailure'),
}));
