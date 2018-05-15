import { connect } from 'react-redux';
import {
  login,
  selectJwtMeta,
} from '../../resources/auth';
import LoginComponent from './LoginComponent';

const mapStateToProps = (state) => {
  const jwtMeta = selectJwtMeta(state);

  return ({
    isPosting: jwtMeta.isPosting,
    isPostingFailure: jwtMeta.isPostingFailure,
  });
};

const mapDispatchToProps = dispatch => ({
  login: data => dispatch(login(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);
