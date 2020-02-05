import { connect } from 'react-redux';
import {
  setNewPassword,
  selectSetNewPasswordMeta,
} from '../../resources/auth';
import NewPasswordComponent from './NewPasswordComponent';

const mapStateToProps = (state) => {
  const setNewPasswordMeta = selectSetNewPasswordMeta(state);

  return ({
    isPosting: setNewPasswordMeta.isPosting,
  });
};

const mapDispatchToProps = (dispatch) => ({
  setNewPassword: (data) => dispatch(setNewPassword(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewPasswordComponent);
