import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
} from '@react-ui-org/react-ui';
import { withTranslation } from 'react-i18next';
import {
  useHistory,
  Link,
} from 'react-router-dom';
import {
  ROLE_ADMIN,
  ROLE_EMPLOYEE,
  ROLE_SUPER_ADMIN,
} from '../../resources/user';
import routes from '../../routes';
import { Logo } from '../Logo';
import { getLogoPath } from './helpers/getLogoPath';
import styles from './styles.scss';

const HeaderComponent = ({
  logout,
  user,
  t,
}) => {
  const history = useHistory();
  const isAuthorized = (roles) => user.roles.some((role) => roles.includes(role));

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Link to={getLogoPath(user.roles)}>
          <Logo />
        </Link>
        <span className={styles.title}>{t('layout:title')}</span>
      </div>
      {isAuthorized([ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]) && (
        <div className={styles.navigation}>
          <Toolbar align="baseline" justify="space-between">
            <ToolbarGroup dense>
              {isAuthorized([ROLE_EMPLOYEE]) && (
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
              {isAuthorized([ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]) && (
                <ToolbarItem>
                  <Button
                    label={t('layout:menu.specialApprovals')}
                    onClick={() => history.push(routes.specialApprovalList)}
                    priority="outline"
                  />
                </ToolbarItem>
              )}
              {isAuthorized([ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]) && (
                <ToolbarItem>
                  <Button
                    label={t('layout:menu.supervisedUsers')}
                    onClick={() => history.push(routes.supervisedUserList)}
                    priority="outline"
                  />
                </ToolbarItem>
              )}
              {isAuthorized([ROLE_ADMIN, ROLE_SUPER_ADMIN]) && (
                <ToolbarItem>
                  <Button
                    label={t('layout:menu.users')}
                    onClick={() => history.push(routes.userList)}
                    priority="outline"
                  />
                </ToolbarItem>
              )}
              {isAuthorized([ROLE_SUPER_ADMIN]) && (
                <ToolbarItem>
                  <Button
                    label={t('layout:menu.hrChangesAndAbsenceRegistration')}
                    onClick={() => history.push(routes.hrChangesAndAbsenceRegistration)}
                    priority="outline"
                  />
                </ToolbarItem>
              )}
              {isAuthorized([ROLE_SUPER_ADMIN]) && (
                <ToolbarItem>
                  <Button
                    label={t('layout:menu.hrYearOverview')}
                    onClick={() => history.push(routes.hrYearOverview)}
                    priority="outline"
                  />
                </ToolbarItem>
              )}
              {isAuthorized([ROLE_SUPER_ADMIN]) && (
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
                  label={`${user.firstName} ${user.lastName}`}
                  onClick={() => history.push(routes.profile)}
                  priority="flat"
                />
              </ToolbarItem>
              <ToolbarItem>
                <Button
                  label={t('layout:menu.logout')}
                  onClick={logout}
                  priority="flat"
                />
              </ToolbarItem>
            </ToolbarGroup>
          </Toolbar>
        </div>
      )}
    </header>
  );
};

HeaderComponent.propTypes = {
  logout: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default withTranslation()(HeaderComponent);
