import PropTypes from 'prop-types';
import React from 'react';
import decode from 'jwt-decode';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardBody,
  Alert,
  TextField,
} from '@react-ui-org/react-ui';
import {
  Icon,
  LoadingIcon,
} from '../../components/Icon';
import {
  ROLE_ADMIN,
  ROLE_EMPLOYEE,
  ROLE_SUPER_ADMIN,
} from '../../resources/user';
import routes from '../../routes';
import styles from './Login.scss';
import LogoImage from './images/logo.svg';

class LoginComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: null,
      username: null,
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
  }

  componentDidMount() {
    if (this.props.token) {
      const decodedToken = decode(this.props.token);

      if (decodedToken) {
        const { roles } = decodedToken;

        if (roles.includes(ROLE_ADMIN) || roles.includes(ROLE_SUPER_ADMIN)) {
          this.props.history.push(routes.userList);
        } else if (roles.includes(ROLE_EMPLOYEE)) {
          this.props.history.push(routes.index);
        }
      }
    }
  }

  onChangeHandler(e) {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  onSubmitHandler(e) {
    const {
      login,
      resetLogoutLocally,
    } = this.props;
    const {
      password,
      username,
    } = this.state;

    e.preventDefault();

    resetLogoutLocally();
    login({
      password,
      username,
    });
  }

  render() {
    const {
      isPosting,
      isPostingFailure,
      isLoggedOutLocally,
      t,
    } = this.props;
    const {
      password,
      username,
    } = this.state;

    return (
      <div className={styles.container}>
        <LogoImage
          alt={t('layout:title')}
          className={styles.logo}
          height={141}
          width={302}
        />
        <div className={styles.box}>
          <div className={styles.title}>
            {t('layout:title')}
          </div>
          {(isPostingFailure || isLoggedOutLocally) && (
            <div className="mb-5">
              <Alert
                icon={<Icon icon="error" />}
                type="error"
              >
                <strong>
                  {t('general:text.error')}
                  {': '}
                </strong>
                {
                  isLoggedOutLocally
                    ? t('login:text.loggedOutAutomatically')
                    : t('login:validation.invalidUsernameOrPassword')
                }
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
                    autoComplete="username"
                    changeHandler={this.onChangeHandler}
                    fullWidth
                    id="username"
                    label={t('user:element.email')}
                    type="email"
                    required
                    value={username ?? ''}
                  />
                  <TextField
                    autoComplete="current-password"
                    changeHandler={this.onChangeHandler}
                    fullWidth
                    id="password"
                    label={t('user:element.plainPassword')}
                    type="password"
                    required
                    value={password ?? ''}
                  />
                </div>
                <Button
                  block
                  id="signInButton"
                  label={t('login:action.signIn')}
                  loadingIcon={isPosting && <LoadingIcon />}
                  type="submit"
                />
              </form>
              <div className={styles.footer}>
                <Link to={routes.forgotPassword}>
                  {t('login:action.forgotPassword')}
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }
}

LoginComponent.defaultProps = {
  token: null,
};

LoginComponent.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  isLoggedOutLocally: PropTypes.bool.isRequired,
  isPosting: PropTypes.bool.isRequired,
  isPostingFailure: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
  resetLogoutLocally: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  token: PropTypes.string,
};

export default withTranslation()(LoginComponent);
