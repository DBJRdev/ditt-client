import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import * as types from './actionTypes';

const fetchWorkHoursList = id => dispatch => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/users/${id}/work_hours`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_WORK_HOURS_LIST_REQUEST,
      types.FETCH_WORK_HOURS_LIST_SUCCESS,
      types.FETCH_WORK_HOURS_LIST_FAILURE,
    ],
  },
});

export default fetchWorkHoursList;
