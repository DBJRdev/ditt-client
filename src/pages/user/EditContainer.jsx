import { connect } from 'react-redux';
import { selectJwtToken } from '../../resources/auth';
import {
  fetchConfig,
  selectConfig,
  selectConfigMeta,
} from '../../resources/config';
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
import {
  fetchWorkHoursList,
  selectWorkHoursList,
  selectWorkHoursListMeta,
} from '../../resources/workHours';
import EditComponent from './EditComponent';

const mapStateToProps = (state) => {
  const configMeta = selectConfigMeta(state);
  const editUserMeta = selectEditUserMeta(state);
  const deleteUserMeta = selectDeleteUserMeta(state);
  const userMeta = selectUserMeta(state);
  const userListMeta = selectUserListMeta(state);
  const workHoursListMeta = selectWorkHoursListMeta(state);

  return ({
    config: selectConfig(state),
    isFetching: configMeta.isFetching
      || userMeta.isFetching
      || userListMeta.isFetching
      || workHoursListMeta.isFetching,
    isPosting: editUserMeta.isPosting || deleteUserMeta.isPosting,
    token: selectJwtToken(state),
    user: selectUser(state),
    userList: selectUserList(state),
    workHours: selectWorkHoursList(state),
  });
};

const mapDispatchToProps = dispatch => ({
  deleteUser: id => dispatch(deleteUser(id)),
  editUser: data => dispatch(editUser(data)),
  fetchConfig: () => dispatch(fetchConfig()),
  fetchUser: id => dispatch(fetchUser(id)),
  fetchUserList: () => dispatch(fetchUserList()),
  fetchWorkHoursList: id => dispatch(fetchWorkHoursList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditComponent);
