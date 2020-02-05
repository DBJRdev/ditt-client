import Immutable from 'immutable';
import moment from 'moment';
import {
  BUSINESS_TRIP_WORK_LOG,
  HOME_OFFICE_WORK_LOG,
  OVERTIME_WORK_LOG,
  SICK_DAY_WORK_LOG,
  STATUS_APPROVED,
  STATUS_OPENED,
  STATUS_REJECTED,
  STATUS_WAITING_FOR_APPROVAL,
  TIME_OFF_WORK_LOG,
  VACATION_WORK_LOG,
  WORK_LOG,
} from '../resources/workMonth';
import {
  VARIANT_SICK_CHILD,
  VARIANT_WITH_NOTE,
  VARIANT_WITHOUT_NOTE,
} from '../resources/sickDayWorkLog';
import {
  includesSameDate,
  isWeekend,
} from './dateTimeService';

export const getSickDayVariantLabel = (t, sickDayVariant) => {
  let sickDayVariantLabel = '';

  if (VARIANT_WITH_NOTE === sickDayVariant) {
    sickDayVariantLabel = t('sickDayWorkLog:constant.variant.withNote');
  } else if (VARIANT_WITHOUT_NOTE === sickDayVariant) {
    sickDayVariantLabel = t('sickDayWorkLog:constant.variant.withoutNote');
  } else if (VARIANT_SICK_CHILD === sickDayVariant) {
    sickDayVariantLabel = t('sickDayWorkLog:constant.variant.sickChild');
  } else {
    throw new Error(`Unknown variant ${sickDayVariant}`);
  }

  return sickDayVariantLabel;
};

export const getStatusLabel = (t, status) => {
  let statusLabel = '';

  if (STATUS_APPROVED === status) {
    statusLabel = t('workMonth:constant.status.approved');
  } else if (STATUS_OPENED === status) {
    statusLabel = t('workMonth:constant.status.opened');
  } else if (STATUS_REJECTED === status) {
    statusLabel = t('workMonth:constant.status.rejected');
  } else if (STATUS_WAITING_FOR_APPROVAL === status) {
    statusLabel = t('workMonth:constant.status.waitingForApproval');
  } else {
    throw new Error(`Unknown status ${status}`);
  }

  return statusLabel;
};

export const getTypeLabel = (t, type) => {
  let typeLabel = '';

  if (BUSINESS_TRIP_WORK_LOG === type) {
    typeLabel = t('workMonth:constant.type.businessTripWorkLog');
  } else if (HOME_OFFICE_WORK_LOG === type) {
    typeLabel = t('workMonth:constant.type.homeOfficeWorkLog');
  } else if (OVERTIME_WORK_LOG === type) {
    typeLabel = t('workMonth:constant.type.overtimeWorkLog');
  } else if (SICK_DAY_WORK_LOG === type) {
    typeLabel = t('workMonth:constant.type.sickDayWorkLog');
  } else if (TIME_OFF_WORK_LOG === type) {
    typeLabel = t('workMonth:constant.type.timeOffWorkLog');
  } else if (VACATION_WORK_LOG === type) {
    typeLabel = t('workMonth:constant.type.vacationWorkLog');
  } else if (WORK_LOG === type) {
    typeLabel = t('workMonth:constant.type.workLog');
  } else {
    throw new Error(`Unknown type ${type}`);
  }

  return typeLabel;
};

export const getWorkedTime = (date, workLogList, workHours, workedHoursLimits) => {
  const correctWorkedSeconds = (workedSeconds) => {
    if (
      workedSeconds > workedHoursLimits.lowerLimit.limit
      && workedSeconds <= workedHoursLimits.upperLimit.limit
    ) {
      return workedSeconds + workedHoursLimits.lowerLimit.changeBy;
    }

    if (workedSeconds > workedHoursLimits.upperLimit.limit) {
      return workedSeconds + workedHoursLimits.upperLimit.changeBy;
    }

    return workedSeconds;
  };

  const businessTripWorkLogs = workLogList.filter((
    (workLog) => workLog.type === BUSINESS_TRIP_WORK_LOG && workLog.status === STATUS_APPROVED
  ));
  const homeOfficeWorkLogs = workLogList.filter((
    (workLog) => workLog.type === HOME_OFFICE_WORK_LOG && workLog.status === STATUS_APPROVED
  ));
  const sickDayWorkLogs = workLogList.filter((
    (workLog) => workLog.type === SICK_DAY_WORK_LOG
  ));
  const vacationWorkLogs = workLogList.filter((
    (workLog) => workLog.type === VACATION_WORK_LOG && workLog.status === STATUS_APPROVED
  ));

  // Standard work log time
  let workedSeconds = workLogList.reduce((total, workLog) => {
    if (workLog.type === WORK_LOG) {
      return (workLog.endTime.diff(workLog.startTime) / 1000) + total;
    }

    return total;
  }, 0);

  workedSeconds = correctWorkedSeconds(workedSeconds);

  // Special work log time
  if (
    workedSeconds === 0
    && (
      businessTripWorkLogs.length > 0
      || homeOfficeWorkLogs.length > 0
      || sickDayWorkLogs.length > 0
      || vacationWorkLogs.length > 0
    )
  ) {
    workedSeconds = workHours.get('requiredHours') * 3600;
  }

  return moment.duration({ seconds: workedSeconds });
};

