import Immutable from 'immutable';

export default Immutable.fromJS({
  timeOffWorkLog: {
    data: null,
    isFetching: false,
    isFetchingFailure: false,
    isPosting: false,
    isPostingFailure: false,
  },
  timeOffWorkLogSupport: {
    isPosting: false,
    isPostingFailure: false,
  },
});
