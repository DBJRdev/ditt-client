import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import { toJson } from '../../services/dateTimeService';
import * as types from './actionTypes';

export const addSickDayWorkLog = (data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      childDateOfBirth: data.childDateOfBirth ? toJson(data.childDateOfBirth) : null,
      childName: data.childName,
      date: toJson(data.date),
      variant: data.variant,
    }),
    endpoint: `${API_URL}/sick_day_work_logs`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.ADD_SICK_DAY_WORK_LOG_REQUEST,
      types.ADD_SICK_DAY_WORK_LOG_SUCCESS,
      types.ADD_SICK_DAY_WORK_LOG_FAILURE,
    ],
  },
});

export const deleteSickDayWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/sick_day_work_logs/${id}`,
    method: 'DELETE',
    types: [
      types.DELETE_SICK_DAY_WORK_LOG_REQUEST,
      types.DELETE_SICK_DAY_WORK_LOG_SUCCESS,
      types.DELETE_SICK_DAY_WORK_LOG_FAILURE,
    ],
  },
});

export const fetchSickDayWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/sick_day_work_logs/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_SICK_DAY_WORK_LOG_REQUEST,
      types.FETCH_SICK_DAY_WORK_LOG_SUCCESS,
      types.FETCH_SICK_DAY_WORK_LOG_FAILURE,
    ],
  },
});
