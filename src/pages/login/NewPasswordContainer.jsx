import { connect } from 'react-redux';
import NewPasswordComponent from './NewPasswordComponent';

const mapStateToProps = () => ({
  isPosting: false,
  isPostingFailure: false,
});

const mapDispatchToProps = dispatch => ({
  newPassword: () => dispatch(() => {}),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewPasswordComponent);
