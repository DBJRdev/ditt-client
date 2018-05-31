import { connect } from 'react-redux';
import jwt from 'jsonwebtoken';
import {
  fetchWorkHoursList,
  selectWorkHoursList,
  selectWorkHoursListMeta,
} from '../../resources/workHours';
import {
  addWorkLog,
  deleteWorkLog,
  fetchWorkLogList,
  selectAddWorkLogMeta,
  selectDeleteWorkLogMeta,
  selectWorkLogList,
  selectWorkLogListMeta,
} from '../../resources/workLog';
import {
  logout,
  selectJwtToken,
} from '../../resources/auth';
import IndexComponent from './IndexComponent';

const mapStateToProps = (state) => {
  const addWorkLogMeta = selectAddWorkLogMeta(state);
  const deleteWorkLogMeta = selectDeleteWorkLogMeta(state);
  const workHourListMeta = selectWorkHoursListMeta(state);
  const workLogListMeta = selectWorkLogListMeta(state);

  let decodedToken = null;
  const token = selectJwtToken(state);
  if (token !== null) {
    decodedToken = jwt.decode(token);
  }

  return ({
    isFetching: workLogListMeta.isFetching || workHourListMeta.isFetching,
    isPosting: addWorkLogMeta.isPosting || deleteWorkLogMeta.isPosting,
    uid: decodedToken ? decodedToken.uid : null,
    workHoursList: selectWorkHoursList(state),
    workLogList: selectWorkLogList(state),
  });
};

const mapDispatchToProps = dispatch => ({
  addWorkLog: data => dispatch(addWorkLog(data)),
  deleteWorkLog: id => dispatch(deleteWorkLog(id)),
  fetchWorkHoursList: uid => dispatch(fetchWorkHoursList(uid)),
  fetchWorkLogList: uid => dispatch(fetchWorkLogList(uid)),
  logout: () => dispatch(logout()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndexComponent);
