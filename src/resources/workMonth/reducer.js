import Immutable from 'immutable';
import { toMomentDateTime } from '../../services/dateTimeService';
import {
  BUSINESS_TRIP_WORK_LOG,
  HOME_OFFICE_WORK_LOG,
  OVERTIME_WORK_LOG,
  SICK_DAY_WORK_LOG,
  STATUS_APPROVED,
  STATUS_REJECTED,
  STATUS_WAITING_FOR_APPROVAL,
  TIME_OFF_WORK_LOG,
  VACATION_WORK_LOG,
  WORK_LOG,
} from './constants';
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

  const resolveWorkLogStatus = (workLog) => {
    if (workLog.timeApproved) {
      return STATUS_APPROVED;
    }

    if (workLog.timeRejected) {
      return STATUS_REJECTED;
    }

    return STATUS_WAITING_FOR_APPROVAL;
  };

  const filterWorkMonth = data => ({
    businessTripWorkLogs: data.businessTripWorkLogs.map(businessTripWorkLogsData => ({
      date: toMomentDateTime(businessTripWorkLogsData.date),
      id: parseInt(businessTripWorkLogsData.id, 10),
      status: resolveWorkLogStatus(businessTripWorkLogsData),
      type: BUSINESS_TRIP_WORK_LOG,
    })),
    homeOfficeWorkLogs: data.homeOfficeWorkLogs.map(homeOfficeWorkLogsData => ({
      date: toMomentDateTime(homeOfficeWorkLogsData.date),
      id: parseInt(homeOfficeWorkLogsData.id, 10),
      status: resolveWorkLogStatus(homeOfficeWorkLogsData),
      type: HOME_OFFICE_WORK_LOG,
    })),
    id: data.id,
    month: parseInt(data.month, 10),
    overtimeWorkLogs: data.overtimeWorkLogs.map(overtimeWorkLogsData => ({
      date: toMomentDateTime(overtimeWorkLogsData.date),
      id: parseInt(overtimeWorkLogsData.id, 10),
      status: resolveWorkLogStatus(overtimeWorkLogsData),
      type: OVERTIME_WORK_LOG,
    })),
    sickDayWorkLogs: data.sickDayWorkLogs.map(sickDayWorkLogsData => ({
      date: toMomentDateTime(sickDayWorkLogsData.date),
      id: parseInt(sickDayWorkLogsData.id, 10),
      type: SICK_DAY_WORK_LOG,
      variant: sickDayWorkLogsData.variant,
    })),
    status: data.status,
    timeOffWorkLogs: data.timeOffWorkLogs.map(timeOffWorkLogsData => ({
      date: toMomentDateTime(timeOffWorkLogsData.date),
      id: parseInt(timeOffWorkLogsData.id, 10),
      status: resolveWorkLogStatus(timeOffWorkLogsData),
      type: TIME_OFF_WORK_LOG,
    })),
    vacationWorkLogs: data.vacationWorkLogs.map(vacationWorkLogsData => ({
      date: toMomentDateTime(vacationWorkLogsData.date),
      id: parseInt(vacationWorkLogsData.id, 10),
      status: resolveWorkLogStatus(vacationWorkLogsData),
      type: VACATION_WORK_LOG,
    })),
    workLogs: data.workLogs.map(workLogData => ({
      endTime: toMomentDateTime(workLogData.endTime),
      id: parseInt(workLogData.id, 10),
      startTime: toMomentDateTime(workLogData.startTime),
      type: WORK_LOG,
    })),
    year: parseInt(data.year, 10),
  });

  const filterSpecialApprovals = data => ({
    businessTripWorkLogs: data.businessTripWorkLogs.map(businessTripWorkLogsData => ({
      date: toMomentDateTime(businessTripWorkLogsData.date),
      id: parseInt(businessTripWorkLogsData.id, 10),
      status: resolveWorkLogStatus(businessTripWorkLogsData),
      type: BUSINESS_TRIP_WORK_LOG,
      workMonth: {
        id: parseInt(businessTripWorkLogsData.workMonth.id, 10),
        month: parseInt(businessTripWorkLogsData.workMonth.month, 10),
        status: businessTripWorkLogsData.workMonth.status,
        user: {
          email: businessTripWorkLogsData.workMonth.user.email,
          firstName: businessTripWorkLogsData.workMonth.user.firstName,
          id: businessTripWorkLogsData.workMonth.user.id,
          lastName: businessTripWorkLogsData.workMonth.user.lastName,
        },
        year: parseInt(businessTripWorkLogsData.workMonth.year, 10),
      },
    })),
    homeOfficeWorkLogs: data.homeOfficeWorkLogs.map(homeOfficeWorkLogsData => ({
      date: toMomentDateTime(homeOfficeWorkLogsData.date),
      id: parseInt(homeOfficeWorkLogsData.id, 10),
      status: resolveWorkLogStatus(homeOfficeWorkLogsData),
      type: HOME_OFFICE_WORK_LOG,
      workMonth: {
        id: parseInt(homeOfficeWorkLogsData.workMonth.id, 10),
        month: parseInt(homeOfficeWorkLogsData.workMonth.month, 10),
        status: homeOfficeWorkLogsData.workMonth.status,
        user: {
          email: homeOfficeWorkLogsData.workMonth.user.email,
          firstName: homeOfficeWorkLogsData.workMonth.user.firstName,
          id: homeOfficeWorkLogsData.workMonth.user.id,
          lastName: homeOfficeWorkLogsData.workMonth.user.lastName,
        },
        year: parseInt(homeOfficeWorkLogsData.workMonth.year, 10),
      },
    })),
    overtimeWorkLogs: data.overtimeWorkLogs.map(overtimeWorkLogsData => ({
      date: toMomentDateTime(overtimeWorkLogsData.date),
      id: parseInt(overtimeWorkLogsData.id, 10),
      status: resolveWorkLogStatus(overtimeWorkLogsData),
      type: OVERTIME_WORK_LOG,
      workMonth: {
        id: parseInt(overtimeWorkLogsData.workMonth.id, 10),
        month: parseInt(overtimeWorkLogsData.workMonth.month, 10),
        status: overtimeWorkLogsData.workMonth.status,
        user: {
          email: overtimeWorkLogsData.workMonth.user.email,
          firstName: overtimeWorkLogsData.workMonth.user.firstName,
          id: overtimeWorkLogsData.workMonth.user.id,
          lastName: overtimeWorkLogsData.workMonth.user.lastName,
        },
        year: parseInt(overtimeWorkLogsData.workMonth.year, 10),
      },
    })),
    timeOffWorkLogs: data.timeOffWorkLogs.map(timeOffWorkLogsData => ({
      date: toMomentDateTime(timeOffWorkLogsData.date),
      id: parseInt(timeOffWorkLogsData.id, 10),
      status: resolveWorkLogStatus(timeOffWorkLogsData),
      type: TIME_OFF_WORK_LOG,
      workMonth: {
        id: parseInt(timeOffWorkLogsData.workMonth.id, 10),
        month: parseInt(timeOffWorkLogsData.workMonth.month, 10),
        status: timeOffWorkLogsData.workMonth.status,
        user: {
          email: timeOffWorkLogsData.workMonth.user.email,
          firstName: timeOffWorkLogsData.workMonth.user.firstName,
          id: timeOffWorkLogsData.workMonth.user.id,
          lastName: timeOffWorkLogsData.workMonth.user.lastName,
        },
        year: parseInt(timeOffWorkLogsData.workMonth.year, 10),
      },
    })),
    vacationWorkLogs: data.vacationWorkLogs.map(vacationWorkLogsData => ({
      date: toMomentDateTime(vacationWorkLogsData.date),
      id: parseInt(vacationWorkLogsData.id, 10),
      status: resolveWorkLogStatus(vacationWorkLogsData),
      type: VACATION_WORK_LOG,
      workMonth: {
        id: parseInt(vacationWorkLogsData.workMonth.id, 10),
        month: parseInt(vacationWorkLogsData.workMonth.month, 10),
        status: vacationWorkLogsData.workMonth.status,
        user: {
          email: vacationWorkLogsData.workMonth.user.email,
          firstName: vacationWorkLogsData.workMonth.user.firstName,
          id: vacationWorkLogsData.workMonth.user.id,
          lastName: vacationWorkLogsData.workMonth.user.lastName,
        },
        year: parseInt(vacationWorkLogsData.workMonth.year, 10),
      },
    })),
  });

  if (type === actionTypes.FETCH_RECENT_SPECIAL_APPROVAL_LIST_REQUEST) {
    return state
      .setIn(['recentSpecialApprovalList', 'isFetching'], true)
      .setIn(['recentSpecialApprovalList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_RECENT_SPECIAL_APPROVAL_LIST_SUCCESS) {
    return state
      .setIn(['recentSpecialApprovalList', 'data'], Immutable.fromJS(filterSpecialApprovals(payload)))
      .setIn(['recentSpecialApprovalList', 'isFetching'], false)
      .setIn(['recentSpecialApprovalList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_RECENT_SPECIAL_APPROVAL_LIST_FAILURE) {
    return state
      .setIn(['recentSpecialApprovalList', 'data'], null)
      .setIn(['recentSpecialApprovalList', 'isFetching'], false)
      .setIn(['recentSpecialApprovalList', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.FETCH_SPECIAL_APPROVAL_LIST_REQUEST) {
    return state
      .setIn(['specialApprovalList', 'isFetching'], true)
      .setIn(['specialApprovalList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_SPECIAL_APPROVAL_LIST_SUCCESS) {
    return state
      .setIn(['specialApprovalList', 'data'], Immutable.fromJS(filterSpecialApprovals(payload)))
      .setIn(['specialApprovalList', 'isFetching'], false)
      .setIn(['specialApprovalList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_SPECIAL_APPROVAL_LIST_FAILURE) {
    return state
      .setIn(['specialApprovalList', 'data'], null)
      .setIn(['specialApprovalList', 'isFetching'], false)
      .setIn(['specialApprovalList', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.FETCH_WORK_MONTH_REQUEST) {
    return state
      .setIn(['workMonth', 'isFetching'], true)
      .setIn(['workMonth', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_WORK_MONTH_SUCCESS) {
    return state
      .setIn(['workMonth', 'data'], Immutable.fromJS(filterWorkMonth(payload)))
      .setIn(['workMonth', 'isFetching'], false)
      .setIn(['workMonth', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_WORK_MONTH_FAILURE) {
    return state
      .setIn(['workMonth', 'data'], null)
      .setIn(['workMonth', 'isFetching'], false)
      .setIn(['workMonth', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.FETCH_WORK_MONTH_LIST_REQUEST) {
    return state
      .setIn(['workMonthList', 'isFetching'], true)
      .setIn(['workMonthList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_WORK_MONTH_LIST_SUCCESS) {
    return state
      .setIn(['workMonthList', 'data'], Immutable.fromJS(payload))
      .setIn(['workMonthList', 'isFetching'], false)
      .setIn(['workMonthList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_WORK_MONTH_LIST_FAILURE) {
    return state
      .setIn(['workMonthList', 'data'], Immutable.fromJS([]))
      .setIn(['workMonthList', 'isFetching'], false)
      .setIn(['workMonthList', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.MARK_WORK_MONTH_APPROVED_REQUEST) {
    return state
      .setIn(['workMonth', 'isPosting'], true)
      .setIn(['workMonth', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_WORK_MONTH_APPROVED_SUCCESS) {
    return state
      .setIn(['workMonth', 'data'], Immutable.fromJS(filterWorkMonth(payload)))
      .setIn(['workMonth', 'isPosting'], false)
      .setIn(['workMonth', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_WORK_MONTH_APPROVED_FAILURE) {
    return state
      .setIn(['workMonth', 'isPosting'], false)
      .setIn(['workMonth', 'isPostingFailure'], true);
  }

  if (type === actionTypes.MARK_WORK_MONTH_WAITING_FOR_APPROVAL_REQUEST) {
    return state
      .setIn(['workMonth', 'isPosting'], true)
      .setIn(['workMonth', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_WORK_MONTH_WAITING_FOR_APPROVAL_SUCCESS) {
    return state
      .setIn(['workMonth', 'data'], Immutable.fromJS(filterWorkMonth(payload)))
      .setIn(['workMonth', 'isPosting'], false)
      .setIn(['workMonth', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_WORK_MONTH_WAITING_FOR_APPROVAL_FAILURE) {
    return state
      .setIn(['workMonth', 'isPosting'], false)
      .setIn(['workMonth', 'isPostingFailure'], true);
  }

  return state;
};
