import Immutable from 'immutable';

export default Immutable.fromJS({
  banWorkLog: {
    data: null,
    isFetching: false,
    isFetchingFailure: false,
    isPosting: false,
    isPostingFailure: false,
  },
});
