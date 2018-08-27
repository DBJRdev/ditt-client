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

export const getSickDayVariantLabel = (sickDayVariant) => {
  let sickDayVariantLabel = '';

  if (VARIANT_WITH_NOTE === sickDayVariant) {
    sickDayVariantLabel = 'With note';
  } else if (VARIANT_WITHOUT_NOTE === sickDayVariant) {
    sickDayVariantLabel = 'Without note';
  } else if (VARIANT_SICK_CHILD === sickDayVariant) {
    sickDayVariantLabel = 'Sick child';
  } else {
    throw new Error(`Unknown variant ${sickDayVariant}`);
  }

  return sickDayVariantLabel;
};

export const getStatusLabel = (status) => {
  let statusLabel = '';

  if (STATUS_APPROVED === status) {
    statusLabel = 'Approved';
  } else if (STATUS_OPENED === status) {
    statusLabel = 'Opened';
  } else if (STATUS_REJECTED === status) {
    statusLabel = 'Rejected';
  } else if (STATUS_WAITING_FOR_APPROVAL === status) {
    statusLabel = 'Waiting for approval';
  } else {
    throw new Error(`Unknown status ${status}`);
  }

  return statusLabel;
};

export const getTypeLabel = (type) => {
  let typeLabel = '';

  if (BUSINESS_TRIP_WORK_LOG === type) {
    typeLabel = 'Business trip';
  } else if (HOME_OFFICE_WORK_LOG === type) {
    typeLabel = 'Home office';
  } else if (OVERTIME_WORK_LOG === type) {
    typeLabel = 'Overtime';
  } else if (SICK_DAY_WORK_LOG === type) {
    typeLabel = 'Sick day';
  } else if (TIME_OFF_WORK_LOG === type) {
    typeLabel = 'Time off';
  } else if (VACATION_WORK_LOG === type) {
    typeLabel = 'Vacation';
  } else if (WORK_LOG === type) {
    typeLabel = 'Work log';
  } else {
    throw new Error(`Unknown type ${type}`);
  }

  return typeLabel;
};

export const getWorkedTime = (workLogList, workHoursList, workedHoursLimits) => {
  const businessTripWorkLogs = workLogList.filter((
    workLog => workLog.type === BUSINESS_TRIP_WORK_LOG && workLog.status === STATUS_APPROVED
  ));

  const correctWorkedSeconds = (workedSeconds) => {
    if (
      workedSeconds > workedHoursLimits.lowerLimit.limit
      && workedSeconds <= workedHoursLimits.upperLimit.limit
    ) {
      return workedSeconds + workedHoursLimits.lowerLimit.changeBy;
    } else if (workedSeconds > workedHoursLimits.upperLimit.limit) {
      return workedSeconds + workedHoursLimits.upperLimit.changeBy;
    }

    return workedSeconds;
  };

  // Standard work log time
  let workedSeconds = workLogList.reduce((total, workLog) => {
    if (workLog.type === WORK_LOG) {
      const foundBusinessTripWorkLog = businessTripWorkLogs.find((
        businessTripWorkLog => businessTripWorkLog.date.isSame(workLog.startTime, 'day')
      ));

      if (foundBusinessTripWorkLog) {
        return total;
      }

      return (workLog.endTime.diff(workLog.startTime) / 1000) + total;
    }

    return total;
  }, 0);

  workedSeconds = correctWorkedSeconds(workedSeconds);

  // Business trip work log time
  workedSeconds = businessTripWorkLogs.reduce((total, businessTripWorkLog) => {
    const subWorkedSeconds = workLogList.filter((
      workLog => workLog.type === WORK_LOG && workLog.startTime.isSame(businessTripWorkLog.date, 'day')
    )).reduce(
      (subtotal, workLog) => (workLog.endTime.diff(workLog.startTime) / 1000) + subtotal,
      0
    );
    const correctedSubWorkedSeconds = correctWorkedSeconds(subWorkedSeconds);

    const workHours = workHoursList.find((
      workHour => workHour.get('month') === (businessTripWorkLog.date.month() + 1)
    ));
    const requiredHours = workHours.get('requiredHours');
    const requiredSeconds = (requiredHours * 3600) + total;

    return Math.max(correctedSubWorkedSeconds, requiredSeconds);
  }, workedSeconds);

  const specialWorkedSeconds = workLogList.reduce((total, workLog) => {
    if (
      (workLog.type === VACATION_WORK_LOG && workLog.status === STATUS_APPROVED)
      || workLog.type === SICK_DAY_WORK_LOG
    ) {
      const workHours = workHoursList.find((
        workHour => workHour.get('month') === (workLog.date.month() + 1)
      ));
      const requiredHours = workHours.get('requiredHours');

      return (requiredHours * 3600) + total;
    }

    return total;
  }, 0);

  return moment.duration({ seconds: workedSeconds + specialWorkedSeconds });
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

export const getWorkMonthByMonth = (date, workMonthList) => workMonthList.find(workMonth => (
  date.month() + 1 === workMonth.month
  && date.year() === workMonth.year
));
