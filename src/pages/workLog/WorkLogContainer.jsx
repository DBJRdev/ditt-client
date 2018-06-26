import { connect } from 'react-redux';
import jwt from 'jsonwebtoken';
import { selectJwtToken } from '../../resources/auth';
import {
  addBusinessTripWorkLog,
  selectBusinessTripWorkLogMeta,
} from '../../resources/businessTripWorkLog';
import {
  addHomeOfficeWorkLog,
  selectHomeOfficeWorkLogMeta,
} from '../../resources/homeOfficeWorkLog';
import {
  addTimeOffWorkLog,
  selectTimeOffWorkLogMeta,
} from '../../resources/timeOffWorkLog';
import {
  fetchWorkHoursList,
  selectWorkHoursList,
  selectWorkHoursListMeta,
} from '../../resources/workHours';
import {
  addWorkLog,
  deleteWorkLog,
  selectAddWorkLogMeta,
  selectDeleteWorkLogMeta,
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
  const homeOfficeWorkLogMeta = selectHomeOfficeWorkLogMeta(state);
  const timeOffWorkLogMeta = selectTimeOffWorkLogMeta(state);
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
    isFetching: workHourListMeta.isFetching
      || workMonthListMeta.isFetching
      || workMonthMeta.isFetching,
    isPosting: addWorkLogMeta.isPosting
      || businessTripWorkLogMeta.isPosting
      || deleteWorkLogMeta.isPosting
      || homeOfficeWorkLogMeta.isPosting
      || timeOffWorkLogMeta.isPosting
      || workMonthMeta.isPosting,
    uid: decodedToken ? decodedToken.uid : null,
    workHoursList: selectWorkHoursList(state),
    workMonth: selectWorkMonth(state),
    workMonthList: selectWorkMonthList(state),
  });
};

const mapDispatchToProps = dispatch => ({
  addBusinessTripWorkLog: data => dispatch(addBusinessTripWorkLog(data)),
  addHomeOfficeWorkLog: data => dispatch(addHomeOfficeWorkLog(data)),
  addTimeOffWorkLog: data => dispatch(addTimeOffWorkLog(data)),
  addWorkLog: data => dispatch(addWorkLog(data)),
  deleteWorkLog: id => dispatch(deleteWorkLog(id)),
  fetchWorkHoursList: uid => dispatch(fetchWorkHoursList(uid)),
  fetchWorkMonth: id => dispatch(fetchWorkMonth(id)),
  fetchWorkMonthList: uid => dispatch(fetchWorkMonthList(uid)),
  markWaitingForApproval: id => dispatch(markWaitingForApproval(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkLogComponent);
