import { createSelector } from 'reselect';

const getHomeOfficeWorkLog = (state) => state.getIn(['homeOfficeWorkLog', 'homeOfficeWorkLog']);
const getHomeOfficeWorkLogSupport = (state) => state.getIn(['homeOfficeWorkLog', 'homeOfficeWorkLogSupport']);

export const selectHomeOfficeWorkLog = createSelector(
  [getHomeOfficeWorkLog],
  (data) => data.get('data'),
);
export const selectHomeOfficeWorkLogMeta = createSelector(
  [getHomeOfficeWorkLog],
  (data) => ({
    isFetching: data.get('isFetching'),
    isFetchingFailure: data.get('isFetchingFailure'),
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  }),
);

export const selectHomeOfficeWorkLogSupportMeta = createSelector(
  [getHomeOfficeWorkLogSupport],
  (data) => ({
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  }),
);
