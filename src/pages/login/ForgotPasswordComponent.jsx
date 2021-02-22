import PropTypes from 'prop-types';
import React from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  TextField,
} from '@react-ui-org/react-ui';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import {
  Icon,
  LoadingIcon,
} from '../../components/Icon';
import {
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_SUCCESS,
} from '../../resources/auth/actionTypes';
import routes from '../../routes';
import LogoImage from './images/logo.svg';
import styles from './ForgotPassword.scss';

class ForgotPasswordComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      error: null,
      isSubmitted: false,
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.resetPasswordHandler = this.resetPasswordHandler.bind(this);
  }

  onChangeHandler(e) {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  onSubmitHandler(e) {
    e.preventDefault();

    this.resetPasswordHandler(e);
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
    const {
      isPosting,
      t,
    } = this.props;
    const {
      email,
      error,
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
          {t('login:text.passwordReset')}
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
            <form onSubmit={this.onSubmitHandler}>
              <div className="mb-3">
                <TextField
                  autoComplete="username"
                  changeHandler={this.onChangeHandler}
                  fullWidth
                  id="email"
                  label={t('user:element.email')}
                  type="email"
                  required
                  value={email ?? ''}
                />
              </div>
              <Button
                block
                id="resetPasswordButton"
                label={t('login:action.resetPassword')}
                loadingIcon={isPosting && <LoadingIcon />}
                type="submit"
              />
            </form>
            <div
              className={styles.footer}
            >
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

ForgotPasswordComponent.propTypes = {
  isPosting: PropTypes.bool.isRequired,
  resetPassword: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(ForgotPasswordComponent);
