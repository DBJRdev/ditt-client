import { toMomentDateTime } from '../../services/dateTimeService';

export const transformBanWorkLog = (data) => ({
  date: toMomentDateTime(data.date),
  id: parseInt(data.id, 10),
  workTimeLimit: parseInt(data.id, 10),
});
