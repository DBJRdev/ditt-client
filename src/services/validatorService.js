import validator from 'validator';
import {
  BUSINESS_TRIP_WORK_LOG,
  HOME_OFFICE_WORK_LOG,
  TIME_OFF_WORK_LOG,
  WORK_LOG,
} from '../resources/workMonth';
import {
  isOverlapping,
  localizedMoment,
} from './dateTimeService';

export const validateUser = (user, userList, supportedWorkHours) => {
  const errors = {
    elements: {
      email: null,
      firstName: null,
      form: null,
      isActive: null,
      lastName: null,
      plainPassword: null,
      supervisor: null,
      vacationDays: null,
      workHours: {},
    },
    isValid: true,
  };

  const emptyCheck = [
    'firstName',
    'lastName',
    'email',
    'isActive',
    'vacationDays',
  ];

  if (!user.id) {
    emptyCheck.push('plainPassword');
  }

  emptyCheck.forEach((element) => {
    if (
      user[element] === null
      || validator.isEmpty(user[element].toString())
    ) {
      errors.elements[element] = 'This field is required.';
      errors.isValid = false;
    }
  });

  supportedWorkHours.forEach((year) => {
    if (!user.workHours[year] || user.workHours[year].length !== 12) {
      errors.elements.workHours[year] = 'This field requires 12 values separated by comma.';
      errors.isValid = false;

      return;
    }

    for (let month = 0; month < 12; month += 1) {
      if (Number.isNaN(user.workHours[year][month])) {
        const date = localizedMoment().set({ month });

        errors.elements.workHours[year] = `Value for ${date.format('MMMM')} is not a number.`;
        errors.isValid = false;

        break;
      }
    }
  });

  if (!errors.elements.email && !validator.isEmail(user.email)) {
    errors.elements.email = 'It is not a valid e-mail address.';
    errors.isValid = false;
  }

  if (!errors.elements.firstName && !(user.firstName.length >= 2 && user.firstName.length <= 200)) {
    errors.elements.firstName = 'It must be long between 2 and 200 characters.';
    errors.isValid = false;
  }

  if (!errors.elements.lastName && !(user.lastName.length >= 2 && user.lastName.length <= 200)) {
    errors.elements.lastName = 'It must be long between 2 and 200 characters.';
    errors.isValid = false;
  }

  if (!errors.elements.plainPassword && user.plainPassword && user.plainPassword.length < 8) {
    errors.elements.plainPassword = 'It must be at least 8 characters long.';
    errors.isValid = false;
  }

  if (!errors.elements.email && userList.length > 0) {
    let isUnique = true;

    userList.forEach((existingUser) => {
      if (user.id !== existingUser.id && user.email === existingUser.email) {
        isUnique = false;
      }
    });

    if (!isUnique) {
      errors.elements.email = 'This e-mail has been already registered.';
      errors.isValid = false;
    }
  }

  if (!errors.elements.vacationDays && !validator.isNumeric(user.vacationDays.toString())) {
    errors.elements.vacationDays = 'Not a number.';
    errors.isValid = false;
  }

  if (!errors.elements.vacationDays && user.vacationDays < 0) {
    errors.elements.vacationDays = 'It must be at least 0.';
    errors.isValid = false;
  }

  return errors;
};

export const validateWorkLog = (workLog, workLogsOfDay) => {
  const errors = {
    elements: {
      endHour: null,
      endMinute: null,
      form: null,
      startHour: null,
      startMinute: null,
      type: null,
    },
    isValid: true,
  };

  if ([
    BUSINESS_TRIP_WORK_LOG,
    HOME_OFFICE_WORK_LOG,
    TIME_OFF_WORK_LOG,
    WORK_LOG,
  ].indexOf(workLog.type) === -1) {
    errors.elements.type = 'Invalid type.';
    errors.isValid = false;

    return errors;
  }

  if (workLog.type !== WORK_LOG) {
    return errors;
  }

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

export const validateRejectWorkLog = (rejectWorkLog) => {
  const errors = {
    elements: {
      form: null,
      rejectionMessage: null,
    },
    isValid: true,
  };

  if (
    rejectWorkLog.rejectionMessage === null
    || validator.isEmpty(rejectWorkLog.rejectionMessage)
  ) {
    errors.elements.rejectionMessage = 'This field is required.';
    errors.isValid = false;
  }

  return errors;
};
