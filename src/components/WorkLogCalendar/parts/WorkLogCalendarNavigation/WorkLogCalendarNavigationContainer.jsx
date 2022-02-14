import { connect } from 'react-redux';
import {
  markApproved,
  selectWorkMonthMeta,
} from '../../../../resources/workMonth';
import WorkLogCalendarNavigationComponent from './WorkLogCalendarNavigationComponent';

const mapStateToProps = (state) => ({
  isPosting: selectWorkMonthMeta(state).isPosting,
});

const mapDispatchToProps = (dispatch) => ({
  markApproved: (id) => dispatch(markApproved(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WorkLogCalendarNavigationComponent);
