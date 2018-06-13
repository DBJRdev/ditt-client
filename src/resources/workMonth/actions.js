import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import * as types from './actionTypes';

export const fetchWorkMonth = id => dispatch => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/work_months/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_WORK_MONTH_REQUEST,
      types.FETCH_WORK_MONTH_SUCCESS,
      types.FETCH_WORK_MONTH_FAILURE,
    ],
  },
});

export const fetchWorkMonthList = uid => dispatch => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/users/${uid}/work_months`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_WORK_MONTH_LIST_REQUEST,
      types.FETCH_WORK_MONTH_LIST_SUCCESS,
      types.FETCH_WORK_MONTH_LIST_FAILURE,
    ],
  },
});
