import { createSelector } from 'reselect';

const getParentalLeaveWorkLog = (state) => state.getIn(['parentalLeaveWorkLog', 'parentalLeaveWorkLog']);

export const selectParentalLeaveWorkLog = createSelector(
  [getParentalLeaveWorkLog],
  (data) => data.get('data'),
);
export const selectParentalLeaveWorkLogMeta = createSelector(
  [getParentalLeaveWorkLog],
  (data) => ({
    isFetching: data.get('isFetching'),
    isFetchingFailure: data.get('isFetchingFailure'),
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  }),
);

