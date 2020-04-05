import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import * as types from './actionTypes';

export const fetchChangesAndAbsenceRegistrations = (data) => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/hr/changes_and_absence_registrations?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_CHANGES_AND_ABSENCE_REGISTRATIONS_REQUEST,
      types.FETCH_CHANGES_AND_ABSENCE_REGISTRATIONS_SUCCESS,
      types.FETCH_CHANGES_AND_ABSENCE_REGISTRATIONS_FAILURE,
    ],
  },
});

export const fetchYearOverview = () => (dispatch) => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/hr/year_overview`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_YEAR_OVERVIEW_REQUEST,
      types.FETCH_YEAR_OVERVIEW_SUCCESS,
      types.FETCH_YEAR_OVERVIEW_FAILURE,
    ],
  },
});

