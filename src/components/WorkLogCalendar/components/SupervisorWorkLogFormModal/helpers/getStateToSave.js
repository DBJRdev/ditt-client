import { toMomentDateTimeFromDayMonthYear } from '../../../../../services/dateTimeService';

export const getStateToSave = (formData, workMonth) => {
  const workTimeLimit = (parseInt(formData.hour, 10) * 3600)
    + (parseInt(formData.minute, 10) * 60);

  return {
    date: toMomentDateTimeFromDayMonthYear(formData.date),
    dateTo: toMomentDateTimeFromDayMonthYear(formData.dateTo),
    id: formData.id || null,
    type: formData.type,
    user: {
      id: workMonth.user.id,
    },
    workTimeLimit,
  };
};
