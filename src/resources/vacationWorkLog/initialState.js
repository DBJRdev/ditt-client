import Immutable from 'immutable';

export default Immutable.fromJS({
  vacationWorkLog: {
    data: null,
    isFetching: false,
    isFetchingFailure: false,
    isPosting: false,
    isPostingFailure: false,
  },
  vacationWorkLogSupport: {
    isPosting: false,
    isPostingFailure: false,
  },
});
