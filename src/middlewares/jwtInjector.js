import { RSAA } from 'redux-api-middleware';
import { selectJwtToken } from '../resources/auth/index';

const jwtInjectorMiddleware = (store) => (next) => (action) => {
  const callApi = action[RSAA];

  if (callApi) {
    const jwt = selectJwtToken(store.getState());
    if (jwt) {
      callApi.headers = {
        ...callApi.headers,
        Authorization: `Bearer ${jwt}`,
      };

      return next({
        ...action,
        [RSAA]: callApi,
      });
    }
  }

  return next(action);
};

export default jwtInjectorMiddleware;
