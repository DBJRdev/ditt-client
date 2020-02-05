import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import { toJson } from '../../services/dateTimeService';
import * as types from './actionTypes';

export const addHomeOfficeWorkLog = (data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      comment: data.comment,
      date: toJson(data.date),
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
