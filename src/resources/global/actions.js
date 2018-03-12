import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import * as types from './actionTypes';

const fetchData = () => dispatch => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/example-data.json`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_DATA_REQUEST,
      types.FETCH_DATA_SUCCESS,
      types.FETCH_DATA_FAILURE,
    ],
  },
});

export default fetchData;
