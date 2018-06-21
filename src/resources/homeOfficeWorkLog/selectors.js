import { createSelector } from 'reselect';

const getAddHomeOfficeWorkLog = state => state.getIn(['homeOfficeWorkLog', 'addHomeOfficeWorkLog']);
const getDeleteHomeOfficeWorkLog = state => state.getIn(['homeOfficeWorkLog', 'deleteHomeOfficeWorkLog']);

export const selectAddHomeOfficeWorkLog = createSelector(
  [getAddHomeOfficeWorkLog],
  data => data.get('data')
);
export const selectAddHomeOfficeWorkLogMeta = createSelector(
  [getAddHomeOfficeWorkLog],
  data => ({
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  })
);

export const selectDeleteHomeOfficeWorkLogMeta = createSelector(
  [getDeleteHomeOfficeWorkLog],
  data => ({
    isPosting: data.get('isPosting'),
    isPostingFailure: data.get('isPostingFailure'),
  })
);
