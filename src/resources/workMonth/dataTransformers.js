import { toMomentDateTime } from '../../services/dateTimeService';
import { transformVacation } from '../vacation';
import { transformWorkHours } from '../workHours';
import { transformBanWorkLog } from '../banWorkLog';
import { transformHomeOfficeWorkLog } from '../homeOfficeWorkLog';
import { transformMaternityProtectionWorkLog } from '../maternityProtectionWorkLog';
import { transformOvertimeWorkLog } from '../overtimeWorkLog';
import { transformParentalProtectionWorkLog } from '../parentalLeaveWorkLog';
import { transformSickDayUnpaidWorkLog } from '../sickDayUnpaidWorkLog';
import { transformSickDayWorkLog } from '../sickDayWorkLog';
import { transformSpecialLeaveWorkLog } from '../specialLeaveWorkLog';
import { transformTimeOffWorkLog } from '../timeOffWorkLog';
import { transformTrainingWorkLog } from '../trainingWorkLog';
import { transformWorkLog } from '../workLog';
import { transformBusinessTripWorkLog } from '../businessTripWorkLog';
import { transformVacationWorkLog } from '../vacationWorkLog';
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
  TIME_OFF_WORK_LOG,
  TRAINING_WORK_LOG,
  VACATION_WORK_LOG,
  WORK_LOG,
} from './constants';

const filterUserYearStats = (data) => ({
  ...data,
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
    ? data.vacations.map(transformVacation).sort((a, b) => a.year - b.year)
    : [],
  workHours: data.workHours
    ? data.workHours.map(transformWorkHours)
    : [],
  yearStats: data.yearStats
    ? data.yearStats.map(filterUserYearStats)
    : [],
});

const filterSupport = (data) => ({
  dateTime: toMomentDateTime(data.dateTime),
  id: data.id,
  supportedBy: filterUser(data.supportedBy),
});

export const transformWorkMonth = (data) => ({
  id: data.id,
  month: parseInt(data.month, 10),
  requiredTime: data.requiredTime != null ? parseInt(data.requiredTime, 10) : null,
  status: data.status,
  user: filterUser(data.user),
  workedTime: data.workedTime != null ? parseInt(data.workedTime, 10) : null,
  year: parseInt(data.year.year, 10),
});

export const transformWorkMonthDetail = (data) => ({
  banWorkLogs: data.banWorkLogs
    .map((banWorkLogsData) => ({
      ...transformBanWorkLog(banWorkLogsData),
      type: BAN_WORK_LOG,
    })),
  businessTripWorkLogs: data.businessTripWorkLogs.map((businessTripWorkLogsData) => ({
    ...transformBusinessTripWorkLog(businessTripWorkLogsData),
    type: BUSINESS_TRIP_WORK_LOG,
  })),
  homeOfficeWorkLogs: data.homeOfficeWorkLogs.map((homeOfficeWorkLogsData) => ({
    ...transformHomeOfficeWorkLog(homeOfficeWorkLogsData),
    type: HOME_OFFICE_WORK_LOG,
  })),
  id: data.id,
  maternityProtectionWorkLogs: data.maternityProtectionWorkLogs
    .map((maternityProtectionWorkLogsData) => ({
      ...transformMaternityProtectionWorkLog(maternityProtectionWorkLogsData),
      type: MATERNITY_PROTECTION_WORK_LOG,
    })),
  month: parseInt(data.month, 10),
  overtimeWorkLogs: data.overtimeWorkLogs.map((overtimeWorkLogsData) => ({
    ...transformOvertimeWorkLog(overtimeWorkLogsData),
    type: OVERTIME_WORK_LOG,
  })),
  parentalLeaveWorkLogs: data.parentalLeaveWorkLogs
    .map((parentalLeaveWorkLogsData) => ({
      ...transformParentalProtectionWorkLog(parentalLeaveWorkLogsData),
      type: PARENTAL_LEAVE_WORK_LOG,
    })),
  requiredTime: data.workedTime ? parseInt(data.requiredTime, 10) : null,
  sickDayUnpaidWorkLogs: data.sickDayUnpaidWorkLogs
    .map((sickDayUnpaidWorkLogsData) => ({
      ...transformSickDayUnpaidWorkLog(sickDayUnpaidWorkLogsData),
      type: SICK_DAY_UNPAID_WORK_LOG,
    })),
  sickDayWorkLogs: data.sickDayWorkLogs.map((sickDayWorkLogsData) => ({
    ...transformSickDayWorkLog(sickDayWorkLogsData),
    type: SICK_DAY_WORK_LOG,
  })),
  specialLeaveWorkLogs: data.specialLeaveWorkLogs.map((specialLeaveWorkLogsData) => ({
    ...transformSpecialLeaveWorkLog(specialLeaveWorkLogsData),
    type: SPECIAL_LEAVE_WORK_LOG,
  })),
  status: data.status,
  timeOffWorkLogs: data.timeOffWorkLogs.map((timeOffWorkLogsData) => ({
    ...transformTimeOffWorkLog(timeOffWorkLogsData),
    type: TIME_OFF_WORK_LOG,
  })),
  trainingWorkLogs: data.trainingWorkLogs.map((trainingWorkLogsData) => ({
    ...transformTrainingWorkLog(trainingWorkLogsData),
    type: TRAINING_WORK_LOG,
  })),
  user: filterUser(data.user),
  vacationWorkLogs: data.vacationWorkLogs.map((vacationWorkLogsData) => ({
    ...transformVacationWorkLog(vacationWorkLogsData),
    type: VACATION_WORK_LOG,
  })),
  workLogs: data.workLogs.map((workLogData) => ({
    ...transformWorkLog(workLogData),
    type: WORK_LOG,
  })),
  workTimeCorrection: parseInt(data.workTimeCorrection, 10),
  workedTime: data.workedTime ? parseInt(data.workedTime, 10) : null,
  year: parseInt(data.year.year, 10),
});

