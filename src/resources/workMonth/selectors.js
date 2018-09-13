import { createSelector } from 'reselect';

const getRecentSpecialApprovalList = state => state.getIn(['workMonth', 'recentSpecialApprovalList']);
const getSpecialApprovalList = state => state.getIn(['workMonth', 'specialApprovalList']);
const getWorkMonth = state => state.getIn(['workMonth', 'workMonth']);
const getWorkMonthList = state => state.getIn(['workMonth', 'workMonthList']);

export const selectRecentSpecialApprovalList = createSelector(
  [getRecentSpecialApprovalList],
  data => data.get('data')
);
export const selectRecentSpecialApprovalListMeta = createSelector(
  [getRecentSpecialApprovalList],
  data => ({
    isFetching: data.get('isFetching'),
    isFetchingFailure: data.get('isFetchingFailure'),
  })
);

export const selectSpecialApprovalList = createSelector([getSpecialApprovalList], data => data.get('data'));
export const selectSpecialApprovalListMeta = createSelector([getSpecialApprovalList], data => ({
  isFetching: data.get('isFetching'),
  isFetchingFailure: data.get('isFetchingFailure'),
}));

export const selectWorkMonth = createSelector([getWorkMonth], data => data.get('data'));
export const selectWorkMonthMeta = createSelector([getWorkMonth], data => ({
  isFetching: data.get('isFetching'),
  isFetchingFailure: data.get('isFetchingFailure'),
  isPosting: data.get('isPosting'),
  isPostingFailure: data.get('isPostingFailure'),
}));

export const selectWorkMonthList = createSelector([getWorkMonthList], data => data.get('data'));
export const selectWorkMonthListMeta = createSelector([getWorkMonthList], data => ({
  isFetching: data.get('isFetching'),
  isFetchingFailure: data.get('isFetchingFailure'),
}));
