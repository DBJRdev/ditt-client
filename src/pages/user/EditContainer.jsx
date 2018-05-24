import { connect } from 'react-redux';
import { selectJwtToken } from '../../resources/auth';
import {
  editUser,
  deleteUser,
  fetchUser,
  fetchUserList,
  selectDeleteUserMeta,
  selectEditUserMeta,
  selectUser,
  selectUserMeta,
  selectUserList,
  selectUserListMeta,
} from '../../resources/user';
import EditComponent from './EditComponent';

const mapStateToProps = (state) => {
  const editUserMeta = selectEditUserMeta(state);
  const deleteUserMeta = selectDeleteUserMeta(state);
  const userMeta = selectUserMeta(state);
  const userListMeta = selectUserListMeta(state);

  return ({
    isFetching: userMeta.isFetching || userListMeta.isFetching,
    isPosting: editUserMeta.isPosting || deleteUserMeta.isPosting,
    token: selectJwtToken(state),
    user: selectUser(state),
    userList: selectUserList(state),
  });
};

const mapDispatchToProps = dispatch => ({
  deleteUser: id => dispatch(deleteUser(id)),
  editUser: data => dispatch(editUser(data)),
  fetchUser: id => dispatch(fetchUser(id)),
  fetchUserList: () => dispatch(fetchUserList()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditComponent);
