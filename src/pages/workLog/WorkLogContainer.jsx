import { connect } from 'react-redux';
import jwt from 'jsonwebtoken';
import { selectJwtToken } from '../../resources/auth';
import {
  addBusinessTripWorkLog,
  deleteBusinessTripWorkLog,
  fetchBusinessTripWorkLog,
  selectBusinessTripWorkLog,
  selectBusinessTripWorkLogMeta,
} from '../../resources/businessTripWorkLog';
import {
  fetchConfig,
  selectConfig,
  selectConfigMeta,
} from '../../resources/config';
import {
  addHomeOfficeWorkLog,
  deleteHomeOfficeWorkLog,
  fetchHomeOfficeWorkLog,
  selectHomeOfficeWorkLog,
  selectHomeOfficeWorkLogMeta,
} from '../../resources/homeOfficeWorkLog';
import {
  fetchMaternityProtectionWorkLog,
  selectMaternityProtectionWorkLog,
} from '../../resources/maternityProtectionWorkLog';

import {
  addOvertimeWorkLog,
  deleteOvertimeWorkLog,
  fetchOvertimeWorkLog,
  selectOvertimeWorkLog,
  selectOvertimeWorkLogMeta,
} from '../../resources/overtimeWorkLog';
import {
  addSickDayWorkLog,
  deleteSickDayWorkLog,
  fetchSickDayWorkLog,
  selectSickDayWorkLog,
  selectSickDayWorkLogMeta,
} from '../../resources/sickDayWorkLog';
import {
  addTimeOffWorkLog,
  deleteTimeOffWorkLog,
  fetchTimeOffWorkLog,
  selectTimeOffWorkLog,
  selectTimeOffWorkLogMeta,
} from '../../resources/timeOffWorkLog';
import {
  addMultipleVacationWorkLog,
  deleteVacationWorkLog,
  fetchVacationWorkLog,
  selectVacationWorkLog,
  selectVacationWorkLogMeta,
} from '../../resources/vacationWorkLog';
import {
  fetchWorkHoursList,
  selectWorkHoursList,
  selectWorkHoursListMeta,
} from '../../resources/workHours';
import {
  addWorkLog,
  deleteWorkLog,
  fetchWorkLog,
  selectAddWorkLogMeta,
  selectDeleteWorkLogMeta,
  selectWorkLog,
} from '../../resources/workLog';
import {
  fetchWorkMonth,
  fetchWorkMonthList,
  markWaitingForApproval,
  selectWorkMonth,
  selectWorkMonthMeta,
  selectWorkMonthList,
  selectWorkMonthListMeta,
} from '../../resources/workMonth';
import WorkLogComponent from './WorkLogComponent';

