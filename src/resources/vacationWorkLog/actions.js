import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import { toJson } from '../../services/dateTimeService';
import * as types from './actionTypes';

export const addMultipleVacationWorkLog = (data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify(data.map((workLog) => ({ date: toJson(workLog.date) }))),
    endpoint: `${API_URL}/vacation_work_logs/bulk`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.ADD_MULTIPLE_VACATION_WORK_LOG_REQUEST,
      types.ADD_MULTIPLE_VACATION_WORK_LOG_SUCCESS,
      types.ADD_MULTIPLE_VACATION_WORK_LOG_FAILURE,
    ],
  },
});

export const deleteVacationWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/vacation_work_logs/${id}`,
    method: 'DELETE',
    types: [
      types.DELETE_VACATION_WORK_LOG_REQUEST,
      types.DELETE_VACATION_WORK_LOG_SUCCESS,
      types.DELETE_VACATION_WORK_LOG_FAILURE,
    ],
  },
});

export const fetchVacationWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/vacation_work_logs/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_VACATION_WORK_WORK_LOG_REQUEST,
      types.FETCH_VACATION_WORK_WORK_LOG_SUCCESS,
      types.FETCH_VACATION_WORK_WORK_LOG_FAILURE,
    ],
  },
});

export const markMultipleVacationWorkLogApproved = (workLogIds) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({ workLogIds }),
    endpoint: `${API_URL}/vacation_work_logs/bulk/mark_approved`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_MULTIPLE_VACATION_WORK_LOG_APPROVED_REQUEST,
      types.MARK_MULTIPLE_VACATION_WORK_LOG_APPROVED_SUCCESS,
      types.MARK_MULTIPLE_VACATION_WORK_LOG_APPROVED_FAILURE,
    ],
  },
});

export const markMultipleVacationWorkLogRejected = (workLogIds, data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      rejectionMessage: data.rejectionMessage,
      workLogIds,
    }),
    endpoint: `${API_URL}/vacation_work_logs/bulk/mark_rejected`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_MULTIPLE_VACATION_WORK_LOG_REJECTED_REQUEST,
      types.MARK_MULTIPLE_VACATION_WORK_LOG_REJECTED_SUCCESS,
      types.MARK_MULTIPLE_VACATION_WORK_LOG_REJECTED_FAILURE,
    ],
  },
});

export const markVacationWorkLogApproved = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/vacation_work_logs/${id}/mark_approved`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_VACATION_WORK_LOG_APPROVED_REQUEST,
      types.MARK_VACATION_WORK_LOG_APPROVED_SUCCESS,
      types.MARK_VACATION_WORK_LOG_APPROVED_FAILURE,
    ],
  },
});

export const markVacationWorkLogRejected = (id, data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      rejectionMessage: data.rejectionMessage,
    }),
    endpoint: `${API_URL}/vacation_work_logs/${id}/mark_rejected`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_VACATION_WORK_LOG_REJECTED_REQUEST,
      types.MARK_VACATION_WORK_LOG_REJECTED_SUCCESS,
      types.MARK_VACATION_WORK_LOG_REJECTED_FAILURE,
    ],
  },
});

export const supportVacationWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      workLog: `/vacation_work_logs/${id}`,
    }),
    endpoint: `${API_URL}/vacation_work_log_supports`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.SUPPORT_VACATION_WORK_LOG_REQUEST,
      types.SUPPORT_VACATION_WORK_LOG_SUCCESS,
      types.SUPPORT_VACATION_WORK_LOG_FAILURE,
    ],
  },
});

export const supportMultipleVacationWorkLog = (ids) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify(ids.map((id) => ({ workLog: `/vacation_work_logs/${id}` }))),
    endpoint: `${API_URL}/vacation_work_log_supports/bulk`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.SUPPORT_VACATION_WORK_LOG_REQUEST,
      types.SUPPORT_VACATION_WORK_LOG_SUCCESS,
      types.SUPPORT_VACATION_WORK_LOG_FAILURE,
    ],
  },
});

