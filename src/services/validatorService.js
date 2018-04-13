import validator from 'validator';
import { isOverlapping } from './dateTimeService';

const validateWorkLog = (workLog, workLogsOfDay) => {
  const errors = {
    elements: {
      endHour: null,
      endMinute: null,
      form: null,
      startHour: null,
      startMinute: null,
    },
    isValid: true,
  };

  const hourCheck = [
    'endHour',
    'startHour',
  ];

  const minuteCheck = [
    'endMinute',
    'startMinute',
  ];

  [...hourCheck, ...minuteCheck].forEach((element) => {
    if (
      workLog[element] === null
      || validator.isEmpty(workLog[element].toString())
      || !validator.isNumeric(workLog[element].toString())
    ) {
      errors.elements[element] = 'Not a number.';
      errors.isValid = false;
    }
  });

  if (!errors.isValid) {
    return errors;
  }

  hourCheck.forEach((element) => {
    if (workLog[element] < 0 || workLog[element] > 23) {
      errors.elements[element] = 'Invalid hour.';
      errors.isValid = false;
    }
  });

  minuteCheck.forEach((element) => {
    if (workLog[element] < 0 || workLog[element] > 59) {
      errors.elements[element] = 'Invalid minute.';
      errors.isValid = false;
    }
  });

  if (!errors.isValid) {
    return errors;
  }

  if (
    (workLog.startHour * 60) + workLog.startMinute >= (workLog.endHour * 60) + workLog.endMinute
  ) {
    errors.elements.endHour = 'Invalid hour';
    errors.elements.endMinute = 'Invalid minute';
    errors.isValid = false;
  }

  if (!errors.isValid) {
    return errors;
  }

  if (workLogsOfDay.length > 0) {
    let overlapping = false;
    const todayDate = workLogsOfDay[0].startTime;
    const startTime = todayDate.clone().hour(workLog.startHour).minute(workLog.startMinute);
    const endTime = todayDate.clone().hour(workLog.endHour).minute(workLog.endMinute);

    workLogsOfDay.forEach((workLogItem) => {
      if (isOverlapping(startTime, endTime, workLogItem.startTime, workLogItem.endTime)) {
        overlapping = true;
      }
    });

    if (overlapping) {
      errors.elements.form = 'Entered worklog overlaps existing one.';
      errors.isValid = false;
    }
  }

  return errors;
};

export default validateWorkLog;
