import { connect } from 'react-redux';
import { selectJwtToken } from '../../resources/auth';
import {
  fetchConfig,
  selectConfig,
  selectConfigMeta,
} from '../../resources/config';
import {
  fetchUser,
  selectUser,
  selectUserMeta,
} from '../../resources/user';
import {
  fetchWorkHoursList,
  selectWorkHoursList,
  selectWorkHoursListMeta,
} from '../../resources/workHours';
import ProfileComponent from './ProfileComponent';

const mapStateToProps = (state) => {
  const configMeta = selectConfigMeta(state);
  const userMeta = selectUserMeta(state);
  const workHoursListMeta = selectWorkHoursListMeta(state);

  return ({
    config: selectConfig(state),
    isFetching: configMeta.isFetching
      || userMeta.isFetching
      || workHoursListMeta.isFetching,
    token: selectJwtToken(state),
    user: selectUser(state),
    workHours: selectWorkHoursList(state),
  });
};

const mapDispatchToProps = dispatch => ({
  fetchConfig: () => dispatch(fetchConfig()),
  fetchUser: id => dispatch(fetchUser(id)),
  fetchWorkHoursList: id => dispatch(fetchWorkHoursList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileComponent);
