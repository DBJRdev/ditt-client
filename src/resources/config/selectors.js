import { createSelector } from 'reselect';

const getConfig = (state) => state.getIn(['config', 'config']);

export const selectConfig = createSelector([getConfig], (data) => data.get('data'));
export const selectConfigMeta = createSelector([getConfig], (data) => ({
  isFetching: data.get('isFetching'),
  isFetchingFailure: data.get('isFetchingFailure'),
  isPosting: data.get('isPosting'),
  isPostingFailure: data.get('isPostingFailure'),
}));
