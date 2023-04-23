import Immutable from 'immutable';
import { generate } from 'shortid';
import { toMomentDateTime } from '../../services/dateTimeService';
import { transformContract } from '../contract';
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
    id: generate(),
    ...data,
    contracts: data.contracts.map(transformContract),
    sickDays: data.sickDays.map((sickDay) => ({
      ...sickDay,
      childDateOfBirth: sickDay.childDateOfBirth
        ? toMomentDateTime(sickDay.childDateOfBirth)
        : null,
      date: toMomentDateTime(sickDay.date),
      workMonth: {
        user: data.user,
        ...sickDay.workMonth,
      },
    })),
  });
  const sortFunc = (a, b) => (a.user.lastName > b.user.lastName ? 1 : -1);

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
        Immutable.fromJS(payload.map(filterChangesAndAbsenceRegistrations).sort(sortFunc)),
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
        Immutable.fromJS(payload.map(filterYearOverview).sort(sortFunc)),
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
