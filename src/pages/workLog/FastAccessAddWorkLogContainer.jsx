import { connect } from 'react-redux';
import { addBusinessTripWorkLog } from '../../resources/businessTripWorkLog';
import {
  fetchConfig,
  selectConfig,
  selectConfigMeta,
} from '../../resources/config';
import { addHomeOfficeWorkLog } from '../../resources/homeOfficeWorkLog';
import { addOvertimeWorkLog } from '../../resources/overtimeWorkLog';
import { addSickDayWorkLog } from '../../resources/sickDayWorkLog';
import { addTimeOffWorkLog } from '../../resources/timeOffWorkLog';
import {
  fetchUserByApiToken,
  selectUserMeta,
} from '../../resources/user';
import { addMultipleVacationWorkLog } from '../../resources/vacationWorkLog';
import {
  addWorkLog,
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
    config: selectConfig(state),
    isFetching: configMeta.isFetching
      || workMonthListMeta.isFetching
      || userMeta.isFetching
      || workMonthMeta.isFetching,
    isPosting: addWorkLogMeta.isPosting,
    workMonth: selectWorkMonth(state),
    workMonthList: selectWorkMonthList(state),
  });
};

const mapDispatchToProps = dispatch => ({
  addBusinessTripWorkLog: data => dispatch(addBusinessTripWorkLog(data)),
  addHomeOfficeWorkLog: data => dispatch(addHomeOfficeWorkLog(data)),
  addMultipleVacationWorkLog: data => dispatch(addMultipleVacationWorkLog(data)),
  addOvertimeWorkLog: data => dispatch(addOvertimeWorkLog(data)),
  addSickDayWorkLog: data => dispatch(addSickDayWorkLog(data)),
  addTimeOffWorkLog: data => dispatch(addTimeOffWorkLog(data)),
  addWorkLog: data => dispatch(addWorkLog(data)),
  fetchConfig: () => dispatch(fetchConfig()),
  fetchUserByApiToken: apiToken => dispatch(fetchUserByApiToken(apiToken)),
  fetchWorkMonth: id => dispatch(fetchWorkMonth(id)),
  fetchWorkMonthList: uid => dispatch(fetchWorkMonthList(uid)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FastAccessAddWorkLogComponent);
