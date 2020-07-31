import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import { toJson } from '../../services/dateTimeService';
import * as types from './actionTypes';

export const addMultipleSickDayUnpaidWorkLogs = (data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      user: data.user,
      workLogs: data.workLogs.map((workLog) => ({
        date: toJson(workLog.date),
      })),
    }),
    endpoint: `${API_URL}/sick_day_unpaid_work_logs/bulk`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.ADD_MULTIPLE_SICK_DAY_UNPAID_WORK_LOG_REQUEST,
      types.ADD_MULTIPLE_SICK_DAY_UNPAID_WORK_LOG_SUCCESS,
      types.ADD_MULTIPLE_SICK_DAY_UNPAID_WORK_LOG_FAILURE,
    ],
  },
});

export const deleteSickDayUnpaidWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/sick_day_unpaid_work_logs/${id}`,
    method: 'DELETE',
    types: [
      types.DELETE_SICK_DAY_UNPAID_WORK_LOG_REQUEST,
      types.DELETE_SICK_DAY_UNPAID_WORK_LOG_SUCCESS,
      types.DELETE_SICK_DAY_UNPAID_WORK_LOG_FAILURE,
    ],
  },
});

export const editSickDayUnpaidWorkLog = (id, data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      date: toJson(data.date),
      id,
    }),
    endpoint: `${API_URL}/sick_day_unpaid_work_logs/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.EDIT_SICK_DAY_UNPAID_WORK_LOG_REQUEST,
      types.EDIT_SICK_DAY_UNPAID_WORK_LOG_SUCCESS,
      types.EDIT_SICK_DAY_UNPAID_WORK_LOG_FAILURE,
    ],
  },
});

export const fetchSickDayUnpaidWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/sick_day_unpaid_work_logs/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_SICK_DAY_UNPAID_WORK_LOG_REQUEST,
      types.FETCH_SICK_DAY_UNPAID_WORK_LOG_SUCCESS,
      types.FETCH_SICK_DAY_UNPAID_WORK_LOG_FAILURE,
    ],
  },
});
