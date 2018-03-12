import { createSelector } from 'reselect';

const getData = state => state.getIn(['global', 'data']);

export const selectData = createSelector([getData], data => data.get('data'));
export const selectDataMeta = createSelector([getData], data => ({
  isFetching: data.get('isFetching'),
  isFetchingFailure: data.get('isFetchingFailure'),
}));
