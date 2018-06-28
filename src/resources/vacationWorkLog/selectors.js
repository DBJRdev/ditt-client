import { createSelector } from 'reselect';

const getVacationWorkLog = state => state.getIn(['vacationWorkLog', 'vacationWorkLog']);

export const selectVacationWorkLog = createSelector(
  [getVacationWorkLog],
  data => data.get('data')
);
export const selectVacationWorkLogMeta = createSelector(
  [getVacationWorkLog],
  data => ({
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  })
);

