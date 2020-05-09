import { createSelector } from 'reselect';

const getSpecialLeaveWorkLog = (state) => state.getIn(['specialLeaveWorkLog', 'specialLeaveWorkLog']);
const getSpecialLeaveWorkLogSupport = (state) => state.getIn(['specialLeaveWorkLog', 'specialLeaveWorkLogSupport']);

export const selectSpecialLeaveWorkLog = createSelector(
  [getSpecialLeaveWorkLog],
  (data) => data.get('data'),
);
export const selectSpecialLeaveWorkLogMeta = createSelector(
  [getSpecialLeaveWorkLog],
  (data) => ({
    isFetching: data.get('isFetching'),
    isFetchingFailure: data.get('isFetchingFailure'),
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  }),
);

export const selectSpecialLeaveWorkLogSupportMeta = createSelector(
  [getSpecialLeaveWorkLogSupport],
  (data) => ({
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  }),
);

