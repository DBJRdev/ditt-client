import { createSelector } from 'reselect';

const getAddWorkLog = state => state.getIn(['workLog', 'addWorkLog']);
const getDeleteWorkLog = state => state.getIn(['workLog', 'deleteWorkLog']);
const getWorkLog = state => state.getIn(['workLog', 'workLog']);

export const selectAddWorkLog = createSelector([getAddWorkLog], data => data.get('data'));
export const selectAddWorkLogMeta = createSelector([getAddWorkLog], data => ({
  isPosting: data.get('isPosting'),
  isPostingFailure: data.get('isPostingFailure'),
}));

export const selectDeleteWorkLogMeta = createSelector([getDeleteWorkLog], data => ({
  isPosting: data.get('isPosting'),
  isPostingFailure: data.get('isPostingFailure'),
}));

export const selectWorkLog = createSelector([getWorkLog], data => data.get('data'));
export const selectWorkLogMeta = createSelector([getWorkLog], data => ({
  isFetching: data.get('isFetching'),
  isFetchingFailure: data.get('isFetchingFailure'),
}));
