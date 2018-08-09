import { createSelector } from 'reselect';

const getHomeOfficeWorkLog = state => state.getIn(['homeOfficeWorkLog', 'homeOfficeWorkLog']);

export const selectHomeOfficeWorkLog = createSelector(
  [getHomeOfficeWorkLog],
  data => data.get('data')
);
export const selectHomeOfficeWorkLogMeta = createSelector(
  [getHomeOfficeWorkLog],
  data => ({
    isFetching: data.get('isFetching'),
    isFetchingFailure: data.get('isFetchingFailure'),
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  })
);
