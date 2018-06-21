import Immutable from 'immutable';

export default Immutable.fromJS({
  addTimeOffWorkLog: {
    data: null,
    isPosting: false,
    isPostingFailure: false,
  },
  deleteTimeOffWorkLog: {
    isPosting: false,
    isPostingFailure: false,
  },
});
