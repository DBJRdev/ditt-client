import { CALL_API } from 'redux-api-middleware';
import { matchPath } from 'react-router-dom';

const apiTokenInjectorMiddleware = () => next => (action) => {
  const callApi = action[CALL_API];

  if (callApi) {
    const match = matchPath(
      window.location.pathname,
      { path: '/fast-access/:apiToken' }
    );

    if (match && match.params.apiToken) {
      callApi.headers = Object.assign({}, callApi.headers, {
        apiToken: match.params.apiToken,
      });

      return next(Object.assign({}, action, { [CALL_API]: callApi }));
    }
  }

  return next(action);
};

export default apiTokenInjectorMiddleware;
