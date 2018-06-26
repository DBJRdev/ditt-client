import moment from 'moment';
import parameters from '../../config/parameters';
import { WORK_LOG } from '../resources/workMonth';

export const getWorkedTime = (workLogList) => {
  const workedHoursLimits = parameters.get('workedHoursLimits').toJS();

  const workedSeconds = workLogList.reduce((total, workLog) => {
    if (workLog.type !== WORK_LOG) {
      return total;
    }

    return (workLog.endTime.diff(workLog.startTime) / 1000) + total;
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
