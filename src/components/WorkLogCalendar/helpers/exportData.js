import { VARIANT_SICK_CHILD } from '../../../resources/sickDayWorkLog';
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
  VACATION_WORK_LOG,
  WORK_LOG,
} from '../../../resources/workMonth';
import {
  toDayMonthYearFormat,
  toHourMinuteFormat,
} from '../../../services/dateTimeService';
import { downloadTextFile } from '../../../services/fileService/downloadTextFile';
import { getSickDayVariantLabel } from '../../../services/workLogService';

export const exportData = (
  workMonth,
  daysOfSelectedMonth,
  t,
) => {
  const headers = [
    'date',
    'startTime',
    'endTime',
    'isHomeOffice',
    'businessTrip',
    'homeOffice',
    'sickDay',
    'sickDayChildName',
    'sickDayChildDateOfBirth',
    'specialLeave',
    'overtime',
    'timeOff',
    'vacation',
    'training',
    'banOnWorking',
    'workTimeLimit',
    'parentalLeave',
    'maternityProtection',
    'sickDayWithoutPay',
  ];

  const normalizedData = [];

  daysOfSelectedMonth.forEach((day) => {
    const workLogs = day.workLogList.filter((workLog) => workLog.type === WORK_LOG) || [];
    const businessTripWorkLogs = day.workLogList.filter((workLog) => workLog.type === BUSINESS_TRIP_WORK_LOG) || [];
    const homeOfficeWorkLogs = day.workLogList.filter((workLog) => workLog.type === HOME_OFFICE_WORK_LOG) || [];
    const sickDayWorkLogs = day.workLogList.filter((workLog) => workLog.type === SICK_DAY_WORK_LOG) || [];
    const specialLeaveWorkLogs = day.workLogList.filter((workLog) => workLog.type === SPECIAL_LEAVE_WORK_LOG) || [];
    const overtimeWorkLogs = day.workLogList.filter((workLog) => workLog.type === OVERTIME_WORK_LOG) || [];
    const timeOffWorkLogs = day.workLogList.filter((workLog) => workLog.type === TIME_OFF_WORK_LOG) || [];
    const vacationWorkLogs = day.workLogList.filter((workLog) => workLog.type === VACATION_WORK_LOG) || [];
    const trainingWorkLogs = day.workLogList.filter((workLog) => workLog.type === VACATION_WORK_LOG) || [];
    const banWorkLogs = day.workLogList.filter((workLog) => workLog.type === BAN_WORK_LOG) || [];
    const parentalLeaveWorkLogs = day.workLogList.filter((workLog) => workLog.type === PARENTAL_LEAVE_WORK_LOG) || [];
    const maternityProtectionWorkLogs = day.workLogList.filter(
      (workLog) => workLog.type === MATERNITY_PROTECTION_WORK_LOG,
    ) || [];
    const sickDayUnpaidWorkLogs = day.workLogList.filter((workLog) => workLog.type === SICK_DAY_UNPAID_WORK_LOG) || [];

    normalizedData.push([
      toDayMonthYearFormat(day.date),
      workLogs.length > 0 ? toHourMinuteFormat(workLogs[0].startTime) : '',
      workLogs.length > 0 ? toHourMinuteFormat(workLogs[0].endTime) : '',
      workLogs.length > 0 && workLogs[0].isHomeOffice ? t('csv:exportWorkMonth.yes') : '',
      businessTripWorkLogs.map(
        (workLog) => (workLog.timeApproved != null ? t('csv:exportWorkMonth.approved') : ''),
      ).join(', '),
      homeOfficeWorkLogs.map(
        (workLog) => (workLog.timeApproved != null ? t('csv:exportWorkMonth.approved') : ''),
      ).join(', '),
      sickDayWorkLogs.map((workLog) => getSickDayVariantLabel(t, workLog.variant)).join(', '),
      sickDayWorkLogs.map(
        (workLog) => (workLog.variant === VARIANT_SICK_CHILD ? workLog.childName : ''),
      ).join(', '),
      sickDayWorkLogs.map(
        (workLog) => (workLog.variant === VARIANT_SICK_CHILD ? toDayMonthYearFormat(workLog.childDateOfBirth) : ''),
      ).join(', '),
      specialLeaveWorkLogs.map(
        (workLog) => (workLog.timeApproved != null ? t('csv:exportWorkMonth.approved') : ''),
      ).join(', '),
      timeOffWorkLogs.map(
        (workLog) => (workLog.timeApproved != null ? t('csv:exportWorkMonth.approved') : ''),
      ).join(', '),
      overtimeWorkLogs.map(
        (workLog) => (workLog.timeApproved != null ? t('csv:exportWorkMonth.approved') : ''),
      ).join(', '),
      vacationWorkLogs.map(
        (workLog) => (workLog.timeApproved != null ? t('csv:exportWorkMonth.approved') : ''),
      ).join(', '),
      trainingWorkLogs.map(
        (workLog) => (workLog.timeApproved != null ? t('csv:exportWorkMonth.approved') : ''),
      ).join(', '),
      banWorkLogs.length > 0 ? t('csv:exportWorkMonth.banOnWorking') : '',
      banWorkLogs.map((workLog) => workLog.workTimeLimit).join(', '),
      parentalLeaveWorkLogs.length > 0 ? t('csv:exportWorkMonth.parentalLeave') : '',
      maternityProtectionWorkLogs.length > 0 ? t('csv:exportWorkMonth.maternityProtection') : '',
      sickDayUnpaidWorkLogs.length > 0 ? t('csv:exportWorkMonth.sickDayWithoutPay') : '',
    ]);

    if (workLogs.length > 1) {
      for (let i = 1; i < workLogs.length; i += 1) {
        normalizedData.push([
          '',
          toHourMinuteFormat(workLogs[i].startTime),
          toHourMinuteFormat(workLogs[i].endTime),
          workLogs[i].isHomeOffice ? t('csv:exportWorkMonth.yes') : '',
        ]);
      }
    }
  });

  const data = [
    [`${workMonth.user.lastName}, ${workMonth.user.firstName}`],
    [workMonth.user.employeeId],
    headers.map((name) => t(`csv:exportWorkMonth.${name}`)),
    ...normalizedData,
  ];
  const csvData = data
    .map((row) => row.join(','))
    .join('\n');

  downloadTextFile(
    `${workMonth.user.id}_${workMonth.user.lastName}_${workMonth.user.firstName}_${workMonth.year}_${workMonth.month}`,
    'text/csv',
    csvData,
  );

  return data;
};
