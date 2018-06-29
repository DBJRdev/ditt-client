import moment from 'moment';
import parameters from '../../config/parameters';
import {
  STATUS_APPROVED,
  VACATION_WORK_LOG,
  WORK_LOG,
} from '../resources/workMonth';
import { getNumberOfWorkingDays } from './dateTimeService';

export const getWorkedTime = (workLogList, workHoursList) => {
  const workedHoursLimits = parameters.get('workedHoursLimits').toJS();

  const workedSeconds = workLogList.reduce((total, workLog) => {
    if (workLog.type === VACATION_WORK_LOG && workLog.status === STATUS_APPROVED) {
      const workHours = workHoursList.find((
        workHour => workHour.get('month') === (workLog.date.month() + 1)
      ));
      const requiredHours = workHours.get('requiredHours');
      const workingDays = getNumberOfWorkingDays(
        workLog.date.clone().startOf('month'),
        workLog.date.clone().endOf('month'),
        parameters.get('supportedHolidays')
      );

      return ((requiredHours / workingDays) * 3600) + total;
    }

    if (workLog.type === WORK_LOG) {
      return (workLog.endTime.diff(workLog.startTime) / 1000) + total;
    }

    return total;
  }, 0);

  let workedTime = null;

  if (
    workedSeconds >= workedHoursLimits.lowerLimit.limit
    && workedSeconds <= workedHoursLimits.upperLimit.limit
  ) {
    workedTime = moment.duration({
      seconds: workedSeconds + workedHoursLimits.lowerLimit.changeBy,
    });
  } else if (workedSeconds > workedHoursLimits.upperLimit.limit) {
    workedTime = moment.duration({
      seconds: workedSeconds + workedHoursLimits.upperLimit.changeBy,
    });
  } else {
    workedTime = moment.duration({ seconds: workedSeconds });
  }

  return workedTime;
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
