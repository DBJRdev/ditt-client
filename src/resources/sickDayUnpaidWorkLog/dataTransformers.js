import { toMomentDateTime } from '../../services/dateTimeService';

export const transformSickDayUnpaidWorkLog = (data) => ({
  date: toMomentDateTime(data.date),
  id: parseInt(data.id, 10),
});
