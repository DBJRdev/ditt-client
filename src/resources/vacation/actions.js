import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import * as types from './actionTypes';

const fetchVacationList = id => dispatch => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/users/${id}/vacations`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_VACATION_LIST_REQUEST,
      types.FETCH_VACATION_LIST_SUCCESS,
      types.FETCH_VACATION_LIST_FAILURE,
    ],
  },
});

export default fetchVacationList;