export const getWorkLogsByDay = (date, workLogList) => workLogList.filter((workLog) => {
  if (workLog.get('type') === WORK_LOG) {
    return date.isSame(workLog.get('startTime'), 'day');
  }

  return date.isSame(workLog.get('date'), 'day');
});

export const getWorkLogsByMonth = (date, workLogList) => workLogList.filter((workLog) => {
  if (workLog.type === WORK_LOG) {
    return date.isSame(workLog.startTime, 'month');
  }

  return date.isSame(workLog.date, 'month');
});

export const getWorkMonthByMonth = (date, workMonthList) => workMonthList.find((workMonth) => (
  date.month() + 1 === workMonth.month
  && date.year() === workMonth.year
));

export const collapseWorkLogs = (originalWorkLogs, supportedHolidays) => {
  let workLogs = [];
  const workLogsByStatus = {};

  // Group work logs by status and sort them by date

  originalWorkLogs
    .sortBy((workLog) => workLog.get('date'))
    .sortBy((workLog) => workLog.getIn(['workMonth', 'user', 'firstName']))
    .sortBy((workLog) => workLog.getIn(['workMonth', 'user', 'lastName']))
    .forEach((workLog) => {
      let status = workLog.get('status');

      if (status === STATUS_REJECTED) {
        status += `-${workLog.get('rejectionMessage')}`;
      }

      if (!workLogsByStatus[status]) {
        workLogsByStatus[status] = [];
      }

      workLogsByStatus[status].push(workLog);
    });

  Object.keys(workLogsByStatus).forEach((status) => {
    let collapsedWorkLog = [];
    let firstWorkLog = null;
    let nextWorkingDay = null;

    workLogsByStatus[status].forEach((workLog) => {
      if (!firstWorkLog) {
        // Add current work log into array of collapsed work log
        // if it is first work log (initialization)

        firstWorkLog = workLog;
        collapsedWorkLog.push(workLog);
      } else if (workLog.get('date').isSame(nextWorkingDay, 'day')) {
        // Add work log into array of collapsed work log
        // if current work log follows up on previous work log

        collapsedWorkLog.push(workLog);
      } else {
        // Add collapsed work log into array of work logs
        // if current work log does not follow up on previous work log,
        // initialize new collapsed work log and add current work log into it

        workLogs.push(collapsedWorkLog);
        collapsedWorkLog = [workLog];
        firstWorkLog = workLog;
      }

      // Find next working day (to check whether next work log follows up on current work log)

      nextWorkingDay = workLog.get('date').clone().add(1, 'day');

      while (isWeekend(nextWorkingDay) || includesSameDate(nextWorkingDay, supportedHolidays)) {
        nextWorkingDay = nextWorkingDay.add(1, 'day');
      }
    });

    // Add remaining work log into array of collapsed work log

    workLogs.push(collapsedWorkLog);
  });

  // Set isBulk flag, buldIds and dateTo if work log actually consist of more
  // than one work logs (= is collapsed work log)

  workLogs = workLogs.map((collapsedWorkLog) => {
    if (collapsedWorkLog.length === 1) {
      return collapsedWorkLog[0].set('isBulk', false);
    }

    let bulkWorkLog = collapsedWorkLog[0];
    bulkWorkLog = bulkWorkLog.set('dateTo', collapsedWorkLog[collapsedWorkLog.length - 1].get('date'));
    bulkWorkLog = bulkWorkLog.set('bulkIds', Immutable.List(collapsedWorkLog.map((workLog) => workLog.get('id'))));
    bulkWorkLog = bulkWorkLog.set('isBulk', true);

    return bulkWorkLog;
  });

  return workLogs;
};
