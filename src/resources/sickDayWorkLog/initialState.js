import Immutable from 'immutable';

export default Immutable.fromJS({
  sickDayWorkLog: {
    data: null,
    isFetching: false,
    isFetchingFailure: false,
    isPosting: false,
    isPostingFailure: false,
  },
});
