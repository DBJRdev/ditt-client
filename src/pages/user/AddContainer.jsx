import { connect } from 'react-redux';
import {
  fetchConfig,
  selectConfig,
  selectConfigMeta,
} from '../../resources/config';
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
  const configMeta = selectConfigMeta(state);
  const userListMeta = selectUserListMeta(state);

  return ({
    config: selectConfig(state),
    isFetching: userListMeta.isFetching || configMeta.isFetching,
    isPosting: addUserMeta.isPosting,
    userList: selectUserList(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  addUser: (data) => dispatch(addUser(data)),
  fetchConfig: () => dispatch(fetchConfig()),
  fetchUserList: () => dispatch(fetchUserList()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddComponent);
