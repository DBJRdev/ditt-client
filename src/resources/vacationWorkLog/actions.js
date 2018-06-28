import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import { toJson } from '../../services/dateTimeService';
import * as types from './actionTypes';

export const addVacationWorkLog = data => dispatch => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      date: toJson(data.date),
    }),
    endpoint: `${API_URL}/vacation_work_logs`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.ADD_VACATION_WORK_LOG_REQUEST,
      types.ADD_VACATION_WORK_LOG_SUCCESS,
      types.ADD_VACATION_WORK_LOG_FAILURE,
    ],
  },
});

export const deleteVacationWorkLog = id => dispatch => dispatch({
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

export const markVacationWorkLogApproved = id => dispatch => dispatch({
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

export const markVacationWorkLogRejected = (id, data) => dispatch => dispatch({
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
