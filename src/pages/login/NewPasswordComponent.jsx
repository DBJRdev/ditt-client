import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { NewPassword } from 'react-ui';
import routes from '../../routes';
import {
  SET_NEW_PASSWORD_SUCCESS,
  SET_NEW_PASSWORD_FAILURE,
} from '../../resources/auth/actionTypes';
import styles from './Login.scss';
import logoImage from './images/logo.svg';

class NewPasswordComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
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
    if (this.state.newPassword !== this.state.newPasswordRepeat) {
      e.preventDefault();
      this.setState({ error: this.props.t('login:validation.passwordsNotSame') });

      return;
    }

    if (this.state.newPassword && this.state.newPassword.length < 8) {
      e.preventDefault();
      this.setState({
        error: this.props.t('login:validation.passwordInvalidMinLength', { min: 8 }),
      });

      return;
    }

    this.setState({ error: null });

    this.props.setNewPassword({
      newPlainPassword: this.state.newPassword,
      resetPasswordToken: this.props.match.params.resetPasswordToken,
    }).then((response) => {
      if (response.type === SET_NEW_PASSWORD_SUCCESS) {
        this.setState({ isSubmitted: true });
      } else if (response.type === SET_NEW_PASSWORD_FAILURE) {
        this.setState({ error: response.payload.response.detail });
      }
    });
  }

  render() {
    const { t } = this.props;
    const layout = children => (
      <div className={styles.container}>
        <img
          src={logoImage}
          width={302}
          height={141}
          className={styles.logo}
          alt={t('layout:title')}
        />
        {children}
      </div>
    );

    if (this.props.isPosting) {
      return layout(t('general:text.loading'));
    }

    if (this.state.isSubmitted) {
      return layout((
        <p className={styles.message}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          {t('login:text.passwordSet')} <Link to={routes.login}>{t('login:action.login')}</Link>
        </p>
      ));
    }

    return layout((
      <NewPassword
        error={this.state.error}
        footer={
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <Link to={routes.login}>
            {t('login:action.login')}
          </Link>
        }
        submitHandler={this.newPasswordHandler}
        onChangeHandler={this.onChangeHandler}
        title={t('layout:title')}
        translations={{
          changePassword: t('login:action.changePassword'),
          newPassword: t('login:element.newPassword'),
          repeatNewPassword: t('login:element.repeatNewPassword'),
        }}
        usernameType="email"
      />
    ));
  }
}

NewPasswordComponent.propTypes = {
  isPosting: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      resetPasswordToken: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  setNewPassword: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(NewPasswordComponent);
