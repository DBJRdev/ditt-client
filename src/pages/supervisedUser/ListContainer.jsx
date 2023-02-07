import { connect } from 'react-redux';
import { selectJwtToken } from '../../resources/auth';
import {
  fetchSupervisedUserList,
  selectSupervisedUserList,
  selectSupervisedUserListMeta,
} from '../../resources/user';
import ListComponent from './ListComponent';

const mapStateToProps = (state) => {
  const userListMeta = selectSupervisedUserListMeta(state);

  return ({
    isFetching: userListMeta.isFetching,
    supervisedUserList: selectSupervisedUserList(state),
    token: selectJwtToken(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  fetchSupervisedUserList: (uid) => dispatch(fetchSupervisedUserList(uid)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListComponent);
