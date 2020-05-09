import { createSelector } from 'reselect';

const getBusinessTripWorkLog = (state) => state.getIn(['businessTripWorkLog', 'businessTripWorkLog']);
const getBusinessTripWorkLogSupport = (state) => state.getIn(['businessTripWorkLog', 'businessTripWorkLogSupport']);

export const selectBusinessTripWorkLog = createSelector(
  [getBusinessTripWorkLog],
  (data) => data.get('data'),
);
export const selectBusinessTripWorkLogMeta = createSelector(
  [getBusinessTripWorkLog],
  (data) => ({
    isFetching: data.get('isFetching'),
    isFetchingFailure: data.get('isFetchingFailure'),
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  }),
);

export const selectBusinessTripWorkLogSupportMeta = createSelector(
  [getBusinessTripWorkLogSupport],
  (data) => ({
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  }),
);

