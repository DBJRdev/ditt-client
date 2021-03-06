import Immutable from 'immutable';

export default Immutable.fromJS({
  homeOfficeWorkLog: {
    data: null,
    isFetching: false,
    isFetchingFailure: false,
    isPosting: false,
    isPostingFailure: false,
  },
  homeOfficeWorkLogSupport: {
    isPosting: false,
    isPostingFailure: false,
  },
});
