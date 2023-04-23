import { generate } from 'shortid';
import { toMomentDateTime } from '../../services/dateTimeService';

export const transformContract = (data) => ({
  ...data,
  _id: data.id ? data.id.toString() : generate(),
  endDateTime: data.endDateTime
    ? toMomentDateTime(data.endDateTime)
    : null,
  id: parseInt(data.id, 10),
  startDateTime: data.startDateTime ? toMomentDateTime(data.startDateTime) : null,
  weeklyWorkingDays: parseInt(data.weeklyWorkingDays, 10),
  weeklyWorkingHours: parseFloat(data.weeklyWorkingHours),
});
