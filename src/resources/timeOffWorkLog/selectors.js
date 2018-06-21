import { createSelector } from 'reselect';

const getAddTimeOffWorkLog = state => state.getIn(['timeOffWorkLog', 'addTimeOffWorkLog']);
const getDeleteTimeOffWorkLog = state => state.getIn(['timeOffWorkLog', 'deleteTimeOffWorkLog']);

export const selectAddTimeOffWorkLog = createSelector([getAddTimeOffWorkLog], data => data.get('data'));
export const selectAddTimeOffWorkLogMeta = createSelector([getAddTimeOffWorkLog], data => ({
  isPosting: data.get('isPosting'),
  isPostingFailure: data.get('isPostingFailure'),
}));

export const selectDeleteTimeOffWorkLogMeta = createSelector([getDeleteTimeOffWorkLog], data => ({
  isPosting: data.get('isPosting'),
  isPostingFailure: data.get('isPostingFailure'),
}));
