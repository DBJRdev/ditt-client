import { connect } from 'react-redux';
import {
  fetchConfig,
  selectConfig,
  selectConfigMeta,
} from '../../resources/config';
import {
  fetchUserByApiToken,
  selectUserMeta,
} from '../../resources/user';
import {
  selectAddWorkLogMeta,
} from '../../resources/workLog';
import {
  fetchWorkMonth,
  fetchWorkMonthList,
  selectWorkMonth,
  selectWorkMonthMeta,
  selectWorkMonthList,
  selectWorkMonthListMeta,
} from '../../resources/workMonth';
import FastAccessAddWorkLogComponent from './FastAccessAddWorkLogComponent';

const mapStateToProps = (state) => {
  const addWorkLogMeta = selectAddWorkLogMeta(state);
  const configMeta = selectConfigMeta(state);
  const userMeta = selectUserMeta(state);
  const workMonthListMeta = selectWorkMonthListMeta(state);
  const workMonthMeta = selectWorkMonthMeta(state);

  return ({
    config: selectConfig(state)?.toJS(),
    isFetching: configMeta.isFetching
      || workMonthListMeta.isFetching
      || userMeta.isFetching
      || workMonthMeta.isFetching,
    isPosting: addWorkLogMeta.isPosting,
    workMonth: selectWorkMonth(state)?.toJS(),
    workMonthList: selectWorkMonthList(state)?.toJS(),
  });
};

const mapDispatchToProps = (dispatch) => ({
  fetchConfig: () => dispatch(fetchConfig()),
  fetchUserByApiToken: (apiToken) => dispatch(fetchUserByApiToken(apiToken)),
  fetchWorkMonth: (id) => dispatch(fetchWorkMonth(id)),
  fetchWorkMonthList: (uid) => dispatch(fetchWorkMonthList(uid)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FastAccessAddWorkLogComponent);
