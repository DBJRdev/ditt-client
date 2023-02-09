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
  fetchUserOptions,
  selectDeleteUserMeta,
  selectEditUserMeta,
  selectUser,
  selectUserMeta,
  selectUserOptions,
  selectUserOptionsMeta,
} from '../../resources/user';
import {
  fetchVacationList,
  selectVacationList,
  selectVacationListMeta,
} from '../../resources/vacation';
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
  const userOptionsMeta = selectUserOptionsMeta(state);
  const vacationListMeta = selectVacationListMeta(state);
  const workHoursListMeta = selectWorkHoursListMeta(state);

  return ({
    config: selectConfig(state),
    isFetching: configMeta.isFetching
      || userMeta.isFetching
      || userOptionsMeta.isFetching
      || vacationListMeta.isFetching
      || workHoursListMeta.isFetching,
    isPosting: editUserMeta.isPosting || deleteUserMeta.isPosting,
    token: selectJwtToken(state),
    user: selectUser(state),
    userOptions: selectUserOptions(state),
    vacations: selectVacationList(state),
    workHours: selectWorkHoursList(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  deleteUser: (id) => dispatch(deleteUser(id)),
  editUser: (data) => dispatch(editUser(data)),
  fetchConfig: () => dispatch(fetchConfig()),
  fetchUser: (id) => dispatch(fetchUser(id)),
  fetchUserOptions: () => dispatch(fetchUserOptions()),
  fetchVacationList: (id) => dispatch(fetchVacationList(id)),
  fetchWorkHoursList: (id) => dispatch(fetchWorkHoursList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditComponent);
