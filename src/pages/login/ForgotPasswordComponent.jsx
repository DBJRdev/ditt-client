import PropTypes from 'prop-types';
import React from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  FormLayout,
  TextField,
} from '@react-ui-org/react-ui';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import {
  Icon,
  LoadingIcon,
} from '../../components/Icon';
import LogoImage from '../../components/Logo/images/logo.svg';
import {
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_SUCCESS,
} from '../../resources/auth/actionTypes';
import routes from '../../routes';
import { TITLE } from '../../../config/envspecific';
import styles from './ForgotPassword.scss';

class ForgotPasswordComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      error: null,
      isSubmitted: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onResetPassword = this.onResetPassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();

    this.onResetPassword(e);
  }

  onResetPassword() {
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
          alt={TITLE}
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
          {TITLE}
        </div>
        {error && (
          <div className="mb-5">
            <Alert
              color="danger"
              icon={<Icon icon="error" />}
            >
              <strong>
                {t('general:text.error')}
                {': '}
              </strong>
              {error}
            </Alert>
          </div>
        )}
        <Card raised>
          <CardBody>
            <form onSubmit={this.onSubmit}>
              <FormLayout>
                <TextField
                  autoComplete="username"
                  fullWidth
                  id="email"
                  label={t('user:element.email')}
                  onChange={this.onChange}
                  required
                  type="email"
                  value={email ?? ''}
                />
                <Button
                  block
                  feedbackIcon={isPosting && <LoadingIcon />}
                  id="resetPasswordButton"
                  label={t('login:action.resetPassword')}
                  type="submit"
                />
              </FormLayout>
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
