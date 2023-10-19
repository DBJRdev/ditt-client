import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import { toJson } from '../../services/dateTimeService';
import * as types from './actionTypes';

export const addUser = (data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      contracts: data.contracts.map(({
        _id,
        ...contract
      }) => ({
        ...contract,
        endDateTime: contract.endDateTime ? toJson(contract.endDateTime) : null,
        startDateTime: toJson(contract.startDateTime),
      })),
      email: data.email,
      employeeId: data.employeeId,
      firstName: data.firstName,
      isActive: data.isActive,
      lastName: data.lastName,
      plainPassword: data.plainPassword,
      supervisor: data.supervisor ? `/users/${data.supervisor.id}` : null,
      vacations: data.vacations
        .map((vacation) => ({
          ...vacation,
          year: `/supported_years/${vacation.year}`,
        })),
    }),
    endpoint: `${API_URL}/users`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.ADD_USER_REQUEST,
      types.ADD_USER_SUCCESS,
      types.ADD_USER_FAILURE,
    ],
  },
});

export const archiveUser = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/users/${id}/archive`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.ARCHIVE_USER_REQUEST,
      types.ARCHIVE_USER_SUCCESS,
      types.ARCHIVE_USER_FAILURE,
    ],
  },
});

export const deleteUser = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/users/${id}`,
    method: 'DELETE',
    types: [
      types.DELETE_USER_REQUEST,
      {
        meta: { id },
        type: types.DELETE_USER_SUCCESS,
      },
      types.DELETE_USER_FAILURE,
    ],
  },
});

export const editUser = (data) => (dispatch) => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      contracts: data.contracts.map(({
        _id,
        ...contract
      }) => ({
        ...contract,
        endDateTime: contract.endDateTime ? toJson(contract.endDateTime) : null,
        startDateTime: toJson(contract.startDateTime),
      })),
      email: data.email,
      employeeId: data.employeeId,
      firstName: data.firstName,
      isActive: data.isActive,
      lastName: data.lastName,
      notifications: data.notifications,
      plainPassword: data.plainPassword ? data.plainPassword : null,
      supervisor: data.supervisor ? `/users/${data.supervisor.id}` : null,
      vacations: data.vacations
        .map((vacation) => ({
          ...vacation,
          year: `/supported_years/${vacation.year}`,
        })),
    }),
    endpoint: `${API_URL}/users/${data.id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.EDIT_USER_REQUEST,
      {
        meta: { id: data.id },
        type: types.EDIT_USER_SUCCESS,
      },
      types.EDIT_USER_FAILURE,
    ],
  },
});

export const fetchSupervisedUserList = (uid) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/users/${uid}/supervised_users?isActive=true`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_SUPERVISED_USER_LIST_REQUEST,
      types.FETCH_SUPERVISED_USER_LIST_SUCCESS,
      types.FETCH_SUPERVISED_USER_LIST_FAILURE,
    ],
  },
});

export const fetchUser = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/users/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_USER_REQUEST,
      types.FETCH_USER_SUCCESS,
      types.FETCH_USER_FAILURE,
    ],
  },
});

export const fetchUserByApiToken = (apiToken) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/users/api_token/${apiToken}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_USER_REQUEST,
      types.FETCH_USER_SUCCESS,
      types.FETCH_USER_FAILURE,
    ],
  },
});

export const fetchUserList = (isArchived = null) => (dispatch) => {
  const filter = isArchived === null ? '' : `?isArchived=${isArchived}`;

  return dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/users${filter}`,
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
      types: [
        types.FETCH_USER_LIST_REQUEST,
        types.FETCH_USER_LIST_SUCCESS,
        types.FETCH_USER_LIST_FAILURE,
      ],
    },
  });
};

export const fetchUserListPartial = (isArchived = null) => (dispatch) => {
  const filter = isArchived === null ? '' : `?sArchived=${isArchived}&`;

  return dispatch({
    [RSAA]: {
      endpoint: `${API_URL}/users?${filter}properties[]=id&properties[]=firstName&properties[]=lastName&properties[supervisor][]=firstName&properties[supervisor][]=lastName`,
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
      types: [
        types.FETCH_USER_LIST_PARTIAL_REQUEST,
        types.FETCH_USER_LIST_PARTIAL_SUCCESS,
        types.FETCH_USER_LIST_PARTIAL_FAILURE,
      ],
    },
  });
};
export const renewUserApiToken = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/users/${id}/api_token/renew`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.RENEW_USER_API_TOKEN_REQUEST,
      types.RENEW_USER_API_TOKEN_SUCCESS,
      types.RENEW_USER_API_TOKEN_FAILURE,
    ],
  },
});

export const renewUserICalToken = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/users/${id}/ical_token/renew`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.RENEW_USER_ICAL_TOKEN_REQUEST,
      types.RENEW_USER_ICAL_TOKEN_SUCCESS,
      types.RENEW_USER_ICAL_TOKEN_FAILURE,
    ],
  },
});

export const resetUserApiToken = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/users/${id}/api_token/reset`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.RESET_USER_API_TOKEN_REQUEST,
      types.RESET_USER_API_TOKEN_SUCCESS,
      types.RESET_USER_API_TOKEN_FAILURE,
    ],
  },
});

export const resetUserICalToken = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/users/${id}/ical_token/reset`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.RESET_USER_ICAL_TOKEN_REQUEST,
      types.RESET_USER_ICAL_TOKEN_SUCCESS,
      types.RESET_USER_ICAL_TOKEN_FAILURE,
    ],
  },
});

export const unarchiveUser = (id) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/users/${id}/unarchive`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.UNARCHIVE_USER_REQUEST,
      types.UNARCHIVE_USER_SUCCESS,
      types.UNARCHIVE_USER_FAILURE,
    ],
  },
});
