import { connect } from 'react-redux';
import { selectJwtToken } from '../../resources/auth';
import {
  fetchConfig,
  selectConfig,
  selectConfigMeta,
} from '../../resources/config';
import {
  fetchContractList,
  selectContractList,
  selectContractListMeta,
} from '../../resources/contract';
import {
  fetchUser,
  renewUserApiToken,
  renewUserICalToken,
  resetUserApiToken,
  resetUserICalToken,
  editUser,
  selectUser,
  selectUserMeta,
  selectEditUserMeta,
} from '../../resources/user';
import ProfileComponent from './ProfileComponent';

const mapStateToProps = (state) => {
  const configMeta = selectConfigMeta(state);
  const contractListMeta = selectContractListMeta(state);
  const editUserMeta = selectEditUserMeta(state);
  const userMeta = selectUserMeta(state);

  return ({
    config: selectConfig(state),
    contracts: selectContractList(state),
    isFetching: configMeta.isFetching
      || contractListMeta.isFetching
      || userMeta.isFetching,
    isPosting: userMeta.isPosting || editUserMeta.isPosting,
    token: selectJwtToken(state),
    user: selectUser(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  editUser: (data) => dispatch(editUser(data)),
  fetchConfig: () => dispatch(fetchConfig()),
  fetchContractList: (id) => dispatch(fetchContractList(id)),
  fetchUser: (id) => dispatch(fetchUser(id)),
  renewUserApiToken: (id) => dispatch(renewUserApiToken(id)),
  renewUserICalToken: (id) => dispatch(renewUserICalToken(id)),
  resetUserApiToken: (id) => dispatch(resetUserApiToken(id)),
  resetUserICalToken: (id) => dispatch(resetUserICalToken(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileComponent);
