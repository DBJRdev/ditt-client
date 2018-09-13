import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import * as types from './actionTypes';

export const fetchRecentSpecialApprovalList = uid => dispatch => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/recent_special_approvals/${uid}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_RECENT_SPECIAL_APPROVAL_LIST_REQUEST,
      types.FETCH_RECENT_SPECIAL_APPROVAL_LIST_SUCCESS,
      types.FETCH_RECENT_SPECIAL_APPROVAL_LIST_FAILURE,
    ],
  },
});

export const fetchSpecialApprovalList = uid => dispatch => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/special_approvals/${uid}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_SPECIAL_APPROVAL_LIST_REQUEST,
      types.FETCH_SPECIAL_APPROVAL_LIST_SUCCESS,
      types.FETCH_SPECIAL_APPROVAL_LIST_FAILURE,
    ],
  },
});

export const fetchWorkMonth = id => dispatch => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/work_months/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_WORK_MONTH_REQUEST,
      types.FETCH_WORK_MONTH_SUCCESS,
      types.FETCH_WORK_MONTH_FAILURE,
    ],
  },
});

export const fetchWorkMonthList = uid => dispatch => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/users/${uid}/work_months`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_WORK_MONTH_LIST_REQUEST,
      types.FETCH_WORK_MONTH_LIST_SUCCESS,
      types.FETCH_WORK_MONTH_LIST_FAILURE,
    ],
  },
});

export const markApproved = id => dispatch => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/work_months/${id}/mark_approved`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_WORK_MONTH_APPROVED_REQUEST,
      types.MARK_WORK_MONTH_APPROVED_SUCCESS,
      types.MARK_WORK_MONTH_APPROVED_FAILURE,
    ],
  },
});

export const markWaitingForApproval = id => dispatch => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/work_months/${id}/mark_waiting_for_approval`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.MARK_WORK_MONTH_WAITING_FOR_APPROVAL_REQUEST,
      types.MARK_WORK_MONTH_WAITING_FOR_APPROVAL_SUCCESS,
      types.MARK_WORK_MONTH_WAITING_FOR_APPROVAL_FAILURE,
    ],
  },
});
