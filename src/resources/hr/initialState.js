import Immutable from 'immutable';

export default Immutable.fromJS({
  changesAndAbsenceRegistrations: {
    data: null,
    isFetching: false,
    isFetchingFailure: false,
  },
  yearOverview: {
    data: null,
    isFetching: false,
    isFetchingFailure: false,
  },
});
