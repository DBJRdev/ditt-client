import history from 'history';
import jwt from 'jsonwebtoken';
import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import {
  ROLE_ADMIN,
  ROLE_EMPLOYEE,
  ROLE_SUPER_ADMIN,
} from '../user';
import routes from '../../routes';
import * as types from './actionTypes';

export const login = data => dispatch => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      email: data.username,
      password: data.password,
    }),
    endpoint: `${API_URL}/login_check`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.LOGIN_REQUEST,
      types.LOGIN_SUCCESS,
      types.LOGIN_FAILURE,
    ],
  },
}).then((response) => {
  if (response.type === types.LOGIN_SUCCESS) {
    if (response.payload.token) {
      const decodedToken = jwt.decode(response.payload.token);

      if (decodedToken) {
        const { roles } = decodedToken;

        if (roles.includes(ROLE_ADMIN) || roles.includes(ROLE_SUPER_ADMIN)) {
          history.push(routes.userList);
        } else if (roles.includes(ROLE_EMPLOYEE)) {
          history.push(routes.index);
        } else {
          history.push(routes.login);
        }
      }
    }
  }

  return response;
});

export const logout = () => dispatch => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/logout`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.LOGOUT_REQUEST,
      types.LOGOUT_SUCCESS,
      types.LOGOUT_FAILURE,
    ],
  },
}).then((response) => {
  if (response.type === types.LOGOUT_SUCCESS) {
    history.push(routes.login);
  }

  return response;
});

export const reset = () => dispatch => dispatch({ type: types.RESET });