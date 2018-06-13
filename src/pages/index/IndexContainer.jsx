import { connect } from 'react-redux';
import jwt from 'jsonwebtoken';
import {
  logout,
  selectJwtToken,
} from '../../resources/auth';
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
  selectWorkMonth,
  selectWorkMonthMeta,
  selectWorkMonthList,
  selectWorkMonthListMeta,
} from '../../resources/workMonth';
import IndexComponent from './IndexComponent';

const mapStateToProps = (state) => {
  const addWorkLogMeta = selectAddWorkLogMeta(state);
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
    isPosting: addWorkLogMeta.isPosting || deleteWorkLogMeta.isPosting,
    uid: decodedToken ? decodedToken.uid : null,
    workHoursList: selectWorkHoursList(state),
    workMonth: selectWorkMonth(state),
    workMonthList: selectWorkMonthList(state),
  });
};

const mapDispatchToProps = dispatch => ({
  addWorkLog: data => dispatch(addWorkLog(data)),
  deleteWorkLog: id => dispatch(deleteWorkLog(id)),
  fetchWorkHoursList: uid => dispatch(fetchWorkHoursList(uid)),
  fetchWorkMonth: id => dispatch(fetchWorkMonth(id)),
  fetchWorkMonthList: uid => dispatch(fetchWorkMonthList(uid)),
  logout: () => dispatch(logout()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndexComponent);
