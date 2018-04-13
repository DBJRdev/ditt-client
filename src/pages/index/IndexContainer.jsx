import { connect } from 'react-redux';
import {
  addWorkLog,
  fetchWorkLogList,
  selectAddWorkLogMeta,
  selectWorkLogList,
  selectWorkLogListMeta,
} from '../../resources/workLog';
import IndexComponent from './IndexComponent';

const mapStateToProps = (state) => {
  const addWorkLogMeta = selectAddWorkLogMeta(state);
  const workLogListMeta = selectWorkLogListMeta(state);

  return ({
    isFetchingWorkLogList: workLogListMeta.isFetching,
    isPostingWorkLog: addWorkLogMeta.isPosting,
    workLogList: selectWorkLogList(state),
  });
};

const mapDispatchToProps = dispatch => ({
  addWorkLog: data => dispatch(addWorkLog(data)),
  fetchWorkLogList: () => dispatch(fetchWorkLogList()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndexComponent);
