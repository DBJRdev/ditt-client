import { connect } from 'react-redux';
import {
  addUser,
  fetchUserList,
  selectAddUserMeta,
  selectUserList,
  selectUserListMeta,
} from '../../resources/user';
import AddComponent from './AddComponent';

const mapStateToProps = (state) => {
  const addUserMeta = selectAddUserMeta(state);
  const userListMeta = selectUserListMeta(state);

  return ({
    isFetching: userListMeta.isFetching,
    isPosting: addUserMeta.isPosting,
    userList: selectUserList(state),
  });
};

const mapDispatchToProps = dispatch => ({
  addUser: data => dispatch(addUser(data)),
  fetchUserList: () => dispatch(fetchUserList()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddComponent);
