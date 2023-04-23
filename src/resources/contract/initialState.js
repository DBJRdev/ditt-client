import Immutable from 'immutable';

export default Immutable.fromJS({
  contract: {
    isPosting: false,
    isPostingFailure: false,
  },
  contractList: {
    data: [],
    isFetching: false,
    isFetchingFailure: false,
  },
});
