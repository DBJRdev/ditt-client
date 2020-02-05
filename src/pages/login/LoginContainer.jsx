import { connect } from 'react-redux';
import {
  login,
  selectJwtToken,
  selectJwtMeta,
} from '../../resources/auth';
import LoginComponent from './LoginComponent';

const mapStateToProps = (state) => {
  const jwtMeta = selectJwtMeta(state);

  return ({
    isPosting: jwtMeta.isPosting,
    isPostingFailure: jwtMeta.isPostingFailure,
    token: selectJwtToken(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  login: (data) => dispatch(login(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginComponent);
