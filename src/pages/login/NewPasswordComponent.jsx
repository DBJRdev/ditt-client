import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { NewPassword } from 'react-ui';
import routes from '../../routes';
import { NEW_PASSWORD_SUCCESS } from '../../resources/auth/actionTypes';
import styles from './Login.scss';
import logoImage from './images/logo.svg';

class NewPasswordComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isNotValid: false,
      isSubmitted: false,
      newPassword: null,
      newPasswordRepeat: null,
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.newPasswordHandler = this.newPasswordHandler.bind(this);
  }

  onChangeHandler(field, value) {
    this.setState({
      [field]: value,
    });
  }

  newPasswordHandler(e) {
    if (
      this.state.newPassword !== this.state.newPasswordRepeat
      || (this.state.newPassword && this.state.newPassword.length < 8)
    ) {
      e.preventDefault();
      this.setState({ isNotValid: true });

      return;
    }

    this.setState({ isNotValid: false });

    this.props.newPassword({
      newPlainPassword: this.state.newPassword,
      resetPasswordToken: this.props.match.params.resetPasswordToken,
    }).then((response) => {
      if (response.type === NEW_PASSWORD_SUCCESS) {
        this.setState({ isSubmitted: true });
      }
    });
  }

  render() {
    const layout = children => (
      <div className={styles.container}>
        <img
          src={logoImage}
          width={240}
          height={141}
          className={styles.logo}
          alt="DBJR Internal Time Tracking"
        />
        {children}
      </div>
    );

    if (this.props.isPosting) {
      return layout('Loading…');
    }

    if (this.state.isSubmitted) {
      return layout((
        <p className={styles.message}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          New password has been successfully set. <Link to={routes.login}>Go to login.</Link>
        </p>
      ));
    }

    return layout((
      <NewPassword
        footer={
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <Link to={routes.login}>
            Go to login
          </Link>
        }
        hasError={this.props.isPostingFailure || this.state.isNotValid}
        submitHandler={this.newPasswordHandler}
        onChangeHandler={this.onChangeHandler}
        title="DBJR Internal Time Tracking"
        usernameType="email"
      />
    ));
  }
}

NewPasswordComponent.propTypes = {
  isPosting: PropTypes.bool.isRequired,
  isPostingFailure: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      resetPasswordToken: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  newPassword: PropTypes.func.isRequired,
};

export default NewPasswordComponent;
