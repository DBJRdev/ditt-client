import { createSelector } from 'reselect';

const getTimeOffWorkLog = (state) => state.getIn(['timeOffWorkLog', 'timeOffWorkLog']);
const getTimeOffWorkLogSupport = (state) => state.getIn(['timeOffWorkLog', 'timeOffWorkLogSupport']);

export const selectTimeOffWorkLog = createSelector([getTimeOffWorkLog], (data) => data.get('data'));
export const selectTimeOffWorkLogMeta = createSelector([getTimeOffWorkLog], (data) => ({
  isFetching: data.get('isFetching'),
  isFetchingFailure: data.get('isFetchingFailure'),
  isPosting: data.get('isPosting'),
  isPostingFailure: data.get('isPostingFailure'),
}));

export const selectTimeOffWorkLogSupportMeta = createSelector(
  [getTimeOffWorkLogSupport],
  (data) => ({
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  }),
);
