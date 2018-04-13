import { createSelector } from 'reselect';

const getAddWorkLog = state => state.getIn(['workLog', 'addWorkLog']);
const getWorkLogList = state => state.getIn(['workLog', 'workLogList']);

export const selectAddWorkLog = createSelector([getAddWorkLog], data => data.get('data'));
export const selectAddWorkLogMeta = createSelector([getAddWorkLog], data => ({
  isPosting: data.get('isPosting'),
  isPostingFailure: data.get('isPostingFailure'),
}));

export const selectWorkLogList = createSelector([getWorkLogList], data => data.get('data'));
export const selectWorkLogListMeta = createSelector([getWorkLogList], data => ({
  isFetching: data.get('isFetching'),
  isFetchingFailure: data.get('isFetchingFailure'),
}));
