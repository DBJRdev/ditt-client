import { createSelector } from 'reselect';

const getWorkHoursList = (state) => state.getIn(['workHours', 'workHoursList']);

export const selectWorkHoursList = createSelector([getWorkHoursList], (data) => data.get('data'));
export const selectWorkHoursListMeta = createSelector([getWorkHoursList], (data) => ({
  isFetching: data.get('isFetching'),
  isFetchingFailure: data.get('isFetchingFailure'),
}));
