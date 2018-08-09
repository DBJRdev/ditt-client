import { createSelector } from 'reselect';

const getBusinessTripWorkLog = state => state.getIn(['businessTripWorkLog', 'businessTripWorkLog']);

export const selectBusinessTripWorkLog = createSelector(
  [getBusinessTripWorkLog],
  data => data.get('data')
);
export const selectBusinessTripWorkLogMeta = createSelector(
  [getBusinessTripWorkLog],
  data => ({
    isFetching: data.get('isFetching'),
    isFetchingFailure: data.get('isFetchingFailure'),
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  })
);

