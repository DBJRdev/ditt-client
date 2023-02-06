import { toMomentDateTime } from '../../services/dateTimeService';

export const transformParentalProtectionWorkLog = (data) => ({
  date: toMomentDateTime(data.date),
  id: parseInt(data.id, 10),
});
