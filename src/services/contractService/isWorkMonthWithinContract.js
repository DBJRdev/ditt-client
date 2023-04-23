import { createDate } from '../dateTimeService';

export const isWorkMonthWithinContract = (workMonth, contract) => {
  const workMonthStartDateTime = createDate(workMonth.year, workMonth.month - 1, 1);
  const workMonthEndDateTime = createDate(workMonth.year, workMonth.month - 1, 1).endOf('month');

  if (contract.endDateTime == null) {
    return contract.startDateTime.isSameOrBefore(workMonthEndDateTime, 'month');
  }

  return contract.startDateTime.isSameOrBefore(workMonthStartDateTime, 'month')
    && contract.endDateTime.isSameOrAfter(workMonthEndDateTime, 'month');
};
