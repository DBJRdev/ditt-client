import { connect } from 'react-redux';
import {
  addWorkLog,
  selectAddWorkLogMeta,
} from '../../resources/workLog';
import WorkLogTimerButtonComponent from './WorkLogTimerButtonComponent';

const mapStateToProps = (state) => ({
  isPosting: selectAddWorkLogMeta(state).isPosting,
});

const mapDispatchToProps = (dispatch) => ({
  onSave: (workLog) => dispatch(addWorkLog(workLog)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WorkLogTimerButtonComponent);
