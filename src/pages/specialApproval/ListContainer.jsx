import { connect } from 'react-redux';
import { selectJwtToken } from '../../resources/auth';
import {
  fetchSpecialApprovalList,
  selectSpecialApprovalList,
  selectSpecialApprovalListMeta,
} from '../../resources/workMonth';
import ListComponent from './ListComponent';

const mapStateToProps = (state) => {
  const specialApprovalListMeta = selectSpecialApprovalListMeta(state);

  return ({
    isFetching: specialApprovalListMeta.isFetching,
    specialApprovalList: selectSpecialApprovalList(state),
    token: selectJwtToken(state),
  });
};

const mapDispatchToProps = dispatch => ({
  fetchSpecialApprovalList: uid => dispatch(fetchSpecialApprovalList(uid)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListComponent);
