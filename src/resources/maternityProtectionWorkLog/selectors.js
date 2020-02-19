import { createSelector } from 'reselect';

const getMaternityProtectionWorkLog = (state) => state.getIn(['maternityProtectionWorkLog', 'maternityProtectionWorkLog']);

export const selectMaternityProtectionWorkLog = createSelector(
  [getMaternityProtectionWorkLog],
  (data) => data.get('data'),
);
export const selectMaternityProtectionWorkLogMeta = createSelector(
  [getMaternityProtectionWorkLog],
  (data) => ({
    isFetching: data.get('isFetching'),
    isFetchingFailure: data.get('isFetchingFailure'),
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  }),
);

