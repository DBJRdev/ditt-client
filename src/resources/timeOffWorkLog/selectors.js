import { createSelector } from 'reselect';

const getTimeOffWorkLog = state => state.getIn(['timeOffWorkLog', 'timeOffWorkLog']);

export const selectTimeOffWorkLog = createSelector([getTimeOffWorkLog], data => data.get('data'));
export const selectTimeOffWorkLogMeta = createSelector([getTimeOffWorkLog], data => ({
  isPosting: data.get('isPosting'),
  isPostingFailure: data.get('isPostingFailure'),
}));
