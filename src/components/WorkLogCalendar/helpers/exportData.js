import {
  toDayMonthYearFormat, toHourMinuteFormat,
} from '../../../services/dateTimeService';
import { WORK_LOG } from '../../../resources/workMonth';
import {
  getSickDayVariantLabel,
  getStatusLabel,
  getTypeLabel,
} from '../../../services/workLogService';
import { downloadTextFile } from '../../../services/fileService/downloadTextFile';

export const exportData = (
  workMonth,
  t,
) => {
  const headers = [
    'type',
    'id',
    'startTime',
    'endTime',
    'status',
    'timeApproved',
    'timeRejected',
    'rejectionMessage',
    'comment',
    'plannedStart',
    'plannedEnd',
    'expectedDeparture',
    'expectedArrival',
    'destination',
    'transport',
    'variant',
    'childName',
    'childDateOfBirth',
    'title',
    'workTimeLimit',
  ];
  let normalizedData = [
    ...workMonth.workLogs.map((workLog) => [
      workLog.type,
      workLog.id,
      workLog.startTime,
      workLog.endTime,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ]),
    ...workMonth.banWorkLogs.map((workLog) => [
      workLog.type,
      workLog.id,
      workLog.date,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      workLog.workTimeLimit,
    ]),
    ...workMonth.businessTripWorkLogs.map((workLog) => [
      workLog.type,
      workLog.id,
      workLog.date,
      null,
      workLog.status,
      workLog.timeApproved,
      workLog.timeRejected,
      workLog.rejectionMessage,
      workLog.purpose,
      `${workLog.plannedStartHour.padStart(2, '0')}:${workLog.plannedStartMinute.padStart(2, '0')}`,
      `${workLog.plannedEndHour.padStart(2, '0')}:${workLog.plannedEndMinute.padStart(2, '0')}`,
      workLog.expectedDeparture,
      workLog.expectedArrival,
      workLog.destination,
      workLog.transport,
      null,
      null,
      null,
      null,
      null,
    ]),
    ...workMonth.homeOfficeWorkLogs.map((workLog) => [
      workLog.type,
      workLog.id,
      workLog.date,
      null,
      workLog.status,
      workLog.timeApproved,
      workLog.timeRejected,
      workLog.rejectionMessage,
      workLog.comment,
      `${workLog.plannedStartHour.padStart(2, '0')}:${workLog.plannedStartMinute.padStart(2, '0')}`,
      `${workLog.plannedEndHour.padStart(2, '0')}:${workLog.plannedEndMinute.padStart(2, '0')}`,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ]),
    ...workMonth.maternityProtectionWorkLogs.map((workLog) => [
      workLog.type,
      workLog.id,
      workLog.date,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ]),
    ...workMonth.overtimeWorkLogs.map((workLog) => [
      workLog.type,
      workLog.id,
      workLog.date,
      null,
      workLog.status,
      workLog.timeApproved,
      workLog.timeRejected,
      workLog.rejectionMessage,
      workLog.reason,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ]),
    ...workMonth.parentalLeaveWorkLogs.map((workLog) => [
      workLog.type,
      workLog.id,
      workLog.date,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ]),
    ...workMonth.sickDayUnpaidWorkLogs.map((workLog) => [
      workLog.type,
      workLog.id,
      workLog.date,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ]),
    ...workMonth.sickDayWorkLogs.map((workLog) => [
      workLog.type,
      workLog.id,
      workLog.date,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      workLog.variant,
      workLog.childName,
      workLog.childDateOfBirth,
      null,
      null,
    ]),
    ...workMonth.specialLeaveWorkLogs.map((workLog) => [
      workLog.type,
      workLog.id,
      workLog.date,
      null,
      workLog.status,
      workLog.timeApproved,
      workLog.timeRejected,
      workLog.rejectionMessage,
      workLog.reason,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ]),
    ...workMonth.timeOffWorkLogs.map((workLog) => [
      workLog.type,
      workLog.id,
      workLog.date,
      null,
      workLog.status,
      workLog.timeApproved,
      workLog.timeRejected,
      workLog.rejectionMessage,
      workLog.comment,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ]),
    ...workMonth.trainingWorkLogs.map((workLog) => [ // title
      workLog.type,
      workLog.id,
      workLog.date,
      null,
      workLog.status,
      workLog.timeApproved,
      workLog.timeRejected,
      workLog.rejectionMessage,
      workLog.comment,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      workLog.title,
      null,
    ]),
    ...workMonth.vacationWorkLogs.map((workLog) => [
      workLog.type,
      workLog.id,
      workLog.date,
      null,
      workLog.status,
      workLog.timeApproved,
      workLog.timeRejected,
      workLog.rejectionMessage,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ]),
  ];

  normalizedData = normalizedData
    .sort((rowA, rowB) => (rowA[2].unix() > rowB[2].unix() ? 1 : -1))
    .map((row) => {
      const rowLocal = [...row];

      rowLocal[0] = getTypeLabel(t, row[0]);

      if (row[0] === WORK_LOG) {
        rowLocal[2] = `${toDayMonthYearFormat(row[2])} ${toHourMinuteFormat(row[2])}`;
        rowLocal[3] = `${toDayMonthYearFormat(row[3])} ${toHourMinuteFormat(row[3])}`;
      } else {
        rowLocal[2] = toDayMonthYearFormat(row[2]);
      }

      if (row[4] !== null) {
        rowLocal[4] = getStatusLabel(t, row[4]);
      }

      if (row[5] !== null) {
        rowLocal[5] = `${toDayMonthYearFormat(row[5])} ${toHourMinuteFormat(row[5])}`;
      }

      if (row[6] !== null) {
        rowLocal[6] = `${toDayMonthYearFormat(row[6])} ${toHourMinuteFormat(row[6])}`;
      }

      if (row[15] !== null) {
        rowLocal[15] = getSickDayVariantLabel(t, row[15]);
      }

      if (row[17] !== null) {
        rowLocal[17] = toDayMonthYearFormat(row[17]);
      }

      return rowLocal;
    });

  const data = [
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
