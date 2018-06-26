import PropTypes from 'prop-types';
import React from 'react';
import jwt from 'jsonwebtoken';
import { Button } from 'react-ui';
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
    return (
      <div>
        {this.isAuthorized([ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]) && (
          <header className={styles.header}>
            <div className={styles.brand}>
              <img
                src={logoImage}
                width={180}
                height={85}
                className={styles.logo}
                alt="DBJR Internal Time Tracking"
              />
              <span className={styles.title}>DBJR Internal Time Tracking</span>
            </div>
            <div className={styles.navigation}>
              {this.isAuthorized([ROLE_EMPLOYEE]) && (
                <div className={styles.navigationItem}>
                  <Button
                    clickHandler={() => history.push(routes.index)}
                    label="Work logs"
                    priority="default"
                  />
                </div>
              )}
              {this.isAuthorized([ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]) && (
                <div className={styles.navigationItem}>
                  <Button
                    clickHandler={() => history.push(routes.specialApprovalList)}
                    label="Special approvals"
                    priority="default"
                  />
                </div>
              )}
              {this.isAuthorized([ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]) && (
                <div className={styles.navigationItem}>
                  <Button
                    clickHandler={() => history.push(routes.supervisedUserList)}
                    label="Supervised users"
                    priority="default"
                  />
                </div>
              )}
              {this.isAuthorized([ROLE_ADMIN, ROLE_SUPER_ADMIN]) && (
                <div className={styles.navigationItem}>
                  <Button
                    clickHandler={() => history.push(routes.userList)}
                    label="Users"
                    priority="default"
                  />
                </div>
              )}
              <div className={styles.navigationItem}>
                <Button
                  clickHandler={this.props.logout}
                  label="Logout"
                  priority="flat"
                />
              </div>
            </div>
          </header>
        )}
        <main className={styles.main}>
          <div className={styles.body}>
            <h1 className={styles.bodyTitle}>{this.props.title}</h1>
            {this.props.loading ? 'Loading…' : this.props.children}
          </div>
        </main>
      </div>
    );
  }
}

LayoutComponent.defaultProps = {
  loading: false,
  token: null,
};

LayoutComponent.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  loading: PropTypes.bool,
  logout: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  token: PropTypes.string,
};

export default LayoutComponent;
