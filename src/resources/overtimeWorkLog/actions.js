import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import { toJson } from '../../services/dateTimeService';
import * as types from './actionTypes';

export const addOvertimeWorkLog = (data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      date: toJson(data.date),
      reason: data.reason,
    }),
    endpoint: `${API_URL}/overtime_work_logs`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.ADD_OVERTIME_WORK_LOG_REQUEST,
      types.ADD_OVERTIME_WORK_LOG_SUCCESS,
      types.ADD_OVERTIME_WORK_LOG_FAILURE,
    ],
  },
});

export const addMultipleOvertimeWorkLog = (data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify(data.map((workLog) => ({
      date: toJson(workLog.date),
      reason: workLog.reason,
    }))),
    endpoint: `${API_URL}/overtime_work_logs/bulk`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.ADD_MULTIPLE_OVERTIME_WORK_LOG_REQUEST,
      types.ADD_MULTIPLE_OVERTIME_WORK_LOG_SUCCESS,
      types.ADD_MULTIPLE_OVERTIME_WORK_LOG_FAILURE,
    ],
  },
});

export const deleteOvertimeWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/overtime_work_logs/${id}`,
    method: 'DELETE',
    types: [
      types.DELETE_OVERTIME_WORK_LOG_REQUEST,
      types.DELETE_OVERTIME_WORK_LOG_SUCCESS,
      types.DELETE_OVERTIME_WORK_LOG_FAILURE,
    ],
  },
});

export const editOvertimeWorkLog = (id, data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      date: toJson(data.date),
      id,
      reason: data.reason,
    }),
    endpoint: `${API_URL}/overtime_work_logs/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.EDIT_OVERTIME_WORK_LOG_REQUEST,
      types.EDIT_OVERTIME_WORK_LOG_SUCCESS,
      types.EDIT_OVERTIME_WORK_LOG_FAILURE,
    ],
  },
});

export const fetchOvertimeWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/overtime_work_logs/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_OVERTIME_WORK_LOG_REQUEST,
      types.FETCH_OVERTIME_WORK_LOG_SUCCESS,
      types.FETCH_OVERTIME_WORK_LOG_FAILURE,
    ],
  },
});

export const markOvertimeWorkLogApproved = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/overtime_work_logs/${id}/mark_approved`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_OVERTIME_WORK_LOG_APPROVED_REQUEST,
      types.MARK_OVERTIME_WORK_LOG_APPROVED_SUCCESS,
      types.MARK_OVERTIME_WORK_LOG_APPROVED_FAILURE,
    ],
  },
});

export const markOvertimeWorkLogRejected = (id, data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      rejectionMessage: data.rejectionMessage,
    }),
    endpoint: `${API_URL}/overtime_work_logs/${id}/mark_rejected`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_OVERTIME_WORK_LOG_REJECTED_REQUEST,
      types.MARK_OVERTIME_WORK_LOG_REJECTED_SUCCESS,
      types.MARK_OVERTIME_WORK_LOG_REJECTED_FAILURE,
    ],
  },
});

export const markMultipleOvertimeWorkLogApproved = (workLogIds) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({ workLogIds }),
    endpoint: `${API_URL}/overtime_work_logs/bulk/mark_approved`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_MULTIPLE_OVERTIME_WORK_LOG_APPROVED_REQUEST,
      types.MARK_MULTIPLE_OVERTIME_WORK_LOG_APPROVED_SUCCESS,
      types.MARK_MULTIPLE_OVERTIME_WORK_LOG_APPROVED_FAILURE,
    ],
  },
});

export const markMultipleOvertimeWorkLogRejected = (
  workLogIds,
  data,
) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      rejectionMessage: data.rejectionMessage,
      workLogIds,
    }),
    endpoint: `${API_URL}/overtime_work_logs/bulk/mark_rejected`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_MULTIPLE_OVERTIME_WORK_LOG_REJECTED_REQUEST,
      types.MARK_MULTIPLE_OVERTIME_WORK_LOG_REJECTED_SUCCESS,
      types.MARK_MULTIPLE_OVERTIME_WORK_LOG_REJECTED_FAILURE,
    ],
  },
});

export const supportMultipleOvertimeWorkLog = (ids) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify(ids.map((id) => ({ workLog: `/overtime_work_logs/${id}` }))),
    endpoint: `${API_URL}/overtime_work_log_supports/bulk`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.SUPPORT_OVERTIME_WORK_LOG_REQUEST,
      types.SUPPORT_OVERTIME_WORK_LOG_SUCCESS,
      types.SUPPORT_OVERTIME_WORK_LOG_FAILURE,
    ],
  },
});

export const supportOvertimeWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      workLog: `/overtime_work_logs/${id}`,
    }),
    endpoint: `${API_URL}/overtime_work_log_supports`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.SUPPORT_OVERTIME_WORK_LOG_REQUEST,
      types.SUPPORT_OVERTIME_WORK_LOG_SUCCESS,
      types.SUPPORT_OVERTIME_WORK_LOG_FAILURE,
    ],
  },
});
