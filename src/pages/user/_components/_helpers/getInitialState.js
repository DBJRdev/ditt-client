import { generate } from 'shortid';
import { toStandardDayMonthYearFormat } from '../../../../services/dateTimeService';
import { getWorkHoursString } from '../../../../services/workHoursService';

export const getInitialState = (data) => ({
  formData: {
    // eslint-disable-next-line no-underscore-dangle
    _id: (data && data._id) || generate(),
    endDateTime: (data && data.endDateTime)
      ? toStandardDayMonthYearFormat(data.endDateTime)
      : null,
    id: (data && data.id) || null,
    isDayBased: (data && data.isDayBased) ?? true,
    isFridayIncluded: (data && data.isFridayIncluded) ?? true,
    isMondayIncluded: (data && data.isMondayIncluded) ?? true,
    isThursdayIncluded: (data && data.isThursdayIncluded) ?? true,
    isTuesdayIncluded: (data && data.isTuesdayIncluded) ?? true,
    isWednesdayIncluded: (data && data.isWednesdayIncluded) ?? true,
    startDateTime: (data && data.startDateTime)
      ? toStandardDayMonthYearFormat(data.startDateTime)
      : null,
    user: null,
    weeklyWorkingDays: (data && data.weeklyWorkingDays) ?? 5,
    weeklyWorkingHours: getWorkHoursString(((data && data.weeklyWorkingHours) ?? 0) * 3600),
  },
  formValidity: {
    elements: {
      endDateTime: null,
      id: null,
      isDayBased: null,
      isFridayIncluded: null,
      isMondayIncluded: null,
      isThursdayIncluded: null,
      isTuesdayIncluded: null,
      isWednesdayIncluded: null,
      startDateTime: null,
      user: null,
      weeklyWorkingDays: null,
      weeklyWorkingHours: null,
    },
    isValid: false,
  },
});
