import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import * as types from './actionTypes';

// eslint-disable-next-line
export const fetchConfig = () => dispatch => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/configs`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_CONFIG_REQUEST,
      types.FETCH_CONFIG_SUCCESS,
      types.FETCH_CONFIG_FAILURE,
    ],
  },
});
