import React from 'react';
import ReactDOM from 'react-dom';
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
import IndexPage from './pages/workLog';
import LoginPage from './pages/login';
import SpecialApprovalListPage from './pages/specialApproval';
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
} from './pages/user';

ReactDOM.render(
  (
    <Provider store={store}>
      <Router history={history} onUpdate={() => window.scrollTo(0, 0)}>
        <Switch>
          <AuthorizedRoute
            exact
            path={routes.index}
            roles={[ROLE_EMPLOYEE]}
            component={IndexPage}
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
            path={routes.supervisedUserList}
            roles={[ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]}
            component={SupervisedUserListPage}
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
          <Route
            exact
            path={routes.login}
            component={LoginPage}
          />
          <Route component={ErrorPage} />
        </Switch>
      </Router>
    </Provider>
  ),
  document.getElementById('app')
);
