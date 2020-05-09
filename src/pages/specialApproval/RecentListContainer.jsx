import { connect } from 'react-redux';
import { selectJwtToken } from '../../resources/auth';
import {
  fetchBusinessTripWorkLog,
  markBusinessTripWorkLogApproved,
  markBusinessTripWorkLogRejected,
  selectBusinessTripWorkLog,
  selectBusinessTripWorkLogMeta,
  selectBusinessTripWorkLogSupportMeta,
  supportBusinessTripWorkLog,
} from '../../resources/businessTripWorkLog';
import {
  fetchConfig,
  selectConfig,
  selectConfigMeta,
} from '../../resources/config';
import {
  fetchHomeOfficeWorkLog,
  markHomeOfficeWorkLogApproved,
  markHomeOfficeWorkLogRejected,
  selectHomeOfficeWorkLog,
  selectHomeOfficeWorkLogMeta,
  selectHomeOfficeWorkLogSupportMeta,
  supportHomeOfficeWorkLog,
} from '../../resources/homeOfficeWorkLog';
import {
  fetchOvertimeWorkLog,
  markOvertimeWorkLogApproved,
  markOvertimeWorkLogRejected,
  selectOvertimeWorkLog,
  selectOvertimeWorkLogMeta,
  selectOvertimeWorkLogSupportMeta,
  supportOvertimeWorkLog,
} from '../../resources/overtimeWorkLog';
import {
  fetchSpecialLeaveWorkLog,
  markMultipleSpecialLeaveWorkLogApproved,
  markMultipleSpecialLeaveWorkLogRejected,
  markSpecialLeaveWorkLogApproved,
  markSpecialLeaveWorkLogRejected,
  selectSpecialLeaveWorkLog,
  selectSpecialLeaveWorkLogMeta,
  selectSpecialLeaveWorkLogSupportMeta,
  supportMultipleSpecialLeaveWorkLog,
  supportSpecialLeaveWorkLog,
} from '../../resources/specialLeaveWorkLog';
import {
  fetchTimeOffWorkLog,
  markTimeOffWorkLogApproved,
  markTimeOffWorkLogRejected,
  selectTimeOffWorkLog,
  selectTimeOffWorkLogMeta,
  selectTimeOffWorkLogSupportMeta,
  supportTimeOffWorkLog,
} from '../../resources/timeOffWorkLog';
import {
  fetchVacationWorkLog,
  markMultipleVacationWorkLogApproved,
  markMultipleVacationWorkLogRejected,
  markVacationWorkLogApproved,
  markVacationWorkLogRejected,
  selectVacationWorkLog,
  selectVacationWorkLogMeta,
  selectVacationWorkLogSupportMeta,
  supportVacationWorkLog,
  supportMultipleVacationWorkLog,
} from '../../resources/vacationWorkLog';
import {
  fetchRecentSpecialApprovalList,
  selectRecentSpecialApprovalList,
  selectRecentSpecialApprovalListMeta,
} from '../../resources/workMonth';
import RecentListComponent from './RecentListComponent';

