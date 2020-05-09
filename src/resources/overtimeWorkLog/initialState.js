import Immutable from 'immutable';

export default Immutable.fromJS({
  overtimeWorkLog: {
    data: null,
    isFetching: false,
    isFetchingFailure: false,
    isPosting: false,
    isPostingFailure: false,
  },
  overtimeWorkLogSupport: {
    isPosting: false,
    isPostingFailure: false,
  },
});
