import { connect } from 'react-redux';
import {
  fetchConfig,
  selectConfig,
  selectConfigMeta,
} from '../../resources/config';
import {
  addUser,
  fetchUserOptions,
  selectAddUserMeta,
  selectUserOptions,
  selectUserOptionsMeta,
} from '../../resources/user';
import AddComponent from './AddComponent';

const mapStateToProps = (state) => {
  const addUserMeta = selectAddUserMeta(state);
  const configMeta = selectConfigMeta(state);
  const userOptionsMeta = selectUserOptionsMeta(state);

  return ({
    config: selectConfig(state),
    isFetching: userOptionsMeta.isFetching || configMeta.isFetching,
    isPosting: addUserMeta.isPosting,
    userOptions: selectUserOptions(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  addUser: (data) => dispatch(addUser(data)),
  fetchConfig: () => dispatch(fetchConfig()),
  fetchUserOptions: () => dispatch(fetchUserOptions()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddComponent);
