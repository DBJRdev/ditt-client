import decode from 'jsonwebtoken/decode';
import {
  selectJwtToken,
  selectLastRequestBrowserTime,
} from '../resources/auth';
import { refreshToken } from '../resources/auth/actions';

export const registerAuthRefreshTokenService = (store) => {
  const authRefreshTokenService = () => {
    const {
      dispatch,
      getState,
    } = store;

    const lastRequestBrowserTime = selectLastRequestBrowserTime(getState());
    const jwtToken = selectJwtToken(getState());
    const jwtTokenPayload = decode(jwtToken);

    if (jwtTokenPayload === null) {
      return;
    }

    const {
      exp,
      iat,
    } = jwtTokenPayload;
    const now = Date.now() / 1000;

    if (exp - now <= 0) {
      return;
    }

    if (
      exp - now <= 300
      && lastRequestBrowserTime != null
      && ((lastRequestBrowserTime / 1000) - iat) > 15
    ) {
      dispatch(refreshToken());
    }
  };

  setInterval(() => authRefreshTokenService(), 15000);
};
