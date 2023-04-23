import moment from 'moment';
import {
  PARENTAL_LEAVE_WORK_LOG, STATUS_APPROVED,
} from '../../../resources/workMonth';
import {
  getContractInfoOfSpecificDate,
} from '../../../services/contractService/getContractInfoOfSpecificDate';
import { getContractsOfSelectedMonth } from './getContractsOfSelectedMonth';

export const getWorkHoursInfo = (
  daysOfSelectedMonth,
  config,
  selectedDate,
  workMonth,
  contracts,
  workMonthList,
) => {
  if (!workMonth) {
    throw new Error('Work month missing');
  }

  const workMonthContracts = getContractsOfSelectedMonth(contracts, workMonth);

  let requiredHours = 0;
  let requiredHoursSoFar = 0;
  let requiredHoursLeft = 0;
  const workedTime = moment.duration();
  const workedTimeSoFar = moment.duration();

  daysOfSelectedMonth.forEach((day) => {
    workedTime.add(day.workTime.workTime);
    if (selectedDate.isSameOrAfter(day.date)) {
      workedTimeSoFar.add(day.workTime.workTime);
    }

    const isParentalLeavePresent = !!day.workLogList.find(
      (workLog) => workLog.type === PARENTAL_LEAVE_WORK_LOG,
    );

    const foundContract = getContractInfoOfSpecificDate(day.date, workMonthContracts, config.supportedHolidays);

    if (isParentalLeavePresent) {
      return;
    }

    requiredHours += foundContract.dailyWorkingTime;
    if (selectedDate.isSameOrAfter(day.date)) {
      requiredHoursSoFar += foundContract.dailyWorkingTime;
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
