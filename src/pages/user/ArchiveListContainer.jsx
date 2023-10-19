import { connect } from 'react-redux';
import { selectJwtToken } from '../../resources/auth';
import {
  fetchUserList,
  fetchUserListPartial,
  selectUserList,
  selectUserListMeta,
  selectUserListPartial,
  selectUserListPartialMeta,
} from '../../resources/user';
import ListComponent from './ArchiveListComponent';

const mapStateToProps = (state) => {
  const userListMeta = selectUserListMeta(state);
  const userListPartialMeta = selectUserListPartialMeta(state);

  return ({
    isFetching: userListMeta.isFetching,
    isFetchingPartial: userListPartialMeta.isFetching,
    token: selectJwtToken(state),
    userList: selectUserList(state),
    userListPartial: selectUserListPartial(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  fetchUserList: (isArchived) => dispatch(fetchUserList(isArchived)),
  fetchUserListPartial: (isArchived) => dispatch(fetchUserListPartial(isArchived)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListComponent);
