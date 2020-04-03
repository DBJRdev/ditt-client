import { createSelector } from 'reselect';

const getChangesAndAbsenceRegistrations = (state) => state.getIn(['hr', 'changesAndAbsenceRegistrations']);

export const selectChangesAndAbsenceRegistrations = createSelector(
  [getChangesAndAbsenceRegistrations],
  (data) => {
    if (data.get('data')) {
      return data.get('data').toJS();
    }

    return null;
  },
);
export const selectChangesAndAbsenceRegistrationsMeta = createSelector(
  [getChangesAndAbsenceRegistrations],
  (data) => ({
    isFetching: data.get('isFetching'),
    isFetchingFailure: data.get('isFetchingFailure'),
  }),
);
