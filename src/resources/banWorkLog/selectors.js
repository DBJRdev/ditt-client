import { createSelector } from 'reselect';

const getBanWorkLog = (state) => state.getIn(['banWorkLog', 'banWorkLog']);

export const selectBanWorkLog = createSelector(
  [getBanWorkLog],
  (data) => data.get('data'),
);
export const selectBanWorkLogMeta = createSelector(
  [getBanWorkLog],
  (data) => ({
    isFetching: data.get('isFetching'),
    isFetchingFailure: data.get('isFetchingFailure'),
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  }),
);

