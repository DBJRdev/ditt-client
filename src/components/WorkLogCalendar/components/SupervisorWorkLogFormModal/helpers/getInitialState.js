import { SICK_DAY_UNPAID_WORK_LOG } from '../../../../../resources/workMonth';
import { toDayMonthYearFormat } from '../../../../../services/dateTimeService';

export const getInitialState = (data, date) => ({
  formData: {
    date: (data && data.date)
      ? toDayMonthYearFormat(data.date)
      : toDayMonthYearFormat(date),
    dateTo: (data && data.date)
      ? toDayMonthYearFormat(data.date)
      : toDayMonthYearFormat(date),
    hour: (data && data.workTimeLimit)
      ? Math.floor(data.workTimeLimit / 3600).toString()
      : '0',
    id: (data && data.id) || null,
    minute: (data && data.workTimeLimit)
      ? Math.floor((data.workTimeLimit % 3600) / 60).toString()
      : '00',
    type: (data && data.type) || SICK_DAY_UNPAID_WORK_LOG,
  },
  formValidity: {
    elements: {
      date: null,
      dateTo: null,
      form: null,
      hour: null,
      minute: null,
      type: null,
    },
    isValid: false,
  },
});
