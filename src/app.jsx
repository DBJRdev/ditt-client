import React from 'react';
import { Provider } from 'react-redux';
import {
  Route,
  Router,
  Switch,
} from 'react-router-dom';
import routes from './routes';
import { ReactUiProvider } from './components/ReactUiProvider';
import ErrorPage from './pages/error';
import {
  ChangesAndAbsenceRegistrationPage,
  YearOverviewPage,
} from './pages/hr';
import {
  ForgotPasswordPage,
  LoginPage,
  NewPasswordPage,
} from './pages/login';
import { SettingsPage } from './pages/settings';
import {
  ListContainer as SpecialApprovalListPage,
  RecentListContainer as RecentSpecialApprovalListPage,
} from './pages/specialApproval';
import {
  ListContainer as SupervisedUserListPage,
  WorkLogContainer as SupervisedUserWorkLogPage,
} from './pages/supervisedUser';
import AuthorizedRoute from './resources/auth/components/AuthorizedRoute';
import {
  ROLE_ADMIN,
  ROLE_EMPLOYEE,
  ROLE_SUPER_ADMIN,
} from './resources/user';
import {
  AddContainer as AddUserPage,
  EditContainer as EditUserPage,
  ListContainer as UserListPage,
  ProfileContainer as UserProfilePage,
} from './pages/user';
import {
  FastAccessAddWorkLogPage,
  WorkLogPage,
} from './pages/workLog';
import { registerAuthRefreshTokenService } from './services/authService';
import './translator';

export default (store, history) => {
  registerAuthRefreshTokenService(store);

  return (
    <Provider store={store}>
      <ReactUiProvider>
        <Router history={history} onUpdate={() => window.scrollTo(0, 0)}>
          <Switch>
            <AuthorizedRoute
              component={WorkLogPage}
              exact
              path={routes.index}
              roles={[ROLE_EMPLOYEE]}
            />
            <AuthorizedRoute
              component={RecentSpecialApprovalListPage}
              exact
              path={routes.recentSpecialApprovalList}
              roles={[ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]}
            />
            <AuthorizedRoute
              component={SpecialApprovalListPage}
              exact
              path={routes.specialApprovalList}
              roles={[ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]}
            />
            <AuthorizedRoute
              component={SupervisedUserWorkLogPage}
              exact
              path={routes.supervisedUserWorkLog}
              roles={[ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]}
            />
            <AuthorizedRoute
              component={SupervisedUserWorkLogPage}
              exact
              path={routes.supervisedUserWorkLogWithDate}
              roles={[ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]}
            />
            <AuthorizedRoute
              component={SupervisedUserListPage}
              exact
              path={routes.supervisedUserList}
              roles={[ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]}
            />
            <AuthorizedRoute
              component={UserProfilePage}
              exact
              path={routes.profile}
              roles={[ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]}
            />
            <AuthorizedRoute
              component={AddUserPage}
              exact
              path={routes.addUser}
              roles={[ROLE_ADMIN, ROLE_SUPER_ADMIN]}
            />
            <AuthorizedRoute
              component={EditUserPage}
              exact
              path={routes.editUser}
              roles={[ROLE_ADMIN, ROLE_SUPER_ADMIN]}
            />
            <AuthorizedRoute
              component={UserListPage}
              exact
              path={routes.userList}
              roles={[ROLE_ADMIN, ROLE_SUPER_ADMIN]}
            />
            <AuthorizedRoute
              component={ChangesAndAbsenceRegistrationPage}
              exact
              path={routes.hrChangesAndAbsenceRegistration}
              roles={[ROLE_SUPER_ADMIN]}
            />
            <AuthorizedRoute
              component={YearOverviewPage}
              exact
              path={routes.hrYearOverview}
              roles={[ROLE_SUPER_ADMIN]}
            />
            <AuthorizedRoute
              component={SettingsPage}
              exact
              path={routes.settings}
              roles={[ROLE_SUPER_ADMIN]}
            />
            <Route
              component={FastAccessAddWorkLogPage}
              exact
              path={routes.fastAccessAddWorkLog}
            />
            <Route
              component={LoginPage}
              exact
              path={routes.login}
            />
            <Route
              component={ForgotPasswordPage}
              exact
              path={routes.forgotPassword}
            />
            <Route
              component={NewPasswordPage}
              exact
              path={routes.newPassword}
            />
            <Route component={ErrorPage} />
          </Switch>
        </Router>
      </ReactUiProvider>
    </Provider>
  );
};
