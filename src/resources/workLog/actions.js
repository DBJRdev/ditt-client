import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import { toJson } from '../../services/dateTimeService';
import * as types from './actionTypes';

export const addWorkLog = (data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      endTime: toJson(data.endTime),
      startTime: toJson(data.startTime),
    }),
    endpoint: `${API_URL}/work_logs`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.ADD_WORK_LOG_REQUEST,
      types.ADD_WORK_LOG_SUCCESS,
      types.ADD_WORK_LOG_FAILURE,
    ],
  },
});

export const deleteWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/work_logs/${id}`,
    method: 'DELETE',
    types: [
      types.DELETE_WORK_LOG_REQUEST,
      types.DELETE_WORK_LOG_SUCCESS,
      types.DELETE_WORK_LOG_FAILURE,
    ],
  },
});

export const editWorkLog = (id, data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      endTime: toJson(data.endTime),
      id,
      startTime: toJson(data.startTime),
    }),
    endpoint: `${API_URL}/work_logs/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.EDIT_WORK_LOG_REQUEST,
      types.EDIT_WORK_LOG_SUCCESS,
      types.EDIT_WORK_LOG_FAILURE,
    ],
  },
});

export const fetchWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/work_logs/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_WORK_LOG_REQUEST,
      types.FETCH_WORK_LOG_SUCCESS,
      types.FETCH_WORK_LOG_FAILURE,
    ],
  },
});
