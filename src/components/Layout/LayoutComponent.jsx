import PropTypes from 'prop-types';
import React from 'react';
import jwt from 'jsonwebtoken';
import { withNamespaces } from 'react-i18next';
import { Button } from 'react-ui';
import { Link } from 'react-router-dom';
import {
  ROLE_ADMIN,
  ROLE_EMPLOYEE,
  ROLE_SUPER_ADMIN,
} from '../../resources/user';
import history from '../../history';
import routes from '../../routes';
import styles from './Layout.scss';
import logoImage from './images/logo.svg';

class LayoutComponent extends React.Component {
  getIndexUrl() {
    if (this.props.token) {
      const decodedToken = jwt.decode(this.props.token);

      if (decodedToken) {
        const { roles } = decodedToken;

        if (roles.includes(ROLE_EMPLOYEE)) {
          return routes.index;
        }

        if (roles.includes(ROLE_ADMIN) || roles.includes(ROLE_SUPER_ADMIN)) {
          return routes.userList;
        }

        return routes.login;
      }
    }

    return null;
  }

  getName() {
    if (this.props.token) {
      const decodedToken = jwt.decode(this.props.token);

      if (decodedToken) {
        return `${decodedToken.firstName} ${decodedToken.lastName}`;
      }
    }

    return null;
  }

  isAuthorized(roles) {
    if (this.props.token) {
      const decodedToken = jwt.decode(this.props.token);

      if (decodedToken) {
        return decodedToken.roles.some(role => roles.includes(role));
      }
    }

    return false;
  }

  render() {
    const { t } = this.props;

    let logo = (
      <img
        src={logoImage}
        width={183}
        height={85}
        className={styles.logo}
        alt={t('layout:title')}
      />
    );

    if (this.getIndexUrl()) {
      logo = (
        <Link to={this.getIndexUrl()}>
          {logo}
        </Link>
      );
    }

    return (
      <div>
        {this.isAuthorized([ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]) && (
          <header className={styles.header}>
            <div className={styles.brand}>
              {logo}
              <span className={styles.title}>{t('layout:title')}</span>
            </div>
            <div className={styles.navigation}>
              {this.isAuthorized([ROLE_EMPLOYEE]) && (
                <div className={styles.navigationItem}>
                  <Button
                    clickHandler={() => history.push(routes.index)}
                    label={t('layout:menu.workLogs')}
                    priority="default"
                  />
                </div>
              )}
              {this.isAuthorized([ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]) && (
                <div className={styles.navigationItem}>
                  <Button
                    clickHandler={() => history.push(routes.specialApprovalList)}
                    label={t('layout:menu.specialApprovals')}
                    priority="default"
                  />
                </div>
              )}
              {this.isAuthorized([ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]) && (
                <div className={styles.navigationItem}>
                  <Button
                    clickHandler={() => history.push(routes.supervisedUserList)}
                    label={t('layout:menu.supervisedUsers')}
                    priority="default"
                  />
                </div>
              )}
              {this.isAuthorized([ROLE_ADMIN, ROLE_SUPER_ADMIN]) && (
                <div className={styles.navigationItem}>
                  <Button
                    clickHandler={() => history.push(routes.userList)}
                    label={t('layout:menu.users')}
                    priority="default"
                  />
                </div>
              )}
              {this.isAuthorized([ROLE_SUPER_ADMIN]) && (
                <div className={styles.navigationItem}>
                  <Button
                    clickHandler={() => history.push(routes.settings)}
                    label={t('layout:menu.settings')}
                    priority="default"
                  />
                </div>
              )}
              <div className={styles.navigationItem}>
                <Button
                  clickHandler={() => history.push(routes.profile)}
                  label={this.getName()}
                  priority="flat"
                />
              </div>
              <div className={styles.navigationItem}>
                <Button
                  clickHandler={this.props.logout}
                  label={t('layout:menu.logout')}
                  priority="flat"
                />
              </div>
            </div>
          </header>
        )}
        <main className={styles.main}>
          <div className={styles.body}>
            <h1 className={styles.bodyTitle}>{this.props.title}</h1>
            {
              this.props.loading
                ? t('general:text.loading')
                : this.props.children
            }
          </div>
        </main>
      </div>
    );
  }
}

LayoutComponent.defaultProps = {
  children: null,
  loading: false,
  token: null,
};

LayoutComponent.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  loading: PropTypes.bool,
  logout: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  token: PropTypes.string,
};

export default withNamespaces()(LayoutComponent);
