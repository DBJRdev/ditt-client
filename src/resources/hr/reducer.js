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

  const filterData = (data) => ({
    ...data,
    sickDays: data.sickDays.map((sickDay) => ({
      ...sickDay,
      childDateOfBirth: sickDay.childDateOfBirth
        ? toMomentDateTime(sickDay.childDateOfBirth)
        : null,
      date: toMomentDateTime(sickDay.date),
    })),
  });

  if (type === actionTypes.FETCH_CHANGES_AND_ABSENCE_REGISTRATIONS_REQUEST) {
    return state
      .setIn(['changesAndAbsenceRegistrations', 'isFetching'], true)
      .setIn(['changesAndAbsenceRegistrations', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_CHANGES_AND_ABSENCE_REGISTRATIONS_SUCCESS) {
    return state
      .setIn(['changesAndAbsenceRegistrations', 'data'], Immutable.fromJS(payload.map(filterData)))
      .setIn(['changesAndAbsenceRegistrations', 'isFetching'], false)
      .setIn(['changesAndAbsenceRegistrations', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_CHANGES_AND_ABSENCE_REGISTRATIONS_FAILURE) {
    return state
      .setIn(['changesAndAbsenceRegistrations', 'isFetching'], false)
      .setIn(['changesAndAbsenceRegistrations', 'isFetchingFailure'], true);
  }

  return state;
};
