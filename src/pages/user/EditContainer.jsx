import { connect } from 'react-redux';
import { selectJwtToken } from '../../resources/auth';
import {
  fetchConfig,
  selectConfig,
  selectConfigMeta,
} from '../../resources/config';
import {
  archiveUser,
  editUser,
  deleteUser,
  fetchUser,
  fetchUserListPartial,
  selectArchiveUserMeta,
  selectDeleteUserMeta,
  selectEditUserMeta,
  selectUnarchiveUserMeta,
  selectUser,
  selectUserMeta,
  selectUserListPartial,
  selectUserListPartialMeta,
  unarchiveUser,
} from '../../resources/user';
import {
  fetchVacationList,
  selectVacationList,
  selectVacationListMeta,
} from '../../resources/vacation';
import {
  fetchWorkMonthList,
  selectWorkMonthList,
  selectWorkMonthListMeta,
} from '../../resources/workMonth';
import {
  fetchContractList,
  makeContractPermanent,
  selectContractMeta,
  selectContractList,
  selectContractListMeta,
  terminateContract,
} from '../../resources/contract';
import EditComponent from './EditComponent';

const mapStateToProps = (state) => {
  const configMeta = selectConfigMeta(state);
  const contractMeta = selectContractMeta(state);
  const contractListMeta = selectContractListMeta(state);
  const archiveUserMeta = selectArchiveUserMeta(state);
  const editUserMeta = selectEditUserMeta(state);
  const deleteUserMeta = selectDeleteUserMeta(state);
  const unarchiveUserMeta = selectUnarchiveUserMeta(state);
  const userMeta = selectUserMeta(state);
  const userListPartialMeta = selectUserListPartialMeta(state);
  const vacationListMeta = selectVacationListMeta(state);
  const workMonthListMeta = selectWorkMonthListMeta(state);

  return ({
    config: selectConfig(state),
    contracts: selectContractList(state),
    isContractPosting: contractMeta.isPosting,
    isFetching: configMeta.isFetching
      || contractListMeta.isFetching
      || userMeta.isFetching
      || userListPartialMeta.isFetching
      || vacationListMeta.isFetching
      || workMonthListMeta.isFetching,
    isPosting: archiveUserMeta.isPosting
      || editUserMeta.isPosting
      || deleteUserMeta.isPosting
      || unarchiveUserMeta.isPosting,
    token: selectJwtToken(state),
    user: selectUser(state),
    userListPartial: selectUserListPartial(state),
    vacations: selectVacationList(state),
    workMonths: selectWorkMonthList(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  archiveUser: (id) => dispatch(archiveUser(id)),
  deleteUser: (id) => dispatch(deleteUser(id)),
  editUser: (data) => dispatch(editUser(data)),
  fetchConfig: () => dispatch(fetchConfig()),
  fetchContractList: (id) => dispatch(fetchContractList(id)),
  fetchUser: (id) => dispatch(fetchUser(id)),
  fetchUserListPartial: () => dispatch(fetchUserListPartial()),
  fetchVacationList: (id) => dispatch(fetchVacationList(id)),
  fetchWorkMonthList: (id) => dispatch(fetchWorkMonthList(id)),
  makeContractPermanent: (id) => dispatch(makeContractPermanent(id)),
  terminateContract: (id, data) => dispatch(terminateContract(id, data)),
  unarchiveUser: (id) => dispatch(unarchiveUser(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditComponent);
