import { CALL_API } from 'redux-api-middleware';
import { selectJwtToken } from '../resources/auth/index';

const jwtInjectorMiddleware = store => next => (action) => {
  const callApi = action[CALL_API];

  if (callApi) {
    const jwt = selectJwtToken(store.getState());
    if (jwt) {
      callApi.headers = Object.assign({}, callApi.headers, {
        Authorization: `Bearer ${jwt}`,
      });

      return next(Object.assign({}, action, { [CALL_API]: callApi }));
    }
  }

  return next(action);
};

export default jwtInjectorMiddleware;
