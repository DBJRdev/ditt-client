import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import { toJson } from '../../services/dateTimeService';
import * as types from './actionTypes';

export const fetchContractList = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/users/${id}/contracts`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_CONTRACT_LIST_REQUEST,
      types.FETCH_CONTRACT_LIST_SUCCESS,
      types.FETCH_CONTRACT_LIST_FAILURE,
    ],
  },
});

export const makeContractPermanent = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/contracts/${id}/make_permanent`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.TERMINATE_CONTRACT_REQUEST,
      types.TERMINATE_CONTRACT_SUCCESS,
      types.TERMINATE_CONTRACT_FAILURE,
    ],
  },
});

export const terminateContract = (id, data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      dateTime: toJson(data.dateTime),
    }),
    endpoint: `${API_URL}/contracts/${id}/terminate`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.TERMINATE_CONTRACT_REQUEST,
      types.TERMINATE_CONTRACT_SUCCESS,
      types.TERMINATE_CONTRACT_FAILURE,
    ],
  },
});
