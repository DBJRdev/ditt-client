import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  Router,
  Route,
  Switch,
} from 'react-router-dom';
import history from './history';
import routes from './routes';
import store from './store';
import ErrorPage from './pages/error';
import IndexPage from './pages/index';

ReactDOM.render(
  (
    <Provider store={store}>
      <Router history={history} onUpdate={() => window.scrollTo(0, 0)}>
        <Switch>
          <Route exact path={routes.index} component={IndexPage} />
          <Route component={ErrorPage} />
        </Switch>
      </Router>
    </Provider>
  ),
  document.getElementById('app')
);
