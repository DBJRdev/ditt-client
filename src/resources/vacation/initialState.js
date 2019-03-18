import Immutable from 'immutable';

export default Immutable.fromJS({
  vacationList: {
    data: [],
    isFetching: false,
    isFetchingFailure: false,
  },
});
