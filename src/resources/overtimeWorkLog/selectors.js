import { createSelector } from 'reselect';

const getOvertimeWorkLog = (state) => state.getIn(['overtimeWorkLog', 'overtimeWorkLog']);
const getOvertimeWorkLogSupport = (state) => state.getIn(['overtimeWorkLog', 'overtimeWorkLogSupport']);

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

export const selectOvertimeWorkLogSupportMeta = createSelector(
  [getOvertimeWorkLogSupport],
  (data) => ({
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  }),
);
