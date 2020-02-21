import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import { toJson } from '../../services/dateTimeService';
import * as types from './actionTypes';

export const addMultipleBanWorkLogs = (data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      user: data.user,
      workLogs: data.workLogs.map((workLog) => ({
        date: toJson(workLog.date),
        workTimeLimit: workLog.workTimeLimit,
      })),
    }),
    endpoint: `${API_URL}/ban_work_logs/bulk`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.ADD_MULTIPLE_BAN_WORK_LOG_REQUEST,
      types.ADD_MULTIPLE_BAN_WORK_LOG_SUCCESS,
      types.ADD_MULTIPLE_BAN_WORK_LOG_FAILURE,
    ],
  },
});

export const deleteBanWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/ban_work_logs/${id}`,
    method: 'DELETE',
    types: [
      types.DELETE_BAN_WORK_LOG_REQUEST,
      types.DELETE_BAN_WORK_LOG_SUCCESS,
      types.DELETE_BAN_WORK_LOG_FAILURE,
    ],
  },
});

export const fetchBanWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/ban_work_logs/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_BAN_WORK_LOG_REQUEST,
      types.FETCH_BAN_WORK_LOG_SUCCESS,
      types.FETCH_BAN_WORK_LOG_FAILURE,
    ],
  },
});
