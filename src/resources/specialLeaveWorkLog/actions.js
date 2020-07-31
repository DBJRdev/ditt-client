import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import { toJson } from '../../services/dateTimeService';
import * as types from './actionTypes';

export const addSpecialLeaveWorkLog = (data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({ date: toJson(data.date) }),
    endpoint: `${API_URL}/special_leave_work_logs`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.ADD_SPECIAL_LEAVE_WORK_LOG_REQUEST,
      types.ADD_SPECIAL_LEAVE_WORK_LOG_SUCCESS,
      types.ADD_SPECIAL_LEAVE_WORK_LOG_FAILURE,
    ],
  },
});

export const addMultipleSpecialLeaveWorkLog = (data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify(data.map((workLog) => ({ date: toJson(workLog.date) }))),
    endpoint: `${API_URL}/special_leave_work_logs/bulk`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.ADD_MULTIPLE_SPECIAL_LEAVE_WORK_LOG_REQUEST,
      types.ADD_MULTIPLE_SPECIAL_LEAVE_WORK_LOG_SUCCESS,
      types.ADD_MULTIPLE_SPECIAL_LEAVE_WORK_LOG_FAILURE,
    ],
  },
});

export const deleteSpecialLeaveWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/special_leave_work_logs/${id}`,
    method: 'DELETE',
    types: [
      types.DELETE_SPECIAL_LEAVE_WORK_LOG_REQUEST,
      types.DELETE_SPECIAL_LEAVE_WORK_LOG_SUCCESS,
      types.DELETE_SPECIAL_LEAVE_WORK_LOG_FAILURE,
    ],
  },
});

export const editSpecialLeaveWorkLog = (id, data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      date: toJson(data.date),
      id,
    }),
    endpoint: `${API_URL}/special_leave_work_logs/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.EDIT_SPECIAL_LEAVE_WORK_LOG_REQUEST,
      types.EDIT_SPECIAL_LEAVE_WORK_LOG_SUCCESS,
      types.EDIT_SPECIAL_LEAVE_WORK_LOG_FAILURE,
    ],
  },
});

export const fetchSpecialLeaveWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/special_leave_work_logs/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_VACATION_WORK_LOG_REQUEST,
      types.FETCH_VACATION_WORK_LOG_SUCCESS,
      types.FETCH_VACATION_WORK_LOG_FAILURE,
    ],
  },
});

export const markMultipleSpecialLeaveWorkLogApproved = (workLogIds) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({ workLogIds }),
    endpoint: `${API_URL}/special_leave_work_logs/bulk/mark_approved`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_MULTIPLE_SPECIAL_LEAVE_WORK_LOG_APPROVED_REQUEST,
      types.MARK_MULTIPLE_SPECIAL_LEAVE_WORK_LOG_APPROVED_SUCCESS,
      types.MARK_MULTIPLE_SPECIAL_LEAVE_WORK_LOG_APPROVED_FAILURE,
    ],
  },
});

export const markMultipleSpecialLeaveWorkLogRejected = (
  workLogIds,
  data,
) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      rejectionMessage: data.rejectionMessage,
      workLogIds,
    }),
    endpoint: `${API_URL}/special_leave_work_logs/bulk/mark_rejected`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_MULTIPLE_SPECIAL_LEAVE_WORK_LOG_REJECTED_REQUEST,
      types.MARK_MULTIPLE_SPECIAL_LEAVE_WORK_LOG_REJECTED_SUCCESS,
      types.MARK_MULTIPLE_SPECIAL_LEAVE_WORK_LOG_REJECTED_FAILURE,
    ],
  },
});

export const markSpecialLeaveWorkLogApproved = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/special_leave_work_logs/${id}/mark_approved`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_SPECIAL_LEAVE_WORK_LOG_APPROVED_REQUEST,
      types.MARK_SPECIAL_LEAVE_WORK_LOG_APPROVED_SUCCESS,
      types.MARK_SPECIAL_LEAVE_WORK_LOG_APPROVED_FAILURE,
    ],
  },
});

export const markSpecialLeaveWorkLogRejected = (id, data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      rejectionMessage: data.rejectionMessage,
    }),
    endpoint: `${API_URL}/special_leave_work_logs/${id}/mark_rejected`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_SPECIAL_LEAVE_WORK_LOG_REJECTED_REQUEST,
      types.MARK_SPECIAL_LEAVE_WORK_LOG_REJECTED_SUCCESS,
      types.MARK_SPECIAL_LEAVE_WORK_LOG_REJECTED_FAILURE,
    ],
  },
});

export const supportSpecialLeaveWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      workLog: `/special_leave_work_logs/${id}`,
    }),
    endpoint: `${API_URL}/special_leave_work_log_supports`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.SUPPORT_SPECIAL_LEAVE_WORK_LOG_REQUEST,
      types.SUPPORT_SPECIAL_LEAVE_WORK_LOG_SUCCESS,
      types.SUPPORT_SPECIAL_LEAVE_WORK_LOG_FAILURE,
    ],
  },
});

export const supportMultipleSpecialLeaveWorkLog = (ids) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify(ids.map((id) => ({ workLog: `/special_leave_work_logs/${id}` }))),
    endpoint: `${API_URL}/special_leave_work_log_supports/bulk`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.SUPPORT_SPECIAL_LEAVE_WORK_LOG_REQUEST,
      types.SUPPORT_SPECIAL_LEAVE_WORK_LOG_SUCCESS,
      types.SUPPORT_SPECIAL_LEAVE_WORK_LOG_FAILURE,
    ],
  },
});
