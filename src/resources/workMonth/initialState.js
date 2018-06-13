import Immutable from 'immutable';

export default Immutable.fromJS({
  workMonth: {
    data: null,
    isFetching: false,
    isFetchingFailure: false,
  },
  workMonthList: {
    data: [],
    isFetching: false,
    isFetchingFailure: false,
  },
});
