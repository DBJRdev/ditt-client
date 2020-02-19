import { connect } from 'react-redux';
import { selectJwtToken } from '../../resources/auth';
import {
  fetchBusinessTripWorkLog,
  selectBusinessTripWorkLog,
} from '../../resources/businessTripWorkLog';
import {
  fetchConfig,
  selectConfig,
  selectConfigMeta,
} from '../../resources/config';
import {
  fetchHomeOfficeWorkLog,
  selectHomeOfficeWorkLog,
} from '../../resources/homeOfficeWorkLog';
import {
  addMultipleMaternityProtectionWorkLogs,
  deleteMaternityProtectionWorkLog,
  fetchMaternityProtectionWorkLog,
  selectMaternityProtectionWorkLog,
  selectMaternityProtectionWorkLogMeta,
} from '../../resources/maternityProtectionWorkLog';
import {
  fetchOvertimeWorkLog,
  selectOvertimeWorkLog,
} from '../../resources/overtimeWorkLog';
import {
  addMultipleParentalLeaveWorkLogs,
  deleteParentalLeaveWorkLog,
  fetchParentalLeaveWorkLog,
  selectParentalLeaveWorkLog,
  selectParentalLeaveWorkLogMeta,
} from '../../resources/parentalLeaveWorkLog';
import {
  fetchSickDayWorkLog,
  selectSickDayWorkLog,
} from '../../resources/sickDayWorkLog';
import {
  fetchTimeOffWorkLog,
  selectTimeOffWorkLog,
} from '../../resources/timeOffWorkLog';
import {
  fetchVacationWorkLog,
  selectVacationWorkLog,
} from '../../resources/vacationWorkLog';
import {
  fetchWorkHoursList,
  selectWorkHoursList,
  selectWorkHoursListMeta,
} from '../../resources/workHours';
import {
  fetchWorkLog,
  selectWorkLog,
} from '../../resources/workLog';
import {
  fetchWorkMonth,
  fetchWorkMonthList,
  markApproved,
  selectWorkMonth,
  selectWorkMonthMeta,
  selectWorkMonthList,
  selectWorkMonthListMeta,
} from '../../resources/workMonth';
import WorkLogComponent from './WorkLogComponent';

const mapStateToProps = (state) => {
  const configMeta = selectConfigMeta(state);
  const maternityProtectionWorkLogMeta = selectMaternityProtectionWorkLogMeta(state);
  const parentalLeaveWorkLogMeta = selectParentalLeaveWorkLogMeta(state);
  const workHourListMeta = selectWorkHoursListMeta(state);
  const workMonthListMeta = selectWorkMonthListMeta(state);
  const workMonthMeta = selectWorkMonthMeta(state);

  return ({
    businessTripWorkLog: selectBusinessTripWorkLog(state),
    config: selectConfig(state),
    homeOfficeWorkLog: selectHomeOfficeWorkLog(state),
    isFetching: configMeta.isFetching
      || workHourListMeta.isFetching
      || workMonthListMeta.isFetching
      || workMonthMeta.isFetching,
    isPosting: workMonthMeta.isPosting
      || maternityProtectionWorkLogMeta.isPosting
      || parentalLeaveWorkLogMeta.isPosting,
    maternityProtectionWorkLog: selectMaternityProtectionWorkLog(state),
    overtimeWorkLog: selectOvertimeWorkLog(state),
    parentalLeaveWorkLog: selectParentalLeaveWorkLog(state),
    sickDayWorkLog: selectSickDayWorkLog(state),
    timeOffWorkLog: selectTimeOffWorkLog(state),
    token: selectJwtToken(state),
    vacationWorkLog: selectVacationWorkLog(state),
    workHoursList: selectWorkHoursList(state),
    workLog: selectWorkLog(state),
    workMonth: selectWorkMonth(state),
    workMonthList: selectWorkMonthList(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  addMultipleMaternityProtectionWorkLogs: (data) => dispatch(
    addMultipleMaternityProtectionWorkLogs(data),
  ),
  addMultipleParentalLeaveWorkLogs: (data) => dispatch(
    addMultipleParentalLeaveWorkLogs(data),
  ),
  deleteMaternityProtectionWorkLog: (id) => dispatch(deleteMaternityProtectionWorkLog(id)),
  deleteParentalLeaveWorkLog: (id) => dispatch(deleteParentalLeaveWorkLog(id)),
  fetchBusinessTripWorkLog: (id) => dispatch(fetchBusinessTripWorkLog(id)),
  fetchConfig: () => dispatch(fetchConfig()),
  fetchHomeOfficeWorkLog: (id) => dispatch(fetchHomeOfficeWorkLog(id)),
  fetchMaternityProtectionWorkLog: (id) => dispatch(fetchMaternityProtectionWorkLog(id)),
  fetchOvertimeWorkLog: (id) => dispatch(fetchOvertimeWorkLog(id)),
  fetchParentalLeaveWorkLog: (id) => dispatch(fetchParentalLeaveWorkLog(id)),
  fetchSickDayWorkLog: (id) => dispatch(fetchSickDayWorkLog(id)),
  fetchTimeOffWorkLog: (id) => dispatch(fetchTimeOffWorkLog(id)),
  fetchVacationWorkLog: (id) => dispatch(fetchVacationWorkLog(id)),
  fetchWorkHoursList: (uid) => dispatch(fetchWorkHoursList(uid)),
  fetchWorkLog: (id) => dispatch(fetchWorkLog(id)),
  fetchWorkMonth: (id) => dispatch(fetchWorkMonth(id)),
  fetchWorkMonthList: (uid) => dispatch(fetchWorkMonthList(uid)),
  markApproved: (id) => dispatch(markApproved(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WorkLogComponent);
