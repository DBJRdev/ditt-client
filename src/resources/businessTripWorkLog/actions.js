import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import { toJson } from '../../services/dateTimeService';
import * as types from './actionTypes';

export const addBusinessTripWorkLog = (data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      date: toJson(data.date),
      destination: data.destination,
      expectedArrival: data.expectedArrival,
      expectedDeparture: data.expectedDeparture,
      plannedEndHour: parseInt(data.plannedEndHour, 10),
      plannedEndMinute: parseInt(data.plannedEndMinute, 10),
      plannedStartHour: parseInt(data.plannedStartHour, 10),
      plannedStartMinute: parseInt(data.plannedStartMinute, 10),
      purpose: data.purpose,
      transport: data.transport,
    }),
    endpoint: `${API_URL}/business_trip_work_logs`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.ADD_BUSINESS_TRIP_WORK_LOG_REQUEST,
      types.ADD_BUSINESS_TRIP_WORK_LOG_SUCCESS,
      types.ADD_BUSINESS_TRIP_WORK_LOG_FAILURE,
    ],
  },
});

export const addMultipleBusinessTripWorkLog = (data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify(data.map((workLog) => ({
      date: toJson(workLog.date),
      destination: workLog.destination,
      expectedArrival: workLog.expectedArrival,
      expectedDeparture: workLog.expectedDeparture,
      plannedEndHour: parseInt(workLog.plannedEndHour, 10),
      plannedEndMinute: parseInt(workLog.plannedEndMinute, 10),
      plannedStartHour: parseInt(workLog.plannedStartHour, 10),
      plannedStartMinute: parseInt(workLog.plannedStartMinute, 10),
      purpose: workLog.purpose,
      transport: workLog.transport,
    }))),
    endpoint: `${API_URL}/business_trip_work_logs/bulk`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.ADD_MULTIPLE_BUSINESS_TRIP_WORK_LOG_REQUEST,
      types.ADD_MULTIPLE_BUSINESS_TRIP_WORK_LOG_SUCCESS,
      types.ADD_MULTIPLE_BUSINESS_TRIP_WORK_LOG_FAILURE,
    ],
  },
});

export const deleteBusinessTripWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/business_trip_work_logs/${id}`,
    method: 'DELETE',
    types: [
      types.DELETE_BUSINESS_TRIP_WORK_LOG_REQUEST,
      types.DELETE_BUSINESS_TRIP_WORK_LOG_SUCCESS,
      types.DELETE_BUSINESS_TRIP_WORK_LOG_FAILURE,
    ],
  },
});

export const editBusinessTripWorkLog = (id, data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      date: toJson(data.date),
      destination: data.destination,
      expectedArrival: data.expectedArrival,
      expectedDeparture: data.expectedDeparture,
      id,
      plannedEndHour: parseInt(data.plannedEndHour, 10),
      plannedEndMinute: parseInt(data.plannedEndMinute, 10),
      plannedStartHour: parseInt(data.plannedStartHour, 10),
      plannedStartMinute: parseInt(data.plannedStartMinute, 10),
      purpose: data.purpose,
      transport: data.transport,
    }),
    endpoint: `${API_URL}/business_trip_work_logs/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.EDIT_BUSINESS_TRIP_WORK_LOG_REQUEST,
      types.EDIT_BUSINESS_TRIP_WORK_LOG_SUCCESS,
      types.EDIT_BUSINESS_TRIP_WORK_LOG_FAILURE,
    ],
  },
});

export const fetchBusinessTripWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/business_trip_work_logs/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_BUSINESS_TRIP_WORK_LOG_REQUEST,
      types.FETCH_BUSINESS_TRIP_WORK_LOG_SUCCESS,
      types.FETCH_BUSINESS_TRIP_WORK_LOG_FAILURE,
    ],
  },
});

export const markBusinessTripWorkLogApproved = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/business_trip_work_logs/${id}/mark_approved`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_BUSINESS_TRIP_WORK_LOG_APPROVED_REQUEST,
      types.MARK_BUSINESS_TRIP_WORK_LOG_APPROVED_SUCCESS,
      types.MARK_BUSINESS_TRIP_WORK_LOG_APPROVED_FAILURE,
    ],
  },
});

export const markBusinessTripWorkLogRejected = (id, data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      rejectionMessage: data.rejectionMessage,
    }),
    endpoint: `${API_URL}/business_trip_work_logs/${id}/mark_rejected`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_BUSINESS_TRIP_WORK_LOG_REJECTED_REQUEST,
      types.MARK_BUSINESS_TRIP_WORK_LOG_REJECTED_SUCCESS,
      types.MARK_BUSINESS_TRIP_WORK_LOG_REJECTED_FAILURE,
    ],
  },
});

export const markMultipleBusinessTripWorkLogApproved = (workLogIds) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({ workLogIds }),
    endpoint: `${API_URL}/business_trip_work_logs/bulk/mark_approved`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_MULTIPLE_BUSINESS_TRIP_WORK_LOG_APPROVED_REQUEST,
      types.MARK_MULTIPLE_BUSINESS_TRIP_WORK_LOG_APPROVED_SUCCESS,
      types.MARK_MULTIPLE_BUSINESS_TRIP_WORK_LOG_APPROVED_FAILURE,
    ],
  },
});

export const markMultipleBusinessTripWorkLogRejected = (
  workLogIds,
  data,
) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      rejectionMessage: data.rejectionMessage,
      workLogIds,
    }),
    endpoint: `${API_URL}/business_trip_work_logs/bulk/mark_rejected`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_MULTIPLE_BUSINESS_TRIP_WORK_LOG_REJECTED_REQUEST,
      types.MARK_MULTIPLE_BUSINESS_TRIP_WORK_LOG_REJECTED_SUCCESS,
      types.MARK_MULTIPLE_BUSINESS_TRIP_WORK_LOG_REJECTED_FAILURE,
    ],
  },
});

export const supportBusinessTripWorkLog = (id) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      workLog: `/business_trip_work_logs/${id}`,
    }),
    endpoint: `${API_URL}/business_trip_work_log_supports`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.SUPPORT_BUSINESS_TRIP_WORK_LOG_REQUEST,
      types.SUPPORT_BUSINESS_TRIP_WORK_LOG_SUCCESS,
      types.SUPPORT_BUSINESS_TRIP_WORK_LOG_FAILURE,
    ],
  },
});

export const supportMultipleBusinessTripWorkLog = (ids) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify(ids.map((id) => ({ workLog: `/business_trip_work_logs/${id}` }))),
    endpoint: `${API_URL}/business_trip_work_log_supports/bulk`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.SUPPORT_BUSINESS_TRIP_WORK_LOG_REQUEST,
      types.SUPPORT_BUSINESS_TRIP_WORK_LOG_SUCCESS,
      types.SUPPORT_BUSINESS_TRIP_WORK_LOG_FAILURE,
    ],
  },
});