const transformSpecialApprovalsWorkMonth = (data) => ({
  id: parseInt(data.workMonth.id, 10),
  month: parseInt(data.workMonth.month, 10),
  status: data.workMonth.status,
  user: filterUser(data.workMonth.user),
  year: parseInt(data.workMonth.year.year, 10),
});

export const transformSpecialApprovals = (data) => ({
  businessTripWorkLogs: data.businessTripWorkLogs.map((businessTripWorkLogsData) => ({
    ...transformBusinessTripWorkLog(businessTripWorkLogsData),
    support: businessTripWorkLogsData.support.map(filterSupport),
    type: BUSINESS_TRIP_WORK_LOG,
    workMonth: transformSpecialApprovalsWorkMonth(businessTripWorkLogsData),
  })),
  homeOfficeWorkLogs: data.homeOfficeWorkLogs.map((homeOfficeWorkLogsData) => ({
    ...transformHomeOfficeWorkLog(homeOfficeWorkLogsData),
    support: homeOfficeWorkLogsData.support.map(filterSupport),
    type: HOME_OFFICE_WORK_LOG,
    workMonth: transformSpecialApprovalsWorkMonth(homeOfficeWorkLogsData),
  })),
  overtimeWorkLogs: data.overtimeWorkLogs.map((overtimeWorkLogsData) => ({
    ...transformOvertimeWorkLog(overtimeWorkLogsData),
    support: overtimeWorkLogsData.support.map(filterSupport),
    type: OVERTIME_WORK_LOG,
    workMonth: transformSpecialApprovalsWorkMonth(overtimeWorkLogsData),
  })),
  specialLeaveWorkLogs: data.specialLeaveWorkLogs.map((specialLeaveWorkLogsData) => ({
    ...transformSpecialLeaveWorkLog(specialLeaveWorkLogsData),
    support: specialLeaveWorkLogsData.support.map(filterSupport),
    type: SPECIAL_LEAVE_WORK_LOG,
    workMonth: transformSpecialApprovalsWorkMonth(specialLeaveWorkLogsData),
  })),
  timeOffWorkLogs: data.timeOffWorkLogs.map((timeOffWorkLogsData) => ({
    ...transformTimeOffWorkLog(timeOffWorkLogsData),
    support: timeOffWorkLogsData.support.map(filterSupport),
    type: TIME_OFF_WORK_LOG,
    workMonth: transformSpecialApprovalsWorkMonth(timeOffWorkLogsData),
  })),
  trainingWorkLogs: data.trainingWorkLogs.map((trainingWorkLogsData) => ({
    ...transformTrainingWorkLog(trainingWorkLogsData),
    support: trainingWorkLogsData.support.map(filterSupport),
    type: TRAINING_WORK_LOG,
    workMonth: transformSpecialApprovalsWorkMonth(trainingWorkLogsData),
  })),
  vacationWorkLogs: data.vacationWorkLogs.map((vacationWorkLogsData) => ({
    ...transformVacationWorkLog(vacationWorkLogsData),
    support: vacationWorkLogsData.support.map(filterSupport),
    type: VACATION_WORK_LOG,
    workMonth: transformSpecialApprovalsWorkMonth(vacationWorkLogsData),
  })),
});
