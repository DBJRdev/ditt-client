import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { ForgotPassword } from 'react-ui';
import {
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_SUCCESS,
} from '../../resources/auth/actionTypes';
import routes from '../../routes';
import styles from './Login.scss';
import logoImage from './images/logo.svg';

class ForgotPasswordComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      error: null,
      isSubmitted: false,
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.resetPasswordHandler = this.resetPasswordHandler.bind(this);
  }

  onChangeHandler(field, value) {
    this.setState({
      [field]: value,
    });
  }

  resetPasswordHandler() {
    this.props.resetPassword({
      email: this.state.email,
    }).then((response) => {
      if (response.type === RESET_PASSWORD_SUCCESS) {
        this.setState({
          error: null,
          isSubmitted: true,
        });
      } else if (response.type === RESET_PASSWORD_FAILURE) {
        this.setState({ error: response.payload.response.detail });
      }
    });

    return false;
  }

  render() {
    const { t } = this.props;
    const layout = children => (
      <div className={styles.container}>
        <img
          src={logoImage}
          width={240}
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
          {t('login:text.passwordReset')}
        </p>
      ));
    }

    return layout((
      <ForgotPassword
        error={this.state.error}
        footer={
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <Link to={routes.login}>
            {t('login:action.login')}
          </Link>
        }
        submitHandler={this.resetPasswordHandler}
        onChangeHandler={this.onChangeHandler}
        title={t('layout:title')}
        translations={{
          email: t('user:element.email'),
          resetPassword: t('login:action.resetPassword'),
        }}
        usernameType="email"
      />
    ));
  }
}

ForgotPasswordComponent.propTypes = {
  isPosting: PropTypes.bool.isRequired,
  resetPassword: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(ForgotPasswordComponent);
