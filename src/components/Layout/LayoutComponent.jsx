import PropTypes from 'prop-types';
import React from 'react';
import decode from 'jwt-decode';
import { withTranslation } from 'react-i18next';
import {
  Button,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
} from '@react-ui-org/react-ui';
import { Link } from 'react-router-dom';
import {
  ROLE_ADMIN,
  ROLE_EMPLOYEE,
  ROLE_SUPER_ADMIN,
} from '../../resources/user';
import history from '../../routerHistory';
import routes from '../../routes';
import styles from './Layout.scss';
import LogoImage from './images/logo.svg';

class LayoutComponent extends React.Component {
  constructor(props) {
    super(props);

    this.jwtTokenTimer = null;
  }

  componentDidMount() {
    this.jwtTokenTimer = setInterval(() => {
      if (this.props.token) {
        const decodedToken = decode(this.props.token);

        if (decodedToken && ((decodedToken.exp * 1000) - Date.now()) < 0) {
          this.props.setLogoutLocally();
          clearInterval(this.jwtTokenTimer);
        }
      }
    }, 15000);
  }

  componentWillUnmount() {
    clearInterval(this.jwtTokenTimer);
  }

  getIndexUrl() {
    if (this.props.token) {
      const decodedToken = decode(this.props.token);

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
      const decodedToken = decode(this.props.token);

      if (decodedToken) {
        return `${decodedToken.firstName} ${decodedToken.lastName}`;
      }
    }

    return null;
  }

  isAuthorized(roles) {
    if (this.props.token) {
      const decodedToken = decode(this.props.token);

      if (decodedToken) {
        return decodedToken.roles.some((role) => roles.includes(role));
      }
    }

    return false;
  }

  render() {
    const { t } = this.props;

    let logo = (
      <LogoImage
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
              <Toolbar align="baseline" justify="space-between">
                <ToolbarGroup dense>
                  {this.isAuthorized([ROLE_EMPLOYEE]) && (
                    <ToolbarItem>
                      <Button
                        label={t('layout:menu.workLogs')}
                        onClick={() => {
                          if (history.location.pathname === routes.index) {
                            window.location.reload();
                          } else {
                            history.push(routes.index);
                          }
                        }}
                        priority="outline"
                      />
                    </ToolbarItem>
                  )}
                  {this.isAuthorized([ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]) && (
                    <ToolbarItem>
                      <Button
                        label={t('layout:menu.specialApprovals')}
                        onClick={() => history.push(routes.specialApprovalList)}
                        priority="outline"
                      />
                    </ToolbarItem>
                  )}
                  {this.isAuthorized([ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]) && (
                    <ToolbarItem>
                      <Button
                        label={t('layout:menu.supervisedUsers')}
                        onClick={() => history.push(routes.supervisedUserList)}
                        priority="outline"
                      />
                    </ToolbarItem>
                  )}
                  {this.isAuthorized([ROLE_ADMIN, ROLE_SUPER_ADMIN]) && (
                    <ToolbarItem>
                      <Button
                        label={t('layout:menu.users')}
                        onClick={() => history.push(routes.userList)}
                        priority="outline"
                      />
                    </ToolbarItem>
                  )}
                  {this.isAuthorized([ROLE_SUPER_ADMIN]) && (
                    <ToolbarItem>
                      <Button
                        label={t('layout:menu.hrChangesAndAbsenceRegistration')}
                        onClick={() => history.push(routes.hrChangesAndAbsenceRegistration)}
                        priority="outline"
                      />
                    </ToolbarItem>
                  )}
                  {this.isAuthorized([ROLE_SUPER_ADMIN]) && (
                    <ToolbarItem>
                      <Button
                        label={t('layout:menu.hrYearOverview')}
                        onClick={() => history.push(routes.hrYearOverview)}
                        priority="outline"
                      />
                    </ToolbarItem>
                  )}
                  {this.isAuthorized([ROLE_SUPER_ADMIN]) && (
                    <ToolbarItem>
                      <Button
                        label={t('layout:menu.settings')}
                        onClick={() => history.push(routes.settings)}
                        priority="outline"
                      />
                    </ToolbarItem>
                  )}
                </ToolbarGroup>
                <ToolbarGroup>
                  <ToolbarItem>
                    <Button
                      label={this.getName()}
                      onClick={() => history.push(routes.profile)}
                      priority="flat"
                    />
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button
                      label={t('layout:menu.logout')}
                      onClick={this.props.logout}
                      priority="flat"
                    />
                  </ToolbarItem>
                </ToolbarGroup>
              </Toolbar>
            </div>
          </header>
        )}
        <main className={styles.main}>
          <div className={styles.body}>
            {this.props.title && (
              <h1 className={styles.bodyTitle}>{this.props.title}</h1>
            )}
            {
              this.props.loading
                ? t('general:text.loading')
                : this.props.children
            }
          </div>
        </main>
        <footer className={styles.footer}>
          <p>
            {t('layout:title')}
            {window.dittLastUpdate && (
              <>
                {' | '}
                {t('layout:text.lastUpdate', { date: window.dittLastUpdate || '' })}
              </>
            )}
          </p>
        </footer>
      </div>
    );
  }
}

LayoutComponent.defaultProps = {
  children: null,
  loading: false,
  title: null,
  token: null,
};

LayoutComponent.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  loading: PropTypes.bool,
  logout: PropTypes.func.isRequired,
  setLogoutLocally: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  title: PropTypes.string,
  token: PropTypes.string,
};

export default withTranslation()(LayoutComponent);
