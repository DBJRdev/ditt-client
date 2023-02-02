import { createSelector } from 'reselect';

const getTrainingWorkLog = (state) => state.getIn(['trainingWorkLog', 'trainingWorkLog']);
const getTrainingWorkLogSupport = (state) => state.getIn(['trainingWorkLog', 'trainingWorkLogSupport']);

export const selectTrainingWorkLog = createSelector(
  [getTrainingWorkLog],
  (data) => data.get('data'),
);
export const selectTrainingWorkLogMeta = createSelector(
  [getTrainingWorkLog],
  (data) => ({
    isFetching: data.get('isFetching'),
    isFetchingFailure: data.get('isFetchingFailure'),
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  }),
);

export const selectTrainingWorkLogSupportMeta = createSelector(
  [getTrainingWorkLogSupport],
  (data) => ({
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  }),
);

