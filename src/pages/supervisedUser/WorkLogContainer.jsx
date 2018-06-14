import { connect } from 'react-redux';
import {
  logout,
} from '../../resources/auth';
import {
  fetchWorkHoursList,
  selectWorkHoursList,
  selectWorkHoursListMeta,
} from '../../resources/workHours';
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
  const workHourListMeta = selectWorkHoursListMeta(state);
  const workMonthListMeta = selectWorkMonthListMeta(state);
  const workMonthMeta = selectWorkMonthMeta(state);

  return ({
    isFetching: workHourListMeta.isFetching
      || workMonthListMeta.isFetching
      || workMonthMeta.isFetching,
    isPosting: workMonthMeta.isPosting,
    workHoursList: selectWorkHoursList(state),
    workMonth: selectWorkMonth(state),
    workMonthList: selectWorkMonthList(state),
  });
};

const mapDispatchToProps = dispatch => ({
  fetchWorkHoursList: uid => dispatch(fetchWorkHoursList(uid)),
  fetchWorkMonth: id => dispatch(fetchWorkMonth(id)),
  fetchWorkMonthList: uid => dispatch(fetchWorkMonthList(uid)),
  logout: () => dispatch(logout()),
  markApproved: id => dispatch(markApproved(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkLogComponent);
