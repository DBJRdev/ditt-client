import Immutable from 'immutable';

export default Immutable.fromJS({
  businessTripWorkLog: {
    data: null,
    isFetching: false,
    isFetchingFailure: false,
    isPosting: false,
    isPostingFailure: false,
  },
  businessTripWorkLogSupport: {
    isPosting: false,
    isPostingFailure: false,
  },
});
