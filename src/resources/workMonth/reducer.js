import Immutable from 'immutable';
import { toMomentDateTime } from '../../services/dateTimeService';
import {
  BAN_WORK_LOG,
  BUSINESS_TRIP_WORK_LOG,
  HOME_OFFICE_WORK_LOG,
  MATERNITY_PROTECTION_WORK_LOG,
  OVERTIME_WORK_LOG,
  PARENTAL_LEAVE_WORK_LOG,
  SICK_DAY_UNPAID_WORK_LOG,
  SICK_DAY_WORK_LOG,
  SPECIAL_LEAVE_WORK_LOG,
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

  const filterUserYearStats = (data) => ({
    ...data,
    year: parseInt(data.year.year, 10),
  });

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

  const filterUser = (data) => ({
    ...data,
    allSupervisors: data.allSupervisors
      ? data.allSupervisors.map(filterUser)
      : [],
    supervisor: data.supervisor
      ? filterUser(data.supervisor)
      : null,
    vacations: data.vacations
      ? data.vacations.map(filterVacation).sort((a, b) => a.year - b.year)
      : [],
    workHours: data.workHours
      ? data.workHours.map(filterWorkHour)
      : [],
    yearStats: data.yearStats
      ? data.yearStats.map(filterUserYearStats)
      : [],
  });

  const filterWorkMonth = (data) => ({
    id: data.id,
    month: parseInt(data.month, 10),
    status: data.status,
    user: filterUser(data.user),
    year: parseInt(data.year.year, 10),
  });

  const filterSupport = (data) => ({
    dateTime: toMomentDateTime(data.dateTime),
    id: data.id,
    supportedBy: filterUser(data.supportedBy),
  });

  const filterWorkMonthDetail = (data) => ({
    banWorkLogs: data.banWorkLogs
      .map((banWorkLogsData) => ({
        date: toMomentDateTime(banWorkLogsData.date),
        id: parseInt(banWorkLogsData.id, 10),
        type: BAN_WORK_LOG,
        workTimeLimit: parseInt(banWorkLogsData.workTimeLimit, 10),
      })),
    businessTripWorkLogs: data.businessTripWorkLogs.map((businessTripWorkLogsData) => ({
      date: toMomentDateTime(businessTripWorkLogsData.date),
      id: parseInt(businessTripWorkLogsData.id, 10),
      status: resolveWorkLogStatus(businessTripWorkLogsData),
      type: BUSINESS_TRIP_WORK_LOG,
    })),
    homeOfficeWorkLogs: data.homeOfficeWorkLogs.map((homeOfficeWorkLogsData) => ({
      date: toMomentDateTime(homeOfficeWorkLogsData.date),
      id: parseInt(homeOfficeWorkLogsData.id, 10),
      status: resolveWorkLogStatus(homeOfficeWorkLogsData),
      type: HOME_OFFICE_WORK_LOG,
    })),
    id: data.id,
    maternityProtectionWorkLogs: data.maternityProtectionWorkLogs
      .map((maternityProtectionWorkLogsData) => ({
        date: toMomentDateTime(maternityProtectionWorkLogsData.date),
        id: parseInt(maternityProtectionWorkLogsData.id, 10),
        type: MATERNITY_PROTECTION_WORK_LOG,
      })),
    month: parseInt(data.month, 10),
    overtimeWorkLogs: data.overtimeWorkLogs.map((overtimeWorkLogsData) => ({
      date: toMomentDateTime(overtimeWorkLogsData.date),
      id: parseInt(overtimeWorkLogsData.id, 10),
      status: resolveWorkLogStatus(overtimeWorkLogsData),
      type: OVERTIME_WORK_LOG,
    })),
    parentalLeaveWorkLogs: data.parentalLeaveWorkLogs
      .map((parentalLeaveWorkLogsData) => ({
        date: toMomentDateTime(parentalLeaveWorkLogsData.date),
        id: parseInt(parentalLeaveWorkLogsData.id, 10),
        type: PARENTAL_LEAVE_WORK_LOG,
      })),
    sickDayUnpaidWorkLogs: data.sickDayUnpaidWorkLogs
      .map((sickDayUnpaidWorkLogsData) => ({
        date: toMomentDateTime(sickDayUnpaidWorkLogsData.date),
        id: parseInt(sickDayUnpaidWorkLogsData.id, 10),
        type: SICK_DAY_UNPAID_WORK_LOG,
      })),
    sickDayWorkLogs: data.sickDayWorkLogs.map((sickDayWorkLogsData) => ({
      date: toMomentDateTime(sickDayWorkLogsData.date),
      id: parseInt(sickDayWorkLogsData.id, 10),
      type: SICK_DAY_WORK_LOG,
      variant: sickDayWorkLogsData.variant,
    })),
    specialLeaveWorkLogs: data.specialLeaveWorkLogs.map((specialLeaveWorkLogsData) => ({
      date: toMomentDateTime(specialLeaveWorkLogsData.date),
      id: parseInt(specialLeaveWorkLogsData.id, 10),
      rejectionMessage: specialLeaveWorkLogsData.rejectionMessage,
      status: resolveWorkLogStatus(specialLeaveWorkLogsData),
      type: SPECIAL_LEAVE_WORK_LOG,
    })),
    status: data.status,
    timeOffWorkLogs: data.timeOffWorkLogs.map((timeOffWorkLogsData) => ({
      date: toMomentDateTime(timeOffWorkLogsData.date),
      id: parseInt(timeOffWorkLogsData.id, 10),
      status: resolveWorkLogStatus(timeOffWorkLogsData),
      type: TIME_OFF_WORK_LOG,
    })),
    user: filterUser(data.user),
    vacationWorkLogs: data.vacationWorkLogs.map((vacationWorkLogsData) => ({
      date: toMomentDateTime(vacationWorkLogsData.date),
      id: parseInt(vacationWorkLogsData.id, 10),
      rejectionMessage: vacationWorkLogsData.rejectionMessage,
      status: resolveWorkLogStatus(vacationWorkLogsData),
      type: VACATION_WORK_LOG,
    })),
    workLogs: data.workLogs.map((workLogData) => ({
      endTime: toMomentDateTime(workLogData.endTime),
      id: parseInt(workLogData.id, 10),
      startTime: toMomentDateTime(workLogData.startTime),
      type: WORK_LOG,
    })),
    workTimeCorrection: parseInt(data.workTimeCorrection, 10),
    year: parseInt(data.year.year, 10),
  });

  const filterSpecialApprovals = (data) => ({
    businessTripWorkLogs: data.businessTripWorkLogs.map((businessTripWorkLogsData) => ({
      date: toMomentDateTime(businessTripWorkLogsData.date),
      id: parseInt(businessTripWorkLogsData.id, 10),
      status: resolveWorkLogStatus(businessTripWorkLogsData),
      support: businessTripWorkLogsData.support.map(filterSupport),
      type: BUSINESS_TRIP_WORK_LOG,
      workMonth: {
        id: parseInt(businessTripWorkLogsData.workMonth.id, 10),
        month: parseInt(businessTripWorkLogsData.workMonth.month, 10),
        status: businessTripWorkLogsData.workMonth.status,
        user: filterUser(businessTripWorkLogsData.workMonth.user),
        year: parseInt(businessTripWorkLogsData.workMonth.year.year, 10),
      },
    })),
    homeOfficeWorkLogs: data.homeOfficeWorkLogs.map((homeOfficeWorkLogsData) => ({
      comment: homeOfficeWorkLogsData.comment,
      date: toMomentDateTime(homeOfficeWorkLogsData.date),
      id: parseInt(homeOfficeWorkLogsData.id, 10),
      status: resolveWorkLogStatus(homeOfficeWorkLogsData),
      support: homeOfficeWorkLogsData.support.map(filterSupport),
      type: HOME_OFFICE_WORK_LOG,
      workMonth: {
        id: parseInt(homeOfficeWorkLogsData.workMonth.id, 10),
        month: parseInt(homeOfficeWorkLogsData.workMonth.month, 10),
        status: homeOfficeWorkLogsData.workMonth.status,
        user: filterUser(homeOfficeWorkLogsData.workMonth.user),
        year: parseInt(homeOfficeWorkLogsData.workMonth.year.year, 10),
      },
    })),
    overtimeWorkLogs: data.overtimeWorkLogs.map((overtimeWorkLogsData) => ({
      date: toMomentDateTime(overtimeWorkLogsData.date),
      id: parseInt(overtimeWorkLogsData.id, 10),
      status: resolveWorkLogStatus(overtimeWorkLogsData),
      support: overtimeWorkLogsData.support.map(filterSupport),
      type: OVERTIME_WORK_LOG,
      workMonth: {
        id: parseInt(overtimeWorkLogsData.workMonth.id, 10),
        month: parseInt(overtimeWorkLogsData.workMonth.month, 10),
        status: overtimeWorkLogsData.workMonth.status,
        user: filterUser(overtimeWorkLogsData.workMonth.user),
        year: parseInt(overtimeWorkLogsData.workMonth.year.year, 10),
      },
    })),
    specialLeaveWorkLogs: data.specialLeaveWorkLogs.map((specialLeaveWorkLogsData) => ({
      date: toMomentDateTime(specialLeaveWorkLogsData.date),
      id: parseInt(specialLeaveWorkLogsData.id, 10),
      rejectionMessage: specialLeaveWorkLogsData.rejectionMessage,
      status: resolveWorkLogStatus(specialLeaveWorkLogsData),
      support: specialLeaveWorkLogsData.support.map(filterSupport),
      type: SPECIAL_LEAVE_WORK_LOG,
      workMonth: {
        id: parseInt(specialLeaveWorkLogsData.workMonth.id, 10),
        month: parseInt(specialLeaveWorkLogsData.workMonth.month, 10),
        status: specialLeaveWorkLogsData.workMonth.status,
        user: filterUser(specialLeaveWorkLogsData.workMonth.user),
        year: parseInt(specialLeaveWorkLogsData.workMonth.year.year, 10),
      },
    })),
    timeOffWorkLogs: data.timeOffWorkLogs.map((timeOffWorkLogsData) => ({
      comment: timeOffWorkLogsData.comment,
      date: toMomentDateTime(timeOffWorkLogsData.date),
      id: parseInt(timeOffWorkLogsData.id, 10),
      status: resolveWorkLogStatus(timeOffWorkLogsData),
      support: timeOffWorkLogsData.support.map(filterSupport),
      type: TIME_OFF_WORK_LOG,
      workMonth: {
        id: parseInt(timeOffWorkLogsData.workMonth.id, 10),
        month: parseInt(timeOffWorkLogsData.workMonth.month, 10),
        status: timeOffWorkLogsData.workMonth.status,
        user: filterUser(timeOffWorkLogsData.workMonth.user),
        year: parseInt(timeOffWorkLogsData.workMonth.year.year, 10),
      },
    })),
    vacationWorkLogs: data.vacationWorkLogs.map((vacationWorkLogsData) => ({
      date: toMomentDateTime(vacationWorkLogsData.date),
      id: parseInt(vacationWorkLogsData.id, 10),
      rejectionMessage: vacationWorkLogsData.rejectionMessage,
      status: resolveWorkLogStatus(vacationWorkLogsData),
      support: vacationWorkLogsData.support.map(filterSupport),
      type: VACATION_WORK_LOG,
      workMonth: {
        id: parseInt(vacationWorkLogsData.workMonth.id, 10),
        month: parseInt(vacationWorkLogsData.workMonth.month, 10),
        status: vacationWorkLogsData.workMonth.status,
        user: filterUser(vacationWorkLogsData.workMonth.user),
        year: parseInt(vacationWorkLogsData.workMonth.year.year, 10),
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
      .setIn(['workMonth', 'data'], Immutable.fromJS(filterWorkMonthDetail(payload)))
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
      .setIn(['workMonthList', 'data'], Immutable.fromJS(payload.map(filterWorkMonth)))
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
      .setIn(['workMonth', 'data'], Immutable.fromJS(filterWorkMonthDetail(payload)))
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
      .setIn(['workMonth', 'data'], Immutable.fromJS(filterWorkMonthDetail(payload)))
      .setIn(['workMonth', 'isPosting'], false)
      .setIn(['workMonth', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_WORK_MONTH_WAITING_FOR_APPROVAL_FAILURE) {
    return state
      .setIn(['workMonth', 'isPosting'], false)
      .setIn(['workMonth', 'isPostingFailure'], true);
  }

  if (type === actionTypes.SET_WORK_TIME_CORRECTION_REQUEST) {
    return state
      .setIn(['workMonth', 'isPosting'], true)
      .setIn(['workMonth', 'isPostingFailure'], false);
  }

  if (type === actionTypes.SET_WORK_TIME_CORRECTION_SUCCESS) {
    return state
      .setIn(['workMonth', 'data'], Immutable.fromJS(filterWorkMonthDetail(payload)))
      .setIn(['workMonth', 'isPosting'], false)
      .setIn(['workMonth', 'isPostingFailure'], false);
  }

  if (type === actionTypes.SET_WORK_TIME_CORRECTION_FAILURE) {
    return state
      .setIn(['workMonth', 'isPosting'], false)
      .setIn(['workMonth', 'isPostingFailure'], true);
  }

  return state;
};
