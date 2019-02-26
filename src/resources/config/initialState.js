import Immutable from 'immutable';

export default Immutable.fromJS({
  config: {
    data: null,
    isFetching: false,
    isFetchingFailure: false,
    isPosting: false,
    isPostingFailure: false,
  },
});
