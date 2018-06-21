import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import { toJson } from '../../services/dateTimeService';
import * as types from './actionTypes';

export const addTimeOffWorkLog = data => dispatch => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      date: toJson(data.date),
    }),
    endpoint: `${API_URL}/time_off_work_logs`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.ADD_TIME_OFF_WORK_LOG_REQUEST,
      types.ADD_TIME_OFF_WORK_LOG_SUCCESS,
      types.ADD_TIME_OFF_WORK_LOG_FAILURE,
    ],
  },
});

export const deleteTimeOffWorkLog = id => dispatch => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/time_off_work_logs/${id}`,
    method: 'DELETE',
    types: [
      types.DELETE_TIME_OFF_WORK_LOG_REQUEST,
      {
        meta: { id },
        type: types.DELETE_TIME_OFF_WORK_LOG_SUCCESS,
      },
      types.DELETE_TIME_OFF_WORK_LOG_FAILURE,
    ],
  },
});
