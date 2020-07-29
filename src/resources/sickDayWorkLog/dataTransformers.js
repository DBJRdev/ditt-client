import { toMomentDateTime } from '../../services/dateTimeService';

export const transformSickDayWorkLog = (data) => ({
  childDateOfBirth: data.childDateOfBirth ? toMomentDateTime(data.childDateOfBirth) : null,
  childName: data.childName,
  date: toMomentDateTime(data.date),
  id: parseInt(data.id, 10),
  variant: data.variant,
});
