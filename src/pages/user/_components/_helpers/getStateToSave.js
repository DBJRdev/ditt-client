import { toMomentDateTimeFromStandardDayMonthYear } from '../../../../services/dateTimeService';
import { getWorkHoursValue } from '../../../../services/workHoursService';

export const getStateToSave = (formData) => ({
  ...formData,
  endDateTime: formData.endDateTime
    ? toMomentDateTimeFromStandardDayMonthYear(formData.endDateTime)
      .set('hour', 23)
      .set('minute', 59)
      .set('second', 59)
    : null,
  startDateTime: toMomentDateTimeFromStandardDayMonthYear(formData.startDateTime)
    .set('hour', 0)
    .set('minute', 0)
    .set('second', 0),
  weeklyWorkingDays: parseInt(formData.weeklyWorkingDays, 10),
  weeklyWorkingHours: parseFloat(getWorkHoursValue(formData.weeklyWorkingHours) / 3600),
});