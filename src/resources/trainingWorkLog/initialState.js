import Immutable from 'immutable';

export default Immutable.fromJS({
  trainingWorkLog: {
    data: null,
    isFetching: false,
    isFetchingFailure: false,
    isPosting: false,
    isPostingFailure: false,
  },
  trainingWorkLogSupport: {
    isPosting: false,
    isPostingFailure: false,
  },
});
