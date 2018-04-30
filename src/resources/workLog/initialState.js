import Immutable from 'immutable';

export default Immutable.fromJS({
  addWorkLog: {
    data: null,
    isPosting: false,
    isPostingFailure: false,
  },
  deleteWorkLog: {
    isPosting: false,
    isPostingFailure: false,
  },
  workLogList: {
    data: [],
    isFetching: false,
    isFetchingFailure: false,
  },
});
