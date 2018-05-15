import history from 'history';
import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
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
    history.push(routes.index);
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
