import { connect } from 'react-redux';
import ForgotPasswordComponent from './ForgotPasswordComponent';

const mapStateToProps = () => ({
  isPosting: false,
  isPostingFailure: false,
});

const mapDispatchToProps = dispatch => ({
  forgotPassword: () => dispatch(() => {}),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPasswordComponent);
