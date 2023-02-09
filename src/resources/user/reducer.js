import Immutable from 'immutable';
import {
  toHourMinuteFormat,
  toMomentDateTime,
} from '../../services/dateTimeService';
import initialState from './initialState';
import * as actionTypes from './actionTypes';

export default (state, action) => {
  if (typeof state === 'undefined') {
    return initialState;
  }

  const {
    meta,
    payload,
    type,
  } = action;

  const filterUserYearStats = (data) => ({
    ...data,
    year: parseInt(data.year.year, 10),
  });

  const filterNotifications = (data) => {
    const convert = (value) => {
      if (value) {
        return toHourMinuteFormat(toMomentDateTime(value));
      }

      return null;
    };

    return ({
      ...data,
      supervisorInfoFridayTime: convert(data.supervisorInfoFridayTime),
      supervisorInfoMondayTime: convert(data.supervisorInfoMondayTime),
      supervisorInfoSaturdayTime: convert(data.supervisorInfoSaturdayTime),
      supervisorInfoSundayTime: convert(data.supervisorInfoSundayTime),
      supervisorInfoThursdayTime: convert(data.supervisorInfoThursdayTime),
      supervisorInfoTuesdayTime: convert(data.supervisorInfoTuesdayTime),
      supervisorInfoWednesdayTime: convert(data.supervisorInfoWednesdayTime),
    });
  };

  const filterVacation = (data) => ({
    remainingVacationDays: data.remainingVacationDays,
    vacationDays: data.vacationDays,
    vacationDaysCorrection: data.vacationDaysCorrection,
    year: parseInt(data.year.year, 10),
  });

  const filterWorkHour = (data) => ({
    month: parseInt(data.month, 10),
    requiredHours: data.requiredHours,
    year: parseInt(data.year.year, 10),
  });

  const filterWorkMonth = (data) => ({
    id: data.id,
    month: parseInt(data.month, 10),
    status: data.status,
    year: parseInt(data.year.year, 10),
  });

  const filterUser = (data) => ({
    ...data,
    allSupervisors: data.allSupervisors
      ? data.allSupervisors.map(filterUser)
      : [],
    notifications: data.notifications
      ? filterNotifications(data.notifications)
      : null,
    vacations: data.vacations
      ? data.vacations.map(filterVacation).sort((a, b) => a.year - b.year)
      : [],
    workHours: data.workHours
      ? data.workHours.map(filterWorkHour)
      : [],
    workMonths: data.workMonths
      ? data.workMonths.map(filterWorkMonth)
      : [],
    yearStats: data.yearStats
      ? data.yearStats.map(filterUserYearStats)
      : [],
  });

  if (type === actionTypes.ADD_USER_REQUEST) {
    return state
      .setIn(['addUser', 'isPosting'], true)
      .setIn(['addUser', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_USER_SUCCESS) {
    let userList = state.getIn(['userList', 'data']);
    userList = userList.set(userList.size, Immutable.fromJS(filterUser(payload)));

    return state
      .setIn(['userList', 'data'], userList)
      .setIn(['addUser', 'data'], Immutable.fromJS(filterUser(payload)))
      .setIn(['addUser', 'isPosting'], false)
      .setIn(['addUser', 'isPostingFailure'], false);
  }

  if (type === actionTypes.ADD_USER_FAILURE) {
    return state
      .setIn(['addUser', 'data'], null)
      .setIn(['addUser', 'isPosting'], false)
      .setIn(['addUser', 'isPostingFailure'], true);
  }

  if (type === actionTypes.DELETE_USER_REQUEST) {
    return state
      .setIn(['deleteUser', 'isPosting'], true)
      .setIn(['deleteUser', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_USER_SUCCESS) {
    let userList = state.getIn(['userList', 'data']);
    userList = userList.filter((user) => (
      user.get('id') !== meta.id
    ));

    return state
      .setIn(['userList', 'data'], userList)
      .setIn(['deleteUser', 'isPosting'], false)
      .setIn(['deleteUser', 'isPostingFailure'], false);
  }

  if (type === actionTypes.DELETE_USER_FAILURE) {
    return state
      .setIn(['deleteUser', 'isPosting'], false)
      .setIn(['deleteUser', 'isPostingFailure'], true);
  }

  if (type === actionTypes.EDIT_USER_REQUEST) {
    return state
      .setIn(['editUser', 'isPosting'], true)
      .setIn(['editUser', 'isPostingFailure'], false);
  }

  if (type === actionTypes.EDIT_USER_SUCCESS) {
    let userList = state.getIn(['userList', 'data']);
    userList = userList.map((user) => {
      if (user.get('id') !== meta.id) {
        return user;
      }

      return Immutable.fromJS(filterUser(payload));
    });

    return state
      .setIn(['user', 'data'], Immutable.fromJS(filterUser(payload)))
      .setIn(['userList', 'data'], userList)
      .setIn(['editUser', 'data'], Immutable.fromJS(filterUser(payload)))
      .setIn(['editUser', 'isPosting'], false)
      .setIn(['editUser', 'isPostingFailure'], false);
  }

  if (type === actionTypes.EDIT_USER_FAILURE) {
    return state
      .setIn(['editUser', 'data'], null)
      .setIn(['editUser', 'isPosting'], false)
      .setIn(['editUser', 'isPostingFailure'], true);
  }

  if (type === actionTypes.FETCH_SUPERVISED_USER_LIST_REQUEST) {
    return state
      .setIn(['supervisedUserList', 'isFetching'], true)
      .setIn(['supervisedUserList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_SUPERVISED_USER_LIST_SUCCESS) {
    return state
      .setIn(['supervisedUserList', 'data'], Immutable.fromJS(payload.map(filterUser)))
      .setIn(['supervisedUserList', 'isFetching'], false)
      .setIn(['supervisedUserList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_SUPERVISED_USER_LIST_FAILURE) {
    return state
      .setIn(['supervisedUserList', 'data'], Immutable.fromJS([]))
      .setIn(['supervisedUserList', 'isFetching'], false)
      .setIn(['supervisedUserList', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.FETCH_USER_REQUEST) {
    return state
      .setIn(['user', 'isFetching'], true)
      .setIn(['user', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_USER_SUCCESS) {
    return state
      .setIn(['user', 'data'], Immutable.fromJS(filterUser(payload)))
      .setIn(['user', 'isFetching'], false)
      .setIn(['user', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_USER_FAILURE) {
    return state
      .setIn(['user', 'data'], null)
      .setIn(['user', 'isFetching'], false)
      .setIn(['user', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.FETCH_USER_LIST_REQUEST) {
    return state
      .setIn(['userList', 'isFetching'], true)
      .setIn(['userList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_USER_LIST_SUCCESS) {
    return state
      .setIn(['userList', 'data'], Immutable.fromJS(payload.map(filterUser)))
      .setIn(['userList', 'isFetching'], false)
      .setIn(['userList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_USER_LIST_FAILURE) {
    return state
      .setIn(['userList', 'data'], Immutable.fromJS([]))
      .setIn(['userList', 'isFetching'], false)
      .setIn(['userList', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.FETCH_USER_OPTIONS_REQUEST) {
    return state
      .setIn(['userOptions', 'isFetching'], true)
      .setIn(['userOptions', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_USER_OPTIONS_SUCCESS) {
    return state
      .setIn(['userOptions', 'data'], Immutable.fromJS(payload))
      .setIn(['userOptions', 'isFetching'], false)
      .setIn(['userOptions', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_USER_OPTIONS_FAILURE) {
    return state
      .setIn(['userOptions', 'data'], Immutable.fromJS([]))
      .setIn(['userOptions', 'isFetching'], false)
      .setIn(['userOptions', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.RENEW_USER_API_TOKEN_REQUEST) {
    return state
      .setIn(['user', 'isPosting'], true)
      .setIn(['user', 'isPostingFailure'], false);
  }

  if (type === actionTypes.RENEW_USER_API_TOKEN_SUCCESS) {
    return state
      .setIn(['user', 'data', 'apiToken'], payload.apiToken)
      .setIn(['user', 'isPosting'], false)
      .setIn(['user', 'isPostingFailure'], false);
  }

  if (type === actionTypes.RENEW_USER_API_TOKEN_FAILURE) {
    return state
      .setIn(['user', 'data'], null)
      .setIn(['user', 'isPosting'], false)
      .setIn(['user', 'isPostingFailure'], true);
  }

  if (type === actionTypes.RENEW_USER_ICAL_TOKEN_REQUEST) {
    return state
      .setIn(['user', 'isPosting'], true)
      .setIn(['user', 'isPostingFailure'], false);
  }

  if (type === actionTypes.RENEW_USER_ICAL_TOKEN_SUCCESS) {
    return state
      .setIn(['user', 'data', 'iCalToken'], payload.iCalToken)
      .setIn(['user', 'isPosting'], false)
      .setIn(['user', 'isPostingFailure'], false);
  }

  if (type === actionTypes.RENEW_USER_ICAL_TOKEN_FAILURE) {
    return state
      .setIn(['user', 'data'], null)
      .setIn(['user', 'isPosting'], false)
      .setIn(['user', 'isPostingFailure'], true);
  }

  if (type === actionTypes.RESET_USER_API_TOKEN_REQUEST) {
    return state
      .setIn(['user', 'isPosting'], true)
      .setIn(['user', 'isPostingFailure'], false);
  }

  if (type === actionTypes.RESET_USER_API_TOKEN_SUCCESS) {
    return state
      .setIn(['user', 'data', 'apiToken'], payload.apiToken)
      .setIn(['user', 'isPosting'], false)
      .setIn(['user', 'isPostingFailure'], false);
  }

  if (type === actionTypes.RESET_USER_API_TOKEN_FAILURE) {
    return state
      .setIn(['user', 'data'], null)
      .setIn(['user', 'isPosting'], false)
      .setIn(['user', 'isPostingFailure'], true);
  }

  if (type === actionTypes.RESET_USER_ICAL_TOKEN_REQUEST) {
    return state
      .setIn(['user', 'isPosting'], true)
      .setIn(['user', 'isPostingFailure'], false);
  }

  if (type === actionTypes.RESET_USER_ICAL_TOKEN_SUCCESS) {
    return state
      .setIn(['user', 'data', 'iCalToken'], payload.iCalToken)
      .setIn(['user', 'isPosting'], false)
      .setIn(['user', 'isPostingFailure'], false);
  }

  if (type === actionTypes.RESET_USER_ICAL_TOKEN_FAILURE) {
    return state
      .setIn(['user', 'data'], null)
      .setIn(['user', 'isPosting'], false)
      .setIn(['user', 'isPostingFailure'], true);
  }

  return state;
};
