import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import { toJson } from '../../services/dateTimeService';
import * as types from './actionTypes';

export const addHomeOfficeWorkLog = (data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      comment: data.comment,
      date: toJson(data.date),
      plannedEndHour: parseInt(data.plannedEndHour, 10),
      plannedEndMinute: parseInt(data.plannedEndMinute, 10),
      plannedStartHour: parseInt(data.plannedStartHour, 10),
      plannedStartMinute: parseInt(data.plannedStartMinute, 10),
    }),
    endpoint: `${API_URL}/home_office_work_logs`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.ADD_HOME_OFFICE_WORK_LOG_REQUEST,
      types.ADD_HOME_OFFICE_WORK_LOG_SUCCESS,
      types.ADD_HOME_OFFICE_WORK_LOG_FAILURE,
    ],
  },
});

export const addMultipleHomeOfficeWorkLog = (data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify(data.map((workLog) => ({
      comment: workLog.comment,
      date: toJson(workLog.date),
      plannedEndHour: parseInt(workLog.plannedEndHour, 10),
      plannedEndMinute: parseInt(workLog.plannedEndMinute, 10),
      plannedStartHour: parseInt(workLog.plannedStartHour, 10),
      plannedStartMinute: parseInt(workLog.plannedStartMinute, 10),
    }))),
    endpoint: `${API_URL}/home_office_work_logs/bulk`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.ADD_MULTIPLE_HOME_OFFICE_WORK_LOG_REQUEST,
      types.ADD_MULTIPLE_HOME_OFFICE_WORK_LOG_SUCCESS,
      types.ADD_MULTIPLE_HOME_OFFICE_WORK_LOG_FAILURE,
    ],
  },
});

export const deleteHomeOfficeWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/home_office_work_logs/${id}`,
    method: 'DELETE',
    types: [
      types.DELETE_HOME_OFFICE_WORK_LOG_REQUEST,
      types.DELETE_HOME_OFFICE_WORK_LOG_SUCCESS,
      types.DELETE_HOME_OFFICE_WORK_LOG_FAILURE,
    ],
  },
});

export const editHomeOfficeWorkLog = (id, data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      comment: data.comment,
      date: toJson(data.date),
      id,
      plannedEndHour: parseInt(data.plannedEndHour, 10),
      plannedEndMinute: parseInt(data.plannedEndMinute, 10),
      plannedStartHour: parseInt(data.plannedStartHour, 10),
      plannedStartMinute: parseInt(data.plannedStartMinute, 10),
    }),
    endpoint: `${API_URL}/home_office_work_logs/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.EDIT_HOME_OFFICE_WORK_LOG_REQUEST,
      types.EDIT_HOME_OFFICE_WORK_LOG_SUCCESS,
      types.EDIT_HOME_OFFICE_WORK_LOG_FAILURE,
    ],
  },
});

export const fetchHomeOfficeWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/home_office_work_logs/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_HOME_OFFICE_WORK_LOG_REQUEST,
      types.FETCH_HOME_OFFICE_WORK_LOG_SUCCESS,
      types.FETCH_HOME_OFFICE_WORK_LOG_FAILURE,
    ],
  },
});

export const markMultipleHomeOfficeWorkLogApproved = (workLogIds) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({ workLogIds }),
    endpoint: `${API_URL}/home_office_work_logs/bulk/mark_approved`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_MULTIPLE_HOME_OFFICE_WORK_LOG_APPROVED_REQUEST,
      types.MARK_MULTIPLE_HOME_OFFICE_WORK_LOG_APPROVED_SUCCESS,
      types.MARK_MULTIPLE_HOME_OFFICE_WORK_LOG_APPROVED_FAILURE,
    ],
  },
});

export const markMultipleHomeOfficeWorkLogRejected = (
  workLogIds,
  data,
) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      rejectionMessage: data.rejectionMessage,
      workLogIds,
    }),
    endpoint: `${API_URL}/home_office_work_logs/bulk/mark_rejected`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_MULTIPLE_HOME_OFFICE_WORK_LOG_REJECTED_REQUEST,
      types.MARK_MULTIPLE_HOME_OFFICE_WORK_LOG_REJECTED_SUCCESS,
      types.MARK_MULTIPLE_HOME_OFFICE_WORK_LOG_REJECTED_FAILURE,
    ],
  },
});

export const markHomeOfficeWorkLogApproved = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/home_office_work_logs/${id}/mark_approved`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_HOME_OFFICE_WORK_LOG_APPROVED_REQUEST,
      types.MARK_HOME_OFFICE_WORK_LOG_APPROVED_SUCCESS,
      types.MARK_HOME_OFFICE_WORK_LOG_APPROVED_FAILURE,
    ],
  },
});

export const markHomeOfficeWorkLogRejected = (id, data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      rejectionMessage: data.rejectionMessage,
    }),
    endpoint: `${API_URL}/home_office_work_logs/${id}/mark_rejected`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_HOME_OFFICE_WORK_LOG_REJECTED_REQUEST,
      types.MARK_HOME_OFFICE_WORK_LOG_REJECTED_SUCCESS,
      types.MARK_HOME_OFFICE_WORK_LOG_REJECTED_FAILURE,
    ],
  },
});

export const supportHomeOfficeWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      workLog: `/home_office_work_logs/${id}`,
    }),
    endpoint: `${API_URL}/home_office_work_log_supports`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.SUPPORT_HOME_OFFICE_WORK_LOG_REQUEST,
      types.SUPPORT_HOME_OFFICE_WORK_LOG_SUCCESS,
      types.SUPPORT_HOME_OFFICE_WORK_LOG_FAILURE,
    ],
  },
});

export const supportMultipleHomeOfficeWorkLog = (ids) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify(ids.map((id) => ({ workLog: `/home_office_work_logs/${id}` }))),
    endpoint: `${API_URL}/home_office_work_log_supports/bulk`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.SUPPORT_HOME_OFFICE_WORK_LOG_REQUEST,
      types.SUPPORT_HOME_OFFICE_WORK_LOG_SUCCESS,
      types.SUPPORT_HOME_OFFICE_WORK_LOG_FAILURE,
    ],
  },
});

