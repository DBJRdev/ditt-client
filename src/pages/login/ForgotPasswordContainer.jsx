import { connect } from 'react-redux';
import {
  resetPassword,
  selectResetPasswordMeta,
} from '../../resources/auth';
import ForgotPasswordComponent from './ForgotPasswordComponent';

const mapStateToProps = (state) => {
  const resetPasswordMeta = selectResetPasswordMeta(state);

  return ({
    isPosting: resetPasswordMeta.isPosting,
    isPostingFailure: resetPasswordMeta.isPostingFailure,
  });
};

const mapDispatchToProps = dispatch => ({
  resetPassword: data => dispatch(resetPassword(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPasswordComponent);
