import { isWorkingDay } from '../dateTimeService';

export const getContractInfoOfSpecificDate = (currentDate, contracts, supportedHolidays) => {
  const foundContract = contracts.find((contract) => {
    if (contract.endDateTime == null) {
      return contract.startDateTime.isSameOrBefore(currentDate, 'day');
    }

    return contract.startDateTime.isSameOrBefore(currentDate, 'day')
      && contract.endDateTime.isSameOrAfter(currentDate, 'day');
  });

  if (foundContract == null) {
    return {
      contract: null,
      dailyWorkingTime: 0,
      dailyWorkingTimeRaw: 0,
      isDayWithinContractRange: false,
      isDayWorking: false,
    };
  }

  if (!isWorkingDay(currentDate, supportedHolidays)) {
    return {
      contract: foundContract,
      dailyWorkingTime: 0,
      dailyWorkingTimeRaw: (foundContract.weeklyWorkingHours / foundContract.weeklyWorkingDays) * 3600,
      isDayWithinContractRange: true,
      isDayWorking: false,
    };
  }

  if (!foundContract.isDayBased) {
    const weekStart = currentDate.clone().startOf('week');
    const weekEnd = currentDate.clone().endOf('week');
    let workingDaysBeforeCurrentDay = 0;

    for (
      let currentDayOfWeek = weekStart.clone();
      currentDayOfWeek.isBefore(currentDate, 'day') && currentDayOfWeek.isSameOrBefore(weekEnd, 'day');
      currentDayOfWeek.add(1, 'day')
    ) {
      if (isWorkingDay(currentDayOfWeek, supportedHolidays)) {
        workingDaysBeforeCurrentDay += 1;
      }
    }

    if (workingDaysBeforeCurrentDay >= foundContract.weeklyWorkingDays) {
      return {
        contract: foundContract,
        dailyWorkingTime: 0,
        dailyWorkingTimeRaw: (foundContract.weeklyWorkingHours / foundContract.weeklyWorkingDays) * 3600,
        isDayWithinContractRange: true,
        isDayWorking: false,
      };
    }
  }

  const dayOfWeek = currentDate.day();
  if (
    foundContract.isDayBased
    && (
      (dayOfWeek === 1 && !foundContract.isMondayIncluded)
      || (dayOfWeek === 2 && !foundContract.isTuesdayIncluded)
      || (dayOfWeek === 3 && !foundContract.isWednesdayIncluded)
      || (dayOfWeek === 4 && !foundContract.isThursdayIncluded)
      || (dayOfWeek === 5 && !foundContract.isFridayIncluded)
    )
  ) {
    return {
      contract: foundContract,
      dailyWorkingTime: 0,
      dailyWorkingTimeRaw: (foundContract.weeklyWorkingHours / foundContract.weeklyWorkingDays) * 3600,
      isDayWithinContractRange: true,
      isDayWorking: false,
    };
  }

  return {
    contract: foundContract,
    dailyWorkingTime: (foundContract.weeklyWorkingHours / foundContract.weeklyWorkingDays) * 3600,
    dailyWorkingTimeRaw: (foundContract.weeklyWorkingHours / foundContract.weeklyWorkingDays) * 3600,
    isDayWithinContractRange: true,
    isDayWorking: true,
  };
};