const mapStateToProps = (state) => {
  const businessTripWorkLogMeta = selectBusinessTripWorkLogMeta(state);
  const businessTripWorkLogSupportMeta = selectBusinessTripWorkLogSupportMeta(state);
  const configMeta = selectConfigMeta(state);
  const homeOfficeWorkLogMeta = selectHomeOfficeWorkLogMeta(state);
  const homeOfficeWorkLogSupportMeta = selectHomeOfficeWorkLogSupportMeta(state);
  const overtimeWorkLogMeta = selectOvertimeWorkLogMeta(state);
  const overtimeWorkLogSupportMeta = selectOvertimeWorkLogSupportMeta(state);
  const specialLeaveWorkLogMeta = selectSpecialLeaveWorkLogMeta(state);
  const specialLeaveWorkLogSupportMeta = selectSpecialLeaveWorkLogSupportMeta(state);
  const timeOffWorkLogMeta = selectTimeOffWorkLogMeta(state);
  const timeOffWorkLogSupportMeta = selectTimeOffWorkLogSupportMeta(state);
  const vacationWorkLogMeta = selectVacationWorkLogMeta(state);
  const vacationWorkLogSupportMeta = selectVacationWorkLogSupportMeta(state);
  const specialApprovalListMeta = selectRecentSpecialApprovalListMeta(state);

  return ({
    businessTripWorkLog: selectBusinessTripWorkLog(state),
    config: selectConfig(state),
    homeOfficeWorkLog: selectHomeOfficeWorkLog(state),
    isFetching: configMeta.isFetching
      || specialApprovalListMeta.isFetching,
    isPosting: businessTripWorkLogMeta.isPosting
      || businessTripWorkLogSupportMeta.isPosting
      || homeOfficeWorkLogMeta.isPosting
      || homeOfficeWorkLogSupportMeta.isPosting
      || overtimeWorkLogMeta.isPosting
      || overtimeWorkLogSupportMeta.isPosting
      || specialLeaveWorkLogMeta.isPosting
      || specialLeaveWorkLogSupportMeta.isPosting
      || timeOffWorkLogMeta.isPosting
      || timeOffWorkLogSupportMeta.isPosting
      || vacationWorkLogMeta.isPosting
      || vacationWorkLogSupportMeta.isPosting,
    overtimeWorkLog: selectOvertimeWorkLog(state),
    specialApprovalList: selectRecentSpecialApprovalList(state),
    specialLeaveWorkLog: selectSpecialLeaveWorkLog(state),
    timeOffWorkLog: selectTimeOffWorkLog(state),
    token: selectJwtToken(state),
    vacationWorkLog: selectVacationWorkLog(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  fetchBusinessTripWorkLog: (id) => dispatch(fetchBusinessTripWorkLog(id)),
  fetchConfig: () => dispatch(fetchConfig()),
  fetchHomeOfficeWorkLog: (id) => dispatch(fetchHomeOfficeWorkLog(id)),
  fetchOvertimeWorkLog: (id) => dispatch(fetchOvertimeWorkLog(id)),
  fetchSpecialApprovalList: (uid) => dispatch(fetchRecentSpecialApprovalList(uid)),
  fetchSpecialLeaveWorkLog: (id) => dispatch(fetchSpecialLeaveWorkLog(id)),
  fetchTimeOffWorkLog: (id) => dispatch(fetchTimeOffWorkLog(id)),
  fetchVacationWorkLog: (id) => dispatch(fetchVacationWorkLog(id)),
  markBusinessTripWorkLogApproved: (id) => dispatch(markBusinessTripWorkLogApproved(id)),
  markBusinessTripWorkLogRejected: (id, data) => dispatch(
    markBusinessTripWorkLogRejected(id, data),
  ),
  markHomeOfficeWorkLogApproved: (id) => dispatch(markHomeOfficeWorkLogApproved(id)),
  markHomeOfficeWorkLogRejected: (id, data) => dispatch(markHomeOfficeWorkLogRejected(id, data)),
  markMultipleSpecialLeaveWorkLogApproved: (ids) => dispatch(
    markMultipleSpecialLeaveWorkLogApproved(ids),
  ),
  markMultipleSpecialLeaveWorkLogRejected: (ids, data) => dispatch(
    markMultipleSpecialLeaveWorkLogRejected(ids, data),
  ),
  markMultipleVacationWorkLogApproved: (ids) => dispatch(markMultipleVacationWorkLogApproved(ids)),
  markMultipleVacationWorkLogRejected: (ids, data) => dispatch(
    markMultipleVacationWorkLogRejected(ids, data),
  ),
  markOvertimeWorkLogApproved: (id) => dispatch(markOvertimeWorkLogApproved(id)),
  markOvertimeWorkLogRejected: (id, data) => dispatch(markOvertimeWorkLogRejected(id, data)),
  markSpecialLeaveWorkLogApproved: (id) => dispatch(markSpecialLeaveWorkLogApproved(id)),
  markSpecialLeaveWorkLogRejected: (id, data) => dispatch(
    markSpecialLeaveWorkLogRejected(id, data),
  ),
  markTimeOffWorkLogApproved: (id) => dispatch(markTimeOffWorkLogApproved(id)),
  markTimeOffWorkLogRejected: (id, data) => dispatch(markTimeOffWorkLogRejected(id, data)),
  markVacationWorkLogApproved: (id) => dispatch(markVacationWorkLogApproved(id)),
  markVacationWorkLogRejected: (id, data) => dispatch(markVacationWorkLogRejected(id, data)),
  supportBusinessTripWorkLog: (id) => dispatch(supportBusinessTripWorkLog(id)),
  supportHomeOfficeWorkLog: (id) => dispatch(supportHomeOfficeWorkLog(id)),
  supportMultipleSpecialLeaveWorkLog: (id) => dispatch(supportMultipleSpecialLeaveWorkLog(id)),
  supportMultipleVacationWorkLog: (id) => dispatch(supportMultipleVacationWorkLog(id)),
  supportOvertimeWorkLog: (id) => dispatch(supportOvertimeWorkLog(id)),
  supportSpecialLeaveWorkLog: (id) => dispatch(supportSpecialLeaveWorkLog(id)),
  supportTimeOffWorkLog: (id) => dispatch(supportTimeOffWorkLog(id)),
  supportVacationWorkLog: (id) => dispatch(supportVacationWorkLog(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RecentListComponent);
