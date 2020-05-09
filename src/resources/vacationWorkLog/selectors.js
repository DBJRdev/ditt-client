import { createSelector } from 'reselect';

const getVacationWorkLog = (state) => state.getIn(['vacationWorkLog', 'vacationWorkLog']);
const getVacationWorkLogSupport = (state) => state.getIn(['vacationWorkLog', 'vacationWorkLogSupport']);

export const selectVacationWorkLog = createSelector(
  [getVacationWorkLog],
  (data) => data.get('data'),
);
export const selectVacationWorkLogMeta = createSelector(
  [getVacationWorkLog],
  (data) => ({
    isFetching: data.get('isFetching'),
    isFetchingFailure: data.get('isFetchingFailure'),
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  }),
);

export const selectVacationWorkLogSupportMeta = createSelector(
  [getVacationWorkLogSupport],
  (data) => ({
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  }),
);
