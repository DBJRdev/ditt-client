import { createSelector } from 'reselect';

const getOvertimeWorkLog = (state) => state.getIn(['overtimeWorkLog', 'overtimeWorkLog']);

export const selectOvertimeWorkLog = createSelector(
  [getOvertimeWorkLog],
  (data) => data.get('data'),
);
export const selectOvertimeWorkLogMeta = createSelector(
  [getOvertimeWorkLog],
  (data) => ({
    isFetching: data.get('isFetching'),
    isFetchingFailure: data.get('isFetchingFailure'),
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  }),
);
