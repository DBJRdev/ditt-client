import { createSelector } from 'reselect';

const getSickDayWorkLog = state => state.getIn(['sickDayWorkLog', 'sickDayWorkLog']);

export const selectSickDayWorkLog = createSelector(
  [getSickDayWorkLog],
  data => data.get('data')
);
export const selectSickDayWorkLogMeta = createSelector(
  [getSickDayWorkLog],
  data => ({
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  })
);

