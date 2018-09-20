import { connect } from 'react-redux';
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
  fetchOvertimeWorkLog,
  selectOvertimeWorkLog,
} from '../../resources/overtimeWorkLog';
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
    isPosting: workMonthMeta.isPosting,
    overtimeWorkLog: selectOvertimeWorkLog(state),
    sickDayWorkLog: selectSickDayWorkLog(state),
    timeOffWorkLog: selectTimeOffWorkLog(state),
    vacationWorkLog: selectVacationWorkLog(state),
    workHoursList: selectWorkHoursList(state),
    workLog: selectWorkLog(state),
    workMonth: selectWorkMonth(state),
    workMonthList: selectWorkMonthList(state),
  });
};

const mapDispatchToProps = dispatch => ({
  fetchBusinessTripWorkLog: id => dispatch(fetchBusinessTripWorkLog(id)),
  fetchConfig: () => dispatch(fetchConfig()),
  fetchHomeOfficeWorkLog: id => dispatch(fetchHomeOfficeWorkLog(id)),
  fetchOvertimeWorkLog: id => dispatch(fetchOvertimeWorkLog(id)),
  fetchSickDayWorkLog: id => dispatch(fetchSickDayWorkLog(id)),
  fetchTimeOffWorkLog: id => dispatch(fetchTimeOffWorkLog(id)),
  fetchVacationWorkLog: id => dispatch(fetchVacationWorkLog(id)),
  fetchWorkHoursList: uid => dispatch(fetchWorkHoursList(uid)),
  fetchWorkLog: id => dispatch(fetchWorkLog(id)),
  fetchWorkMonth: id => dispatch(fetchWorkMonth(id)),
  fetchWorkMonthList: uid => dispatch(fetchWorkMonthList(uid)),
  markApproved: id => dispatch(markApproved(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkLogComponent);
