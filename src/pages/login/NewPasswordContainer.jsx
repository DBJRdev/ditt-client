import { connect } from 'react-redux';
import {
  newPassword,
  selectNewPasswordMeta,
} from '../../resources/auth';
import NewPasswordComponent from './NewPasswordComponent';

const mapStateToProps = (state) => {
  const newPasswordMeta = selectNewPasswordMeta(state);

  return ({
    isPosting: newPasswordMeta.isPosting,
    isPostingFailure: newPasswordMeta.isPostingFailure,
  });
};

const mapDispatchToProps = dispatch => ({
  newPassword: data => dispatch(newPassword(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewPasswordComponent);
