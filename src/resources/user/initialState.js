import Immutable from 'immutable';

export default Immutable.fromJS({
  addUser: {
    data: null,
    isPosting: false,
    isPostingFailure: false,
  },
  deleteUser: {
    isPosting: false,
    isPostingFailure: false,
  },
  editUser: {
    data: null,
    isPosting: false,
    isPostingFailure: false,
  },
  user: {
    data: null,
    isFetching: false,
    isFetchingFailure: false,
  },
  userList: {
    data: [],
    isFetching: false,
    isFetchingFailure: false,
  },
});
