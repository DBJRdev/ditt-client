import { createSelector } from 'reselect';

const getSickDayUnpaidWorkLog = (state) => state.getIn(['sickDayUnpaidWorkLog', 'sickDayUnpaidWorkLog']);

export const selectSickDayUnpaidWorkLog = createSelector(
  [getSickDayUnpaidWorkLog],
  (data) => data.get('data'),
);
export const selectSickDayUnpaidWorkLogMeta = createSelector(
  [getSickDayUnpaidWorkLog],
  (data) => ({
    isFetching: data.get('isFetching'),
    isFetchingFailure: data.get('isFetchingFailure'),
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  }),
);

