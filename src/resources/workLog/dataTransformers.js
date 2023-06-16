import { toMomentDateTime } from '../../services/dateTimeService';

export const transformWorkLog = (data) => ({
  endTime: toMomentDateTime(data.endTime),
  id: parseInt(data.id, 10),
  isHomeOffice: data.isHomeOffice,
  startTime: toMomentDateTime(data.startTime),
});
