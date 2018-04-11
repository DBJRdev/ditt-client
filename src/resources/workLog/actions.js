import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import * as types from './actionTypes';

const fetchWorkLogList = () => dispatch => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/work_logs`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_WORK_LOG_LIST_REQUEST,
      types.FETCH_WORK_LOG_LIST_SUCCESS,
      types.FETCH_WORK_LOG_LIST_FAILURE,
    ],
  },
});

export default fetchWorkLogList;
