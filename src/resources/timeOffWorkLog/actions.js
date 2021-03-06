import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import { toJson } from '../../services/dateTimeService';
import * as types from './actionTypes';

export const addTimeOffWorkLog = (data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      comment: data.comment,
      date: toJson(data.date),
    }),
    endpoint: `${API_URL}/time_off_work_logs`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.ADD_TIME_OFF_WORK_LOG_REQUEST,
      types.ADD_TIME_OFF_WORK_LOG_SUCCESS,
      types.ADD_TIME_OFF_WORK_LOG_FAILURE,
    ],
  },
});

export const deleteTimeOffWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/time_off_work_logs/${id}`,
    method: 'DELETE',
    types: [
      types.DELETE_TIME_OFF_WORK_LOG_REQUEST,
      types.DELETE_TIME_OFF_WORK_LOG_SUCCESS,
      types.DELETE_TIME_OFF_WORK_LOG_FAILURE,
    ],
  },
});

export const fetchTimeOffWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/time_off_work_logs/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_TIME_OFF_WORK_LOG_REQUEST,
      types.FETCH_TIME_OFF_WORK_LOG_SUCCESS,
      types.FETCH_TIME_OFF_WORK_LOG_FAILURE,
    ],
  },
});

export const markTimeOffWorkLogApproved = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/time_off_work_logs/${id}/mark_approved`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_TIME_OFF_WORK_LOG_APPROVED_REQUEST,
      types.MARK_TIME_OFF_WORK_LOG_APPROVED_SUCCESS,
      types.MARK_TIME_OFF_WORK_LOG_APPROVED_FAILURE,
    ],
  },
});

export const markTimeOffWorkLogRejected = (id, data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      rejectionMessage: data.rejectionMessage,
    }),
    endpoint: `${API_URL}/time_off_work_logs/${id}/mark_rejected`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_TIME_OFF_WORK_LOG_REJECTED_REQUEST,
      types.MARK_TIME_OFF_WORK_LOG_REJECTED_SUCCESS,
      types.MARK_TIME_OFF_WORK_LOG_REJECTED_FAILURE,
    ],
  },
});

export const supportTimeOffWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      workLog: `/time_off_work_logs/${id}`,
    }),
    endpoint: `${API_URL}/time_off_work_log_supports`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.SUPPORT_TIME_OFF_WORK_LOG_REQUEST,
      types.SUPPORT_TIME_OFF_WORK_LOG_SUCCESS,
      types.SUPPORT_TIME_OFF_WORK_LOG_FAILURE,
    ],
  },
});
