import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import {
  Route,
  Router,
  Switch,
} from 'react-router-dom';
import history from './history';
import routes from './routes';
import store from './store';
import ErrorPage from './pages/error';
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
import translator from './translator';

ReactDOM.render(
  (
    <Provider store={store}>
      <I18nextProvider i18n={translator}>
        <Router history={history} onUpdate={() => window.scrollTo(0, 0)}>
          <Switch>
            <AuthorizedRoute
              exact
              path={routes.index}
              roles={[ROLE_EMPLOYEE]}
              component={WorkLogPage}
            />
            <AuthorizedRoute
              exact
              path={routes.recentSpecialApprovalList}
              roles={[ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]}
              component={RecentSpecialApprovalListPage}
            />
            <AuthorizedRoute
              exact
              path={routes.specialApprovalList}
              roles={[ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]}
              component={SpecialApprovalListPage}
            />
            <AuthorizedRoute
              exact
              path={routes.supervisedUserWorkLog}
              roles={[ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]}
              component={SupervisedUserWorkLogPage}
            />
            <AuthorizedRoute
              exact
              path={routes.supervisedUserWorkLogWithDate}
              roles={[ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]}
              component={SupervisedUserWorkLogPage}
            />
            <AuthorizedRoute
              exact
              path={routes.supervisedUserList}
              roles={[ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]}
              component={SupervisedUserListPage}
            />
            <AuthorizedRoute
              exact
              path={routes.profile}
              roles={[ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]}
              component={UserProfilePage}
            />
            <AuthorizedRoute
              exact
              path={routes.addUser}
              roles={[ROLE_ADMIN, ROLE_SUPER_ADMIN]}
              component={AddUserPage}
            />
            <AuthorizedRoute
              exact
              path={routes.editUser}
              roles={[ROLE_ADMIN, ROLE_SUPER_ADMIN]}
              component={EditUserPage}
            />
            <AuthorizedRoute
              exact
              path={routes.userList}
              roles={[ROLE_ADMIN, ROLE_SUPER_ADMIN]}
              component={UserListPage}
            />
            <AuthorizedRoute
              exact
              path={routes.settings}
              roles={[ROLE_SUPER_ADMIN]}
              component={SettingsPage}
            />
            <Route
              exact
              path={routes.fastAccessAddWorkLog}
              component={FastAccessAddWorkLogPage}
            />
            <Route
              exact
              path={routes.login}
              component={LoginPage}
            />
            <Route
              exact
              path={routes.forgotPassword}
              component={ForgotPasswordPage}
            />
            <Route
              exact
              path={routes.newPassword}
              component={NewPasswordPage}
            />
            <Route component={ErrorPage} />
          </Switch>
        </Router>
      </I18nextProvider>
    </Provider>
  ),
  document.getElementById('app')
);
