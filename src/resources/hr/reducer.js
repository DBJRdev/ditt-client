import Immutable from 'immutable';
import { toMomentDateTime } from '../../services/dateTimeService';
import initialState from './initialState';
import * as actionTypes from './actionTypes';

export default (state, action) => {
  if (typeof state === 'undefined') {
    return initialState;
  }

  const {
    payload,
    type,
  } = action;

  const filterChangesAndAbsenceRegistrations = (data) => ({
    ...data,
    sickDays: data.sickDays.map((sickDay) => ({
      ...sickDay,
      childDateOfBirth: sickDay.childDateOfBirth
        ? toMomentDateTime(sickDay.childDateOfBirth)
        : null,
      date: toMomentDateTime(sickDay.date),
    })),
  });

  const filterYearOverview = filterChangesAndAbsenceRegistrations;

  if (type === actionTypes.FETCH_CHANGES_AND_ABSENCE_REGISTRATIONS_REQUEST) {
    return state
      .setIn(['changesAndAbsenceRegistrations', 'isFetching'], true)
      .setIn(['changesAndAbsenceRegistrations', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_CHANGES_AND_ABSENCE_REGISTRATIONS_SUCCESS) {
    return state
      .setIn(
        ['changesAndAbsenceRegistrations', 'data'],
        Immutable.fromJS(payload.map(filterChangesAndAbsenceRegistrations)),
      )
      .setIn(['changesAndAbsenceRegistrations', 'isFetching'], false)
      .setIn(['changesAndAbsenceRegistrations', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_CHANGES_AND_ABSENCE_REGISTRATIONS_FAILURE) {
    return state
      .setIn(['changesAndAbsenceRegistrations', 'isFetching'], false)
      .setIn(['changesAndAbsenceRegistrations', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.FETCH_YEAR_OVERVIEW_REQUEST) {
    return state
      .setIn(['yearOverview', 'isFetching'], true)
      .setIn(['yearOverview', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_YEAR_OVERVIEW_SUCCESS) {
    return state
      .setIn(
        ['yearOverview', 'data'],
        Immutable.fromJS(payload.map(filterYearOverview)),
      )
      .setIn(['yearOverview', 'isFetching'], false)
      .setIn(['yearOverview', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_YEAR_OVERVIEW_FAILURE) {
    return state
      .setIn(['yearOverview', 'isFetching'], false)
      .setIn(['yearOverview', 'isFetchingFailure'], true);
  }

  return state;
};
