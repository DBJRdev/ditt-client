import moment from 'moment';
import { getNumberOfWorkingDays } from '../../../services/dateTimeService';
import {
  PARENTAL_LEAVE_WORK_LOG, STATUS_APPROVED,
} from '../../../resources/workMonth';

export const getWorkHoursInfo = (
  daysOfSelectedMonth,
  config,
  selectedDate,
  workMonth,
  workHoursList,
  workMonthList,
) => {
  let requiredHours = 0;
  let requiredHoursSoFar = 0;
  let requiredHoursLeft = 0;
  const workedTime = moment.duration();
  const workedTimeSoFar = moment.duration();

  const workHours = workHoursList.find((item) => (
    item.year === selectedDate.year()
    && item.month === selectedDate.month() + 1
  ));

  if (!workHours) {
    throw new Error('Work hours missing');
  }

  if (!workMonth) {
    throw new Error('Work month missing');
  }

  const workingDays = getNumberOfWorkingDays(
    selectedDate.clone().startOf('month'),
    selectedDate.clone().endOf('month'),
    config.supportedHolidays,
  );
  const workingDaysSoFar = getNumberOfWorkingDays(
    selectedDate.clone().startOf('month'),
    selectedDate.clone().endOf('day'),
    config.supportedHolidays,
  );
  requiredHours = workHours.requiredHours * workingDays;
  requiredHoursSoFar = workHours.requiredHours * workingDaysSoFar;

  daysOfSelectedMonth.forEach((day) => {
    const isParentalLeavePresent = !!day.workLogList.find(
      (workLog) => workLog.type === PARENTAL_LEAVE_WORK_LOG,
    );

    if (isParentalLeavePresent) {
      requiredHours -= workHours.requiredHours;
      if (selectedDate.isSameOrAfter(day.date)) {
        requiredHoursSoFar -= workHours.requiredHours;
      }
    }

    workedTime.add(day.workTime.workTime);
    if (selectedDate.isSameOrAfter(day.date)) {
      workedTimeSoFar.add(day.workTime.workTime);
    }
  });

  workedTime.add(workMonth.workTimeCorrection, 'seconds');
  workedTimeSoFar.add(workMonth.workTimeCorrection, 'seconds');

  if (workMonth.status === STATUS_APPROVED) {
    const apiRequiredHours = workMonth.requiredTime;
    const apiWorkedTime = moment.duration();
    apiWorkedTime.add(workMonth.workedTime * 1000);

    let time = 0;
    workMonthList.forEach((iWorkMonth) => {
      if (
        iWorkMonth.status === STATUS_APPROVED
        && (
          iWorkMonth.year < workMonth.year
          || (
            iWorkMonth.year === workMonth.year
            && iWorkMonth.month <= workMonth.month
          )
        )
        && iWorkMonth.requiredTime != null
        && iWorkMonth.workedTime != null
      ) {
        time += (iWorkMonth.requiredTime - iWorkMonth.workedTime);
      }
    });

    // eslint-disable-next-line no-underscore-dangle
    const areWorkTimesSame = workedTime._milliseconds === apiWorkedTime._milliseconds;

    return {
      areWorkTimesSame,
      requiredHours: apiRequiredHours,
      // eslint-disable-next-line no-underscore-dangle
      requiredHoursLeft: time,
      requiredHoursWithoutLeft: apiRequiredHours,
      toWork: 0,
      workedTime,
    };
  }

  if (workMonth.status !== STATUS_APPROVED) {
    const userYearStats = workMonth.user.yearStats;
    const requiredHoursTotal = userYearStats.reduce(
      (total, userYearStat) => total + userYearStat.requiredHours,
      0,
    );
    const workedHoursTotal = userYearStats.reduce(
      (total, userYearStat) => total + userYearStat.workedHours,
      0,
    );

    requiredHoursLeft = requiredHoursTotal - workedHoursTotal;

    return {
      areWorkTimesSame: true,
      requiredHours: Math.max(0, requiredHours + requiredHoursLeft),
      requiredHoursLeft,
      requiredHoursWithoutLeft: requiredHours,
      // eslint-disable-next-line no-underscore-dangle
      toWork: requiredHoursSoFar - (workedTimeSoFar._milliseconds / 1000) + requiredHoursLeft,
      workedTime,
    };
  }

  return {
    areWorkTimesSame: true,
    requiredHours,
    requiredHoursLeft: 0,
    requiredHoursWithoutLeft: requiredHours,
    // eslint-disable-next-line no-underscore-dangle
    toWork: requiredHoursSoFar - (workedTimeSoFar._milliseconds / 1000) + requiredHoursLeft,
    workedTime,
  };
};
