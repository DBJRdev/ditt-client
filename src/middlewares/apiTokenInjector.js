import { RSAA } from 'redux-api-middleware';
import { matchPath } from 'react-router-dom';

const apiTokenInjectorMiddleware = () => (next) => (action) => {
  const callApi = action[RSAA];

  if (callApi) {
    const match = matchPath(
      window.location.pathname,
      { path: '/fast-access/:apiToken' },
    );

    if (match && match.params.apiToken) {
      callApi.headers = {
        ...callApi.headers,
        apiToken: match.params.apiToken,
      };

      return next({
        ...action,
        [RSAA]: callApi,
      });
    }
  }

  return next(action);
};

export default apiTokenInjectorMiddleware;
