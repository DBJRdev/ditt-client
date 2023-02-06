import { toMomentDateTime } from '../../services/dateTimeService';

export const transformMaternityProtectionWorkLog = (data) => ({
  date: toMomentDateTime(data.date),
  id: parseInt(data.id, 10),
});
