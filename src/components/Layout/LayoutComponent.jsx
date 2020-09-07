import PropTypes from 'prop-types';
import React from 'react';
import jwt from 'jsonwebtoken';
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
import logoImage from './images/logo.svg';

class LayoutComponent extends React.Component {
  constructor(props) {
    super(props);

    this.jwtTokenTimer = null;
  }

  componentDidMount() {
    this.jwtTokenTimer = setInterval(() => {
      if (this.props.token) {
        const decodedToken = jwt.decode(this.props.token);

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
        return decodedToken.roles.some((role) => roles.includes(role));
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
              <Toolbar align="baseline" justify="space-between">
                <ToolbarGroup dense>
                  {this.isAuthorized([ROLE_EMPLOYEE]) && (
                    <ToolbarItem>
                      <Button
                        clickHandler={() => {
                          if (history.location.pathname === routes.index) {
                            window.location.reload();
                          } else {
                            history.push(routes.index);
                          }
                        }}
                        label={t('layout:menu.workLogs')}
                        priority="outline"
                      />
                    </ToolbarItem>
                  )}
                  {this.isAuthorized([ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]) && (
                    <ToolbarItem>
                      <Button
                        clickHandler={() => history.push(routes.specialApprovalList)}
                        label={t('layout:menu.specialApprovals')}
                        priority="outline"
                      />
                    </ToolbarItem>
                  )}
                  {this.isAuthorized([ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]) && (
                    <ToolbarItem>
                      <Button
                        clickHandler={() => history.push(routes.supervisedUserList)}
                        label={t('layout:menu.supervisedUsers')}
                        priority="outline"
                      />
                    </ToolbarItem>
                  )}
                  {this.isAuthorized([ROLE_ADMIN, ROLE_SUPER_ADMIN]) && (
                    <ToolbarItem>
                      <Button
                        clickHandler={() => history.push(routes.userList)}
                        label={t('layout:menu.users')}
                        priority="outline"
                      />
                    </ToolbarItem>
                  )}
                  {this.isAuthorized([ROLE_SUPER_ADMIN]) && (
                    <ToolbarItem>
                      <Button
                        clickHandler={() => history.push(routes.hrChangesAndAbsenceRegistration)}
                        label={t('layout:menu.hrChangesAndAbsenceRegistration')}
                        priority="outline"
                      />
                    </ToolbarItem>
                  )}
                  {this.isAuthorized([ROLE_SUPER_ADMIN]) && (
                    <ToolbarItem>
                      <Button
                        clickHandler={() => history.push(routes.hrYearOverview)}
                        label={t('layout:menu.hrYearOverview')}
                        priority="outline"
                      />
                    </ToolbarItem>
                  )}
                  {this.isAuthorized([ROLE_SUPER_ADMIN]) && (
                    <ToolbarItem>
                      <Button
                        clickHandler={() => history.push(routes.settings)}
                        label={t('layout:menu.settings')}
                        priority="outline"
                      />
                    </ToolbarItem>
                  )}
                </ToolbarGroup>
                <ToolbarGroup>
                  <ToolbarItem>
                    <Button
                      clickHandler={() => history.push(routes.profile)}
                      label={this.getName()}
                      priority="link"
                    />
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button
                      clickHandler={this.props.logout}
                      label={t('layout:menu.logout')}
                      priority="link"
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
