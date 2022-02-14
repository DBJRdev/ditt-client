import { connect } from 'react-redux';
import { selectJwtToken } from '../../resources/auth';
import {
  fetchBusinessTripWorkLog,
  markBusinessTripWorkLogApproved,
  markBusinessTripWorkLogRejected,
  markMultipleBusinessTripWorkLogApproved,
  markMultipleBusinessTripWorkLogRejected,
  selectBusinessTripWorkLog,
  selectBusinessTripWorkLogMeta,
  selectBusinessTripWorkLogSupportMeta,
  supportBusinessTripWorkLog,
  supportMultipleBusinessTripWorkLog,
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
  markMultipleHomeOfficeWorkLogApproved,
  markMultipleHomeOfficeWorkLogRejected,
  selectHomeOfficeWorkLog,
  selectHomeOfficeWorkLogMeta,
  selectHomeOfficeWorkLogSupportMeta,
  supportHomeOfficeWorkLog,
  supportMultipleHomeOfficeWorkLog,
} from '../../resources/homeOfficeWorkLog';
import {
  fetchOvertimeWorkLog,
  markOvertimeWorkLogApproved,
  markOvertimeWorkLogRejected,
  markMultipleOvertimeWorkLogApproved,
  markMultipleOvertimeWorkLogRejected,
  selectOvertimeWorkLog,
  selectOvertimeWorkLogMeta,
  selectOvertimeWorkLogSupportMeta,
  supportMultipleOvertimeWorkLog,
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
  markMultipleTimeOffWorkLogApproved,
  markMultipleTimeOffWorkLogRejected,
  selectTimeOffWorkLog,
  selectTimeOffWorkLogMeta,
  selectTimeOffWorkLogSupportMeta,
  supportMultipleTimeOffWorkLog,
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
  supportMultipleVacationWorkLog,
  supportVacationWorkLog,
} from '../../resources/vacationWorkLog';
import {
  fetchSpecialApprovalList,
  selectSpecialApprovalList,
  selectSpecialApprovalListMeta,
} from '../../resources/workMonth';
import ListComponent from './ListComponent';

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
  const specialApprovalListMeta = selectSpecialApprovalListMeta(state);

  return ({
    businessTripWorkLog: selectBusinessTripWorkLog(state)?.toJS(),
    config: selectConfig(state)?.toJS(),
    homeOfficeWorkLog: selectHomeOfficeWorkLog(state)?.toJS(),
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
    overtimeWorkLog: selectOvertimeWorkLog(state)?.toJS(),
    specialApprovalList: selectSpecialApprovalList(state)?.toJS(),
    specialLeaveWorkLog: selectSpecialLeaveWorkLog(state)?.toJS(),
    timeOffWorkLog: selectTimeOffWorkLog(state)?.toJS(),
    token: selectJwtToken(state),
    vacationWorkLog: selectVacationWorkLog(state)?.toJS(),
  });
};

const mapDispatchToProps = (dispatch) => ({
  fetchBusinessTripWorkLog: (id) => dispatch(fetchBusinessTripWorkLog(id)),
  fetchConfig: () => dispatch(fetchConfig()),
  fetchHomeOfficeWorkLog: (id) => dispatch(fetchHomeOfficeWorkLog(id)),
  fetchOvertimeWorkLog: (id) => dispatch(fetchOvertimeWorkLog(id)),
  fetchSpecialApprovalList: (uid) => dispatch(fetchSpecialApprovalList(uid)),
  fetchSpecialLeaveWorkLog: (id) => dispatch(fetchSpecialLeaveWorkLog(id)),
  fetchTimeOffWorkLog: (id) => dispatch(fetchTimeOffWorkLog(id)),
  fetchVacationWorkLog: (id) => dispatch(fetchVacationWorkLog(id)),
  markBusinessTripWorkLogApproved: (id) => dispatch(markBusinessTripWorkLogApproved(id)),
  markBusinessTripWorkLogRejected: (id, data) => dispatch(
    markBusinessTripWorkLogRejected(id, data),
  ),
  markHomeOfficeWorkLogApproved: (id) => dispatch(markHomeOfficeWorkLogApproved(id)),
  markHomeOfficeWorkLogRejected: (id, data) => dispatch(markHomeOfficeWorkLogRejected(id, data)),
  markMultipleBusinessTripWorkLogApproved: (ids) => dispatch(
    markMultipleBusinessTripWorkLogApproved(ids),
  ),
  markMultipleBusinessTripWorkLogRejected: (ids, data) => dispatch(
    markMultipleBusinessTripWorkLogRejected(ids, data),
  ),
  markMultipleHomeOfficeWorkLogApproved: (ids) => dispatch(
    markMultipleHomeOfficeWorkLogApproved(ids),
  ),
  markMultipleHomeOfficeWorkLogRejected: (ids, data) => dispatch(
    markMultipleHomeOfficeWorkLogRejected(ids, data),
  ),
  markMultipleOvertimeWorkLogApproved: (ids) => dispatch(
    markMultipleOvertimeWorkLogApproved(ids),
  ),
  markMultipleOvertimeWorkLogRejected: (ids, data) => dispatch(
    markMultipleOvertimeWorkLogRejected(ids, data),
  ),
  markMultipleSpecialLeaveWorkLogApproved: (ids) => dispatch(
    markMultipleSpecialLeaveWorkLogApproved(ids),
  ),
  markMultipleSpecialLeaveWorkLogRejected: (ids, data) => dispatch(
    markMultipleSpecialLeaveWorkLogRejected(ids, data),
  ),
  markMultipleTimeOffWorkLogApproved: (ids) => dispatch(
    markMultipleTimeOffWorkLogApproved(ids),
  ),
  markMultipleTimeOffWorkLogRejected: (ids, data) => dispatch(
    markMultipleTimeOffWorkLogRejected(ids, data),
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
  supportMultipleBusinessTripWorkLog: (id) => dispatch(supportMultipleBusinessTripWorkLog(id)),
  supportMultipleHomeOfficeWorkLog: (id) => dispatch(supportMultipleHomeOfficeWorkLog(id)),
  supportMultipleOvertimeWorkLog: (id) => dispatch(supportMultipleOvertimeWorkLog(id)),
  supportMultipleSpecialLeaveWorkLog: (id) => dispatch(supportMultipleSpecialLeaveWorkLog(id)),
  supportMultipleTimeOffWorkLog: (id) => dispatch(supportMultipleTimeOffWorkLog(id)),
  supportMultipleVacationWorkLog: (id) => dispatch(supportMultipleVacationWorkLog(id)),
  supportOvertimeWorkLog: (id) => dispatch(supportOvertimeWorkLog(id)),
  supportSpecialLeaveWorkLog: (id) => dispatch(supportSpecialLeaveWorkLog(id)),
  supportTimeOffWorkLog: (id) => dispatch(supportTimeOffWorkLog(id)),
  supportVacationWorkLog: (id) => dispatch(supportVacationWorkLog(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListComponent);
