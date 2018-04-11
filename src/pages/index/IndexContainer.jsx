import { connect } from 'react-redux';
import {
  fetchWorkLogList,
  selectWorkLogList,
  selectWorkLogListMeta,
} from '../../resources/workLog';
import IndexComponent from './IndexComponent';

const mapStateToProps = (state) => {
  const meta = selectWorkLogListMeta(state);

  return ({
    isFetching: meta.isFetching,
    workLogList: selectWorkLogList(state),
  });
};

const mapDispatchToProps = dispatch => ({
  fetchWorkLogList: () => dispatch(fetchWorkLogList()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndexComponent);
