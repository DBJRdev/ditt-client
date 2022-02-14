import { connect } from 'react-redux';
import decode from 'jwt-decode';
import { selectJwtToken } from '../../resources/auth';
import {
  fetchConfig,
  selectConfig,
  selectConfigMeta,
} from '../../resources/config';
import {
  fetchWorkHoursList,
  selectWorkHoursList,
  selectWorkHoursListMeta,
} from '../../resources/workHours';
import {
  fetchWorkMonth,
  fetchWorkMonthList,
  selectWorkMonth,
  selectWorkMonthMeta,
  selectWorkMonthList,
  selectWorkMonthListMeta,
} from '../../resources/workMonth';
import { selectAddWorkLogMeta } from '../../resources/workLog';
import WorkLogComponent from './WorkLogComponent';

const mapStateToProps = (state) => {
  const addWorkLogMeta = selectAddWorkLogMeta(state);
  const configMeta = selectConfigMeta(state);
  const workHourListMeta = selectWorkHoursListMeta(state);
  const workMonthListMeta = selectWorkMonthListMeta(state);
  const workMonthMeta = selectWorkMonthMeta(state);

  const token = selectJwtToken(state);
  const tokenData = token ? decode(token) : null;

  const mappedProps = {
    config: selectConfig(state)?.toJS(),
    isFetching: configMeta.isFetching
      || workHourListMeta.isFetching
      || workMonthListMeta.isFetching
      || workMonthMeta.isFetching,
    isPosting: addWorkLogMeta.isPosting,
    workHoursList: selectWorkHoursList(state)?.toJS(),
    workMonth: selectWorkMonth(state)?.toJS(),
    workMonthList: selectWorkMonthList(state)?.toJS(),
  };

  if (token != null && tokenData != null) {
    const {
      exp,
      iat,
      ...user
    } = tokenData;

    return ({
      ...mappedProps,
      token: {
        exp,
        iat,
        token,
      },
      user,
    });
  }

  return ({
    ...mappedProps,
    token: null,
    user: null,
  });
};

const mapDispatchToProps = (dispatch) => ({
  fetchConfig: () => dispatch(fetchConfig()),
  fetchWorkHoursList: (uid) => dispatch(fetchWorkHoursList(uid)),
  fetchWorkMonth: (id) => dispatch(fetchWorkMonth(id)),
  fetchWorkMonthList: (uid) => dispatch(fetchWorkMonthList(uid)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WorkLogComponent);
