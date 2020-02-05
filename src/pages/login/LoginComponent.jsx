import PropTypes from 'prop-types';
import React from 'react';
import jwt from 'jsonwebtoken';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Login } from 'react-ui';
import {
  ROLE_ADMIN,
  ROLE_EMPLOYEE,
  ROLE_SUPER_ADMIN,
} from '../../resources/user';
import routes from '../../routes';
import styles from './Login.scss';
import logoImage from './images/logo.svg';

class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: null,
      username: null,
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  componentDidMount() {
    if (this.props.token) {
      const decodedToken = jwt.decode(this.props.token);

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

  onChangeHandler(field, value) {
    this.setState({
      [field]: value,
    });
  }

  render() {
    const { t } = this.props;

    return (
      <div className={styles.container}>
        <img
          src={logoImage}
          width={302}
          height={141}
          className={styles.logo}
          alt={t('layout:title')}
        />
        {
          this.props.isPosting
            ? t('general:text.loading')
            : (
              <Login
                footer={(
                  // eslint-disable-next-line jsx-a11y/anchor-is-valid
                  <Link to={routes.forgotPassword}>
                    {t('login:action.forgotPassword')}
                  </Link>
                )}
                hasError={this.props.isPostingFailure}
                submitHandler={() => {
                  this.props.login({
                    password: this.state.password,
                    username: this.state.username,
                  });

                  return false;
                }}
                onChangeHandler={this.onChangeHandler}
                title={t('layout:title')}
                translations={{
                  email: t('user:element.email'),
                  invalidUsernameOrPassword: t('login:validation.invalidUsernameOrPassword'),
                  password: t('user:element.plainPassword'),
                  signIn: t('login:action.signIn'),
                }}
                usernameType="email"
              />
            )
        }
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
  isPosting: PropTypes.bool.isRequired,
  isPostingFailure: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  token: PropTypes.string,
};

export default withTranslation()(LoginComponent);
