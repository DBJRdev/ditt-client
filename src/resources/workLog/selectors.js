import { createSelector } from 'reselect';

const getWorkLogList = state => state.getIn(['workLog', 'workLogList']);

export const selectWorkLogList = createSelector([getWorkLogList], data => data.get('data'));
export const selectWorkLogListMeta = createSelector([getWorkLogList], data => ({
  isFetching: data.get('isFetching'),
  isFetchingFailure: data.get('isFetchingFailure'),
}));
