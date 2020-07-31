import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import { toJson } from '../../services/dateTimeService';
import * as types from './actionTypes';

export const addMultipleParentalLeaveWorkLogs = (data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      user: data.user,
      workLogs: data.workLogs.map((workLog) => ({
        date: toJson(workLog.date),
      })),
    }),
    endpoint: `${API_URL}/parental_leave_work_logs/bulk`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.ADD_MULTIPLE_PARENTAL_LEAVE_WORK_LOG_REQUEST,
      types.ADD_MULTIPLE_PARENTAL_LEAVE_WORK_LOG_SUCCESS,
      types.ADD_MULTIPLE_PARENTAL_LEAVE_WORK_LOG_FAILURE,
    ],
  },
});

export const deleteParentalLeaveWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/parental_leave_work_logs/${id}`,
    method: 'DELETE',
    types: [
      types.DELETE_PARENTAL_LEAVE_WORK_LOG_REQUEST,
      types.DELETE_PARENTAL_LEAVE_WORK_LOG_SUCCESS,
      types.DELETE_PARENTAL_LEAVE_WORK_LOG_FAILURE,
    ],
  },
});

export const editParentalLeaveWorkLog = (id, data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      date: toJson(data.date),
      id,
    }),
    endpoint: `${API_URL}/parental_leave_work_logs/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.EDIT_PARENTAL_LEAVE_WORK_LOG_REQUEST,
      types.EDIT_PARENTAL_LEAVE_WORK_LOG_SUCCESS,
      types.EDIT_PARENTAL_LEAVE_WORK_LOG_FAILURE,
    ],
  },
});

export const fetchParentalLeaveWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/parental_leave_work_logs/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_PARENTAL_LEAVE_WORK_LOG_REQUEST,
      types.FETCH_PARENTAL_LEAVE_WORK_LOG_SUCCESS,
      types.FETCH_PARENTAL_LEAVE_WORK_LOG_FAILURE,
    ],
  },
});
