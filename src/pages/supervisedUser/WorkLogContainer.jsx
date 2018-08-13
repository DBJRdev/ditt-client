import Immutable from 'immutable';
import { connect } from 'react-redux';
import {
  fetchBusinessTripWorkLog,
  selectBusinessTripWorkLog,
} from '../../resources/businessTripWorkLog';
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
  STATUS_OPENED,
} from '../../resources/workMonth';
import WorkLogComponent from './WorkLogComponent';

const mapStateToProps = (state) => {
  const workHourListMeta = selectWorkHoursListMeta(state);
  const workMonthListMeta = selectWorkMonthListMeta(state);
  const workMonthMeta = selectWorkMonthMeta(state);
  let workMonth = selectWorkMonth(state);

  if (workMonth && workMonth.get('status') === STATUS_OPENED) {
    workMonth = workMonth.set('workLogs', Immutable.List([]));
  }

  return ({
    businessTripWorkLog: selectBusinessTripWorkLog(state),
    homeOfficeWorkLog: selectHomeOfficeWorkLog(state),
    isFetching: workHourListMeta.isFetching
      || workMonthListMeta.isFetching
      || workMonthMeta.isFetching,
    isPosting: workMonthMeta.isPosting,
    overtimeWorkLog: selectOvertimeWorkLog(state),
    sickDayWorkLog: selectSickDayWorkLog(state),
    timeOffWorkLog: selectTimeOffWorkLog(state),
    vacationWorkLog: selectVacationWorkLog(state),
    workHoursList: selectWorkHoursList(state),
    workLog: selectWorkLog(state),
    workMonth,
    workMonthList: selectWorkMonthList(state),
  });
};

const mapDispatchToProps = dispatch => ({
  fetchBusinessTripWorkLog: id => dispatch(fetchBusinessTripWorkLog(id)),
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
