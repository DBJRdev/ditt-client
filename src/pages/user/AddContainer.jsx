import { connect } from 'react-redux';
import {
  fetchConfig,
  selectConfig,
  selectConfigMeta,
} from '../../resources/config';
import {
  addUser,
  fetchUserListPartial,
  selectAddUserMeta,
  selectUserListPartial,
  selectUserListPartialMeta,
} from '../../resources/user';
import AddComponent from './AddComponent';

const mapStateToProps = (state) => {
  const addUserMeta = selectAddUserMeta(state);
  const configMeta = selectConfigMeta(state);
  const userListPartialMeta = selectUserListPartialMeta(state);

  return ({
    config: selectConfig(state),
    isFetching: userListPartialMeta.isFetching || configMeta.isFetching,
    isPosting: addUserMeta.isPosting,
    userListPartial: selectUserListPartial(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  addUser: (data) => dispatch(addUser(data)),
  fetchConfig: () => dispatch(fetchConfig()),
  fetchUserListPartial: () => dispatch(fetchUserListPartial()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddComponent);
