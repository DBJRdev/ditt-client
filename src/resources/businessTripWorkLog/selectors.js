import { createSelector } from 'reselect';

const getAddBusinessTripWorkLog = state => state.getIn(['businessTripWorkLog', 'addBusinessTripWorkLog']);
const getDeleteBusinessTripWorkLog = state => state.getIn(['businessTripWorkLog', 'deleteBusinessTripWorkLog']);

export const selectAddBusinessTripWorkLog = createSelector(
  [getAddBusinessTripWorkLog],
  data => data.get('data')
);
export const selectAddBusinessTripWorkLogMeta = createSelector(
  [getAddBusinessTripWorkLog],
  data => ({
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  })
);

export const selectDeleteBusinessTripWorkLogMeta = createSelector(
  [getDeleteBusinessTripWorkLog],
  data => ({
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  })
);
