import history from '../routerHistory';
import routes from '../routes';
import { reset } from '../resources/auth';

const apiErrorHandlerMiddleware = (store) => (next) => (action) => {
  if (
    history.location.pathname !== routes.login
    && typeof action.payload !== 'undefined'
    && action.error
    && (action.payload.status === 401 || action.payload.status === 403)
  ) {
    store.dispatch(reset());
    history.push(routes.login);

    return false;
  }
  return next(action);
};

export default apiErrorHandlerMiddleware;
