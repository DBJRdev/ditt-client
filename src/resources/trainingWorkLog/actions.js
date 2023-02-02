import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import { toJson } from '../../services/dateTimeService';
import * as types from './actionTypes';

export const addTrainingWorkLog = (data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      comment: data.comment,
      date: toJson(data.date),
      title: data.title,
    }),
    endpoint: `${API_URL}/training_work_logs`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.ADD_TRAINING_WORK_LOG_REQUEST,
      types.ADD_TRAINING_WORK_LOG_SUCCESS,
      types.ADD_TRAINING_WORK_LOG_FAILURE,
    ],
  },
});

export const addMultipleTrainingWorkLog = (data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify(data.map((workLog) => ({
      comment: workLog.comment,
      date: toJson(workLog.date),
      title: workLog.title,
    }))),
    endpoint: `${API_URL}/training_work_logs/bulk`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.ADD_MULTIPLE_TRAINING_WORK_LOG_REQUEST,
      types.ADD_MULTIPLE_TRAINING_WORK_LOG_SUCCESS,
      types.ADD_MULTIPLE_TRAINING_WORK_LOG_FAILURE,
    ],
  },
});

export const deleteTrainingWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/training_work_logs/${id}`,
    method: 'DELETE',
    types: [
      types.DELETE_TRAINING_WORK_LOG_REQUEST,
      types.DELETE_TRAINING_WORK_LOG_SUCCESS,
      types.DELETE_TRAINING_WORK_LOG_FAILURE,
    ],
  },
});

export const editTrainingWorkLog = (id, data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      comment: data.comment,
      date: toJson(data.date),
      id,
      title: data.title,
    }),
    endpoint: `${API_URL}/training_work_logs/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.EDIT_TRAINING_WORK_LOG_REQUEST,
      types.EDIT_TRAINING_WORK_LOG_SUCCESS,
      types.EDIT_TRAINING_WORK_LOG_FAILURE,
    ],
  },
});

export const fetchTrainingWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/training_work_logs/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_TRAINING_WORK_LOG_REQUEST,
      types.FETCH_TRAINING_WORK_LOG_SUCCESS,
      types.FETCH_TRAINING_WORK_LOG_FAILURE,
    ],
  },
});

export const markTrainingWorkLogApproved = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/training_work_logs/${id}/mark_approved`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_TRAINING_WORK_LOG_APPROVED_REQUEST,
      types.MARK_TRAINING_WORK_LOG_APPROVED_SUCCESS,
      types.MARK_TRAINING_WORK_LOG_APPROVED_FAILURE,
    ],
  },
});

export const markTrainingWorkLogRejected = (id, data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      rejectionMessage: data.rejectionMessage,
    }),
    endpoint: `${API_URL}/training_work_logs/${id}/mark_rejected`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_TRAINING_WORK_LOG_REJECTED_REQUEST,
      types.MARK_TRAINING_WORK_LOG_REJECTED_SUCCESS,
      types.MARK_TRAINING_WORK_LOG_REJECTED_FAILURE,
    ],
  },
});

export const markMultipleTrainingWorkLogApproved = (workLogIds) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({ workLogIds }),
    endpoint: `${API_URL}/training_work_logs/bulk/mark_approved`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_MULTIPLE_TRAINING_WORK_LOG_APPROVED_REQUEST,
      types.MARK_MULTIPLE_TRAINING_WORK_LOG_APPROVED_SUCCESS,
      types.MARK_MULTIPLE_TRAINING_WORK_LOG_APPROVED_FAILURE,
    ],
  },
});

export const markMultipleTrainingWorkLogRejected = (
  workLogIds,
  data,
) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      rejectionMessage: data.rejectionMessage,
      workLogIds,
    }),
    endpoint: `${API_URL}/training_work_logs/bulk/mark_rejected`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_MULTIPLE_TRAINING_WORK_LOG_REJECTED_REQUEST,
      types.MARK_MULTIPLE_TRAINING_WORK_LOG_REJECTED_SUCCESS,
      types.MARK_MULTIPLE_TRAINING_WORK_LOG_REJECTED_FAILURE,
    ],
  },
});

export const supportTrainingWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      workLog: `/training_work_logs/${id}`,
    }),
    endpoint: `${API_URL}/training_work_log_supports`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.SUPPORT_TRAINING_WORK_LOG_REQUEST,
      types.SUPPORT_TRAINING_WORK_LOG_SUCCESS,
      types.SUPPORT_TRAINING_WORK_LOG_FAILURE,
    ],
  },
});

export const supportMultipleTrainingWorkLog = (ids) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify(ids.map((id) => ({ workLog: `/training_work_logs/${id}` }))),
    endpoint: `${API_URL}/training_work_log_supports/bulk`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.SUPPORT_TRAINING_WORK_LOG_REQUEST,
      types.SUPPORT_TRAINING_WORK_LOG_SUCCESS,
      types.SUPPORT_TRAINING_WORK_LOG_FAILURE,
    ],
  },
});

