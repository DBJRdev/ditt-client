import {
  localizedMoment,
  toDayMonthYearFormat,
  toMomentDateTime,
} from '../../../services/dateTimeService';
import { WORK_LOG } from '../../../resources/workMonth';
import { VARIANT_WITH_NOTE } from '../../../resources/sickDayWorkLog';
import { getWorkLogTimer } from '../../../services/storageService';

export const getInitialState = (data, date, isWorkLogTimerDisplayed) => {
  let dateClone = date.clone();
  let startTime = dateClone.clone().subtract(3, 'minutes');
  let endTime = dateClone.clone().add(3, 'minutes');

  if (data && data.date) {
    dateClone = data.date;
    startTime = data.date;
    endTime = data.date;
  } else if (data && data.startTime) {
    dateClone = data.startTime;
    startTime = data.startTime;
    endTime = data.endTime;
  } else if (isWorkLogTimerDisplayed && getWorkLogTimer()) {
    dateClone = toMomentDateTime(getWorkLogTimer());
    startTime = toMomentDateTime(getWorkLogTimer());
    endTime = localizedMoment();
  }

  return {
    formData: {
      childDateOfBirth: (data && data.childDateOfBirth)
        ? toDayMonthYearFormat(data.childDateOfBirth)
        : null,
      childName: (data && data.childName) || null,
      comment: (data && data.comment) || null,
      date: toDayMonthYearFormat(dateClone),
      dateTo: toDayMonthYearFormat(dateClone),
      destination: (data && data.destination) || null,
      endHour: endTime.format('HH'),
      endMinute: endTime.format('mm'),
      expectedArrival: (data && data.expectedArrival) || null,
      expectedDeparture: (data && data.expectedDeparture) || null,
      id: (data && data.id) || null,
      purpose: (data && data.purpose) || null,
      reason: (data && data.reason) || null,
      startHour: startTime.format('HH'),
      startMinute: startTime.format('mm'),
      transport: (data && data.transport) || null,
      type: (data && data.type) || WORK_LOG,
      variant: (data && data.variant) || VARIANT_WITH_NOTE,
    },
    formValidity: {
      elements: {
        childDateOfBirth: null,
        childName: null,
        comment: null,
        dateTo: null,
        destination: null,
        endHour: null,
        endMinute: null,
        expectedArrival: null,
        expectedDeparture: null,
        form: null,
        purpose: null,
        reason: null,
        startHour: null,
        startMinute: null,
        transport: null,
        type: null,
      },
      isValid: false,
    },
  };
};
