import { connect } from 'react-redux';
import { selectJwtToken } from '../../resources/auth';
import {
  fetchUserList,
  selectUserList,
  selectUserListMeta,
} from '../../resources/user';
import ListComponent from './ListComponent';

const mapStateToProps = (state) => {
  const userListMeta = selectUserListMeta(state);

  return ({
    isFetching: userListMeta.isFetching,
    token: selectJwtToken(state),
    userList: selectUserList(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  fetchUserList: (options) => dispatch(fetchUserList(options)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListComponent);
