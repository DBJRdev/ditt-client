import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  Card,
  CardBody,
  TextField,
} from '@react-ui-org/react-ui';
import {
  Icon,
  LoadingIcon,
} from '../../components/Icon';
import {
  SET_NEW_PASSWORD_SUCCESS,
  SET_NEW_PASSWORD_FAILURE,
} from '../../resources/auth/actionTypes';
import routes from '../../routes';
import LogoImage from './images/logo.svg';
import styles from './NewPassword.scss';

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
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.newPasswordHandler = this.newPasswordHandler.bind(this);
  }

  onChangeHandler(e) {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  onSubmitHandler(e) {
    e.preventDefault();

    this.newPasswordHandler(e);
  }

  newPasswordHandler(e) {
    if (this.state.newPassword !== this.state.newPasswordRepeat) {
      e.preventDefault();
      this.setState({ error: this.props.t('login:validation.passwordsNotSame') });

      return;
    }

    if (
      this.state.newPassword
      && (this.state.newPassword.length < 8 || this.state.newPassword.length > 64)
    ) {
      e.preventDefault();
      this.setState({
        error: this.props.t(
          'login:validation.passwordInvalidMinLength',
          {
            max: 64,
            min: 8,
          },
        ),
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
    const {
      isPosting,
      t,
    } = this.props;
    const {
      error,
      newPassword,
      newPasswordRepeat,
      isSubmitted,
    } = this.state;

    const layout = (children) => (
      <div className={styles.container}>
        <LogoImage
          alt={t('layout:title')}
          className={styles.logo}
          height={141}
          width={302}
        />
        {children}
      </div>
    );

    if (isSubmitted) {
      return layout((
        <p className={styles.message}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          {t('login:text.passwordSet')}
          {' '}
          <Link to={routes.login}>{t('login:action.login')}</Link>
        </p>
      ));
    }

    return layout((
      <div className={styles.box}>
        <div className={styles.title}>
          {t('layout:title')}
        </div>
        {error && (
          <div className="mb-5">
            <Alert
              icon={<Icon icon="error" />}
              type="error"
            >
              <strong>
                {t('general:text.error')}
                {': '}
              </strong>
              {error}
            </Alert>
          </div>
        )}
        <Card variant="bordered">
          <CardBody>
            <form
              onSubmit={this.onSubmitHandler}
            >
              <div className="mb-3">
                <TextField
                  autoComplete="new-password"
                  changeHandler={this.onChangeHandler}
                  fullWidth
                  id="newPassword"
                  label={t('login:element.newPassword')}
                  type="password"
                  required
                  value={newPassword ?? ''}
                />
                <TextField
                  autoComplete="new-password"
                  changeHandler={this.onChangeHandler}
                  fullWidth
                  id="newPasswordRepeat"
                  label={t('login:element.repeatNewPassword')}
                  type="password"
                  required
                  value={newPasswordRepeat ?? ''}
                />
              </div>
              <Button
                block
                label={t('login:action.changePassword')}
                loadingIcon={isPosting && <LoadingIcon />}
                type="submit"
              />
            </form>
            <div className={styles.footer}>
              <Link to={routes.login}>
                {t('login:action.login')}
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
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

export default withTranslation()(NewPasswordComponent);
