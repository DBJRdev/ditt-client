import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import * as types from './actionTypes';

// eslint-disable-next-line
export const fetchConfig = () => dispatch => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/configs`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_CONFIG_REQUEST,
      types.FETCH_CONFIG_SUCCESS,
      types.FETCH_CONFIG_FAILURE,
    ],
  },
});

export const saveConfig = data => dispatch => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      supportedHolidays: data.supportedHolidays.map(holiday => ({
        day: holiday.get('date'),
        month: holiday.get('month') + 1,
        year: `/supported_years/${holiday.get('year')}`,
      })),
      supportedYears: data.supportedYears.map(year => ({ year: parseInt(year, 10) })),
    }),
    endpoint: `${API_URL}/configs`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.SAVE_CONFIG_REQUEST,
      types.SAVE_CONFIG_SUCCESS,
      types.SAVE_CONFIG_FAILURE,
    ],
  },
});