const mapStateToProps = (state) => {
  const addWorkLogMeta = selectAddWorkLogMeta(state);
  const businessTripWorkLogMeta = selectBusinessTripWorkLogMeta(state);
  const configMeta = selectConfigMeta(state);
  const homeOfficeWorkLogMeta = selectHomeOfficeWorkLogMeta(state);
  const overtimeWorkLogMeta = selectOvertimeWorkLogMeta(state);
  const sickDayWorkLogMeta = selectSickDayWorkLogMeta(state);
  const timeOffWorkLogMeta = selectTimeOffWorkLogMeta(state);
  const vacationWorkLogMeta = selectVacationWorkLogMeta(state);
  const deleteWorkLogMeta = selectDeleteWorkLogMeta(state);
  const workHourListMeta = selectWorkHoursListMeta(state);
  const workMonthListMeta = selectWorkMonthListMeta(state);
  const workMonthMeta = selectWorkMonthMeta(state);

  let decodedToken = null;
  const token = selectJwtToken(state);
  if (token !== null) {
    decodedToken = jwt.decode(token);
  }

  return ({
    businessTripWorkLog: selectBusinessTripWorkLog(state),
    config: selectConfig(state),
    homeOfficeWorkLog: selectHomeOfficeWorkLog(state),
    isFetching: configMeta.isFetching
      || workHourListMeta.isFetching
      || workMonthListMeta.isFetching
      || workMonthMeta.isFetching,
    isPosting: addWorkLogMeta.isPosting
      || businessTripWorkLogMeta.isPosting
      || deleteWorkLogMeta.isPosting
      || homeOfficeWorkLogMeta.isPosting
      || overtimeWorkLogMeta.isPosting
      || sickDayWorkLogMeta.isPosting
      || timeOffWorkLogMeta.isPosting
      || vacationWorkLogMeta.isPosting
      || workMonthMeta.isPosting,
    maternityProtectionWorkLog: selectMaternityProtectionWorkLog(state),
    overtimeWorkLog: selectOvertimeWorkLog(state),
    sickDayWorkLog: selectSickDayWorkLog(state),
    timeOffWorkLog: selectTimeOffWorkLog(state),
    uid: decodedToken ? decodedToken.uid : null,
    vacationWorkLog: selectVacationWorkLog(state),
    workHoursList: selectWorkHoursList(state),
    workLog: selectWorkLog(state),
    workMonth: selectWorkMonth(state),
    workMonthList: selectWorkMonthList(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  addBusinessTripWorkLog: (data) => dispatch(addBusinessTripWorkLog(data)),
  addHomeOfficeWorkLog: (data) => dispatch(addHomeOfficeWorkLog(data)),
  addMultipleVacationWorkLog: (data) => dispatch(addMultipleVacationWorkLog(data)),
  addOvertimeWorkLog: (data) => dispatch(addOvertimeWorkLog(data)),
  addSickDayWorkLog: (data) => dispatch(addSickDayWorkLog(data)),
  addTimeOffWorkLog: (data) => dispatch(addTimeOffWorkLog(data)),
  addWorkLog: (data) => dispatch(addWorkLog(data)),
  deleteBusinessTripWorkLog: (id) => dispatch(deleteBusinessTripWorkLog(id)),
  deleteHomeOfficeWorkLog: (id) => dispatch(deleteHomeOfficeWorkLog(id)),
  deleteOvertimeWorkLog: (id) => dispatch(deleteOvertimeWorkLog(id)),
  deleteSickDayWorkLog: (id) => dispatch(deleteSickDayWorkLog(id)),
  deleteTimeOffWorkLog: (id) => dispatch(deleteTimeOffWorkLog(id)),
  deleteVacationWorkLog: (id) => dispatch(deleteVacationWorkLog(id)),
  deleteWorkLog: (id) => dispatch(deleteWorkLog(id)),
  fetchBusinessTripWorkLog: (id) => dispatch(fetchBusinessTripWorkLog(id)),
  fetchConfig: () => dispatch(fetchConfig()),
  fetchHomeOfficeWorkLog: (id) => dispatch(fetchHomeOfficeWorkLog(id)),
  fetchMaternityProtectionWorkLog: (id) => dispatch(fetchMaternityProtectionWorkLog(id)),
  fetchOvertimeWorkLog: (id) => dispatch(fetchOvertimeWorkLog(id)),
  fetchSickDayWorkLog: (id) => dispatch(fetchSickDayWorkLog(id)),
  fetchTimeOffWorkLog: (id) => dispatch(fetchTimeOffWorkLog(id)),
  fetchVacationWorkLog: (id) => dispatch(fetchVacationWorkLog(id)),
  fetchWorkHoursList: (uid) => dispatch(fetchWorkHoursList(uid)),
  fetchWorkLog: (id) => dispatch(fetchWorkLog(id)),
  fetchWorkMonth: (id) => dispatch(fetchWorkMonth(id)),
  fetchWorkMonthList: (uid) => dispatch(fetchWorkMonthList(uid)),
  markWaitingForApproval: (id) => dispatch(markWaitingForApproval(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WorkLogComponent);
