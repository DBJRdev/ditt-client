import { connect } from 'react-redux';
import {
  addWorkLog,
  deleteWorkLog,
  fetchWorkLogList,
  selectAddWorkLogMeta,
  selectDeleteWorkLogMeta,
  selectWorkLogList,
  selectWorkLogListMeta,
} from '../../resources/workLog';
import IndexComponent from './IndexComponent';

const mapStateToProps = (state) => {
  const addWorkLogMeta = selectAddWorkLogMeta(state);
  const deleteWorkLogMeta = selectDeleteWorkLogMeta(state);
  const workLogListMeta = selectWorkLogListMeta(state);

  return ({
    isFetchingWorkLogList: workLogListMeta.isFetching,
    isPostingWorkLog: addWorkLogMeta.isPosting || deleteWorkLogMeta.isPosting,
    workLogList: selectWorkLogList(state),
  });
};

const mapDispatchToProps = dispatch => ({
  addWorkLog: data => dispatch(addWorkLog(data)),
  deleteWorkLog: id => dispatch(deleteWorkLog(id)),
  fetchWorkLogList: () => dispatch(fetchWorkLogList()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndexComponent);
