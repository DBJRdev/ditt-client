import { connect } from 'react-redux';
import { selectJwtToken } from '../../resources/auth';
import {
  markBusinessTripWorkLogApproved,
  markBusinessTripWorkLogRejected,
  selectBusinessTripWorkLogMeta,
} from '../../resources/businessTripWorkLog';
import {
  markHomeOfficeWorkLogApproved,
  markHomeOfficeWorkLogRejected,
  selectHomeOfficeWorkLogMeta,
} from '../../resources/homeOfficeWorkLog';
import {
  markTimeOffWorkLogApproved,
  markTimeOffWorkLogRejected,
  selectTimeOffWorkLogMeta,
} from '../../resources/timeOffWorkLog';
import {
  fetchSpecialApprovalList,
  selectSpecialApprovalList,
  selectSpecialApprovalListMeta,
} from '../../resources/workMonth';
import ListComponent from './ListComponent';

const mapStateToProps = (state) => {
  const businessTripWorkLogMeta = selectBusinessTripWorkLogMeta(state);
  const homeOfficeWorkLogMeta = selectHomeOfficeWorkLogMeta(state);
  const timeOffWorkLogMeta = selectTimeOffWorkLogMeta(state);
  const specialApprovalListMeta = selectSpecialApprovalListMeta(state);

  return ({
    isFetching: specialApprovalListMeta.isFetching,
    isPosting: businessTripWorkLogMeta.isPosting
      || homeOfficeWorkLogMeta.isPosting
      || timeOffWorkLogMeta.isPosting,
    specialApprovalList: selectSpecialApprovalList(state),
    token: selectJwtToken(state),
  });
};

const mapDispatchToProps = dispatch => ({
  fetchSpecialApprovalList: uid => dispatch(fetchSpecialApprovalList(uid)),
  markBusinessTripWorkLogApproved: id => dispatch(markBusinessTripWorkLogApproved(id)),
  markBusinessTripWorkLogRejected: (id, data) =>
    dispatch(markBusinessTripWorkLogRejected(id, data)),
  markHomeOfficeWorkLogApproved: id => dispatch(markHomeOfficeWorkLogApproved(id)),
  markHomeOfficeWorkLogRejected: (id, data) => dispatch(markHomeOfficeWorkLogRejected(id, data)),
  markTimeOffWorkLogApproved: id => dispatch(markTimeOffWorkLogApproved(id)),
  markTimeOffWorkLogRejected: (id, data) => dispatch(markTimeOffWorkLogRejected(id, data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListComponent);
