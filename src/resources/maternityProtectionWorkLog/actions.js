import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import { toJson } from '../../services/dateTimeService';
import * as types from './actionTypes';

export const addMultipleMaternityProtectionWorkLogs = (data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      user: data.user,
      workLogs: data.workLogs.map((workLog) => ({
        date: toJson(workLog.date),
      })),
    }),
    endpoint: `${API_URL}/maternity_protection_work_logs/bulk`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.ADD_MULTIPLE_MATERNITY_PROTECTION_WORK_LOG_REQUEST,
      types.ADD_MULTIPLE_MATERNITY_PROTECTION_WORK_LOG_SUCCESS,
      types.ADD_MULTIPLE_MATERNITY_PROTECTION_WORK_LOG_FAILURE,
    ],
  },
});

export const deleteMaternityProtectionWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/maternity_protection_work_logs/${id}`,
    method: 'DELETE',
    types: [
      types.DELETE_MATERNITY_PROTECTION_WORK_LOG_REQUEST,
      types.DELETE_MATERNITY_PROTECTION_WORK_LOG_SUCCESS,
      types.DELETE_MATERNITY_PROTECTION_WORK_LOG_FAILURE,
    ],
  },
});

export const fetchMaternityProtectionWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/maternity_protection_work_logs/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_MATERNITY_PROTECTION_WORK_LOG_REQUEST,
      types.FETCH_MATERNITY_PROTECTION_WORK_LOG_SUCCESS,
      types.FETCH_MATERNITY_PROTECTION_WORK_LOG_FAILURE,
    ],
  },
});
