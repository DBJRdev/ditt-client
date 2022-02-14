import { connect } from 'react-redux';
import {
  markWaitingForApproval, selectWorkMonthMeta,
} from '../../../../resources/workMonth';
import WorkLogCalendarLowerToolbarComponent from './WorkLogCalendarLowerToolbarComponent';

const mapStateToProps = (state) => ({
  isPosting: selectWorkMonthMeta(state).isPosting,
});

const mapDispatchToProps = (dispatch) => ({
  markWaitingForApproval: (id) => dispatch(markWaitingForApproval(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WorkLogCalendarLowerToolbarComponent);
