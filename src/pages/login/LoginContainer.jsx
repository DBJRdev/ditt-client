import { connect } from 'react-redux';
import {
  login,
  resetLogoutLocally,
  selectIsLoggedOutLocally,
  selectJwtToken,
  selectJwtMeta,
} from '../../resources/auth';
import LoginComponent from './LoginComponent';

const mapStateToProps = (state) => {
  const jwtMeta = selectJwtMeta(state);

  return ({
    isLoggedOutLocally: selectIsLoggedOutLocally(state),
    isPosting: jwtMeta.isPosting,
    isPostingFailure: jwtMeta.isPostingFailure,
    token: selectJwtToken(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  login: (data) => dispatch(login(data)),
  resetLogoutLocally: () => dispatch(resetLogoutLocally()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginComponent);
