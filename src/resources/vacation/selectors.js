import { createSelector } from 'reselect';

const getVacationList = state => state.getIn(['vacation', 'vacationList']);

export const selectVacationList = createSelector([getVacationList], data => data.get('data'));
export const selectVacationListMeta = createSelector([getVacationList], data => ({
  isFetching: data.get('isFetching'),
  isFetchingFailure: data.get('isFetchingFailure'),
}));
