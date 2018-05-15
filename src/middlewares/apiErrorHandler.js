import history from 'history';
import routes from '../routes';

const apiErrorHandlerMiddleware = () => next => (action) => {
  if (history.location.pathname !== routes.login
    && typeof action.payload !== 'undefined' && action.error && action.payload.status === 401
  ) {
    history.push(routes.login);

    return false;
  }
  return next(action);
};

export default apiErrorHandlerMiddleware;
