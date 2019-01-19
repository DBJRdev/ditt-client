import { RSAA } from 'redux-api-middleware';
import { selectJwtToken } from '../resources/auth/index';

const jwtInjectorMiddleware = store => next => (action) => {
  const callApi = action[RSAA];

  if (callApi) {
    const jwt = selectJwtToken(store.getState());
    if (jwt) {
      callApi.headers = Object.assign({}, callApi.headers, {
        Authorization: `Bearer ${jwt}`,
      });

      return next(Object.assign({}, action, { [RSAA]: callApi }));
    }
  }

  return next(action);
};

export default jwtInjectorMiddleware;
