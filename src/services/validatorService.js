import validator from 'validator';
import {
  BUSINESS_TRIP_WORK_LOG,
  HOME_OFFICE_WORK_LOG,
  OVERTIME_WORK_LOG,
  SICK_DAY_WORK_LOG,
  TIME_OFF_WORK_LOG,
  VACATION_WORK_LOG,
  WORK_LOG,
} from '../resources/workMonth';
import { VARIANT_SICK_CHILD } from '../resources/sickDayWorkLog';
import {
  isOverlapping,
  localizedMoment,
  toMomentDateTimeFromDayMonthYear,
} from './dateTimeService';
import { getWorkHoursValue } from './workHoursService';

export const validateUser = (t, user, userList, supportedWorkHours) => {
  const errors = {
    elements: {
      email: null,
      employeeId: null,
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
    'employeeId',
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
      errors.elements[element] = t('general:validation.required');
      errors.isValid = false;
    }
  });

  supportedWorkHours.forEach((year) => {
    if (!user.workHours[year] || user.workHours[year].length !== 12) {
      errors.elements.workHours[year] = t('user:validation.invalidWorkHours');
      errors.isValid = false;

      return;
    }

    for (let month = 0; month < 12; month += 1) {
      if (Number.isNaN(getWorkHoursValue(user.workHours[year][month]))) {
        const date = localizedMoment().set({ month });

        errors.elements.workHours[year] = t(
          'user:validation.invalidWorkHoursMonth',
          { month: date.format('MMMM') }
        );
        errors.isValid = false;

        break;
      }
    }
  });

  if (!errors.elements.email && !validator.isEmail(user.email)) {
    errors.elements.email = t('general:validation.invalidEmail');
    errors.isValid = false;
  }

  if (!errors.elements.employeeId
    && !(user.employeeId.length >= 1 && user.employeeId.length <= 200)
  ) {
    errors.elements.employeeId = t(
      'general:validation.invalidLength',
      {
        max: 200,
        min: 2,
      }
    );
    errors.isValid = false;
  }

  if (!errors.elements.firstName && !(user.firstName.length >= 2 && user.firstName.length <= 200)) {
    errors.elements.firstName = t(
      'general:validation.invalidLength',
      {
        max: 200,
        min: 2,
      }
    );
    errors.isValid = false;
  }

  if (!errors.elements.lastName && !(user.lastName.length >= 2 && user.lastName.length <= 200)) {
    errors.elements.lastName = t(
      'general:validation.invalidLength',
      {
        max: 200,
        min: 2,
      }
    );
    errors.isValid = false;
  }

  if (!errors.elements.plainPassword && user.plainPassword && user.plainPassword.length < 8) {
    errors.elements.plainPassword = t('general:validation.invalidMinLength', { min: 8 });
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
      errors.elements.email = t('general:validation.notUniqueEmail');
      errors.isValid = false;
    }
  }

  if (!errors.elements.vacationDays && !validator.isNumeric(user.vacationDays.toString())) {
    errors.elements.vacationDays = t('general:validation.invalidNumber');
    errors.isValid = false;
  }

  if (!errors.elements.vacationDays && user.vacationDays < 0) {
    errors.elements.vacationDays = t('general:validation.invalidMinValue', { min: 8 });
    errors.isValid = false;
  }

  return errors;
};

export const validateWorkLog = (t, workLogAttr, workLogsOfDay) => {
  const errors = {
    elements: {
      comment: null,
      destination: null,
      endHour: null,
      endMinute: null,
      expectedArrival: null,
      expectedDeparture: null,
      form: null,
      purpose: null,
      startHour: null,
      startMinute: null,
      transport: null,
      type: null,
      variant: null,
    },
    isValid: true,
  };

  const workLog = workLogAttr;

  if ([
    BUSINESS_TRIP_WORK_LOG,
    HOME_OFFICE_WORK_LOG,
    OVERTIME_WORK_LOG,
    SICK_DAY_WORK_LOG,
    TIME_OFF_WORK_LOG,
    VACATION_WORK_LOG,
    WORK_LOG,
  ].indexOf(workLog.type) === -1) {
    errors.elements.type = t('workLog:validation.invalidType');
    errors.isValid = false;

    return errors;
  }

  if (workLog.type === BUSINESS_TRIP_WORK_LOG) {
    const emptyCheck = [
      'destination',
      'expectedArrival',
      'expectedDeparture',
      'purpose',
      'transport',
    ];

    emptyCheck.forEach((element) => {
      if (
        workLog[element] === null
        || validator.isEmpty(workLog[element])
      ) {
        errors.elements[element] = t('general:validation.required');
        errors.isValid = false;
      }
    });

    return errors;
  }

  if (workLog.type === HOME_OFFICE_WORK_LOG || workLog.type === TIME_OFF_WORK_LOG) {
    if (workLog.comment === null || validator.isEmpty(workLog.comment)) {
      errors.elements.comment = t('general:validation.required');
      errors.isValid = false;
    }

    return errors;
  }

  if (workLog.type === OVERTIME_WORK_LOG) {
    if (workLog.reason === null || validator.isEmpty(workLog.reason)) {
      errors.elements.reason = t('general:validation.required');
      errors.isValid = false;
    }

    return errors;
  }

  if (workLog.type === SICK_DAY_WORK_LOG && workLog.variant === VARIANT_SICK_CHILD) {
    if (workLog.childName === null || validator.isEmpty(workLog.childName)) {
      errors.elements.childName = t('general:validation.required');
      errors.isValid = false;
    }

    if (workLog.childDateOfBirth === null || validator.isEmpty(workLog.childDateOfBirth)) {
      errors.elements.childDateOfBirth = t('general:validation.required');
      errors.isValid = false;
    }

    if (!errors.elements.childDateOfBirth) {
      try {
        toMomentDateTimeFromDayMonthYear(workLog.childDateOfBirth);
      } catch (ex) {
        errors.elements.childDateOfBirth = t('general:validation.invalidDate');
        errors.isValid = false;
      }
    }

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
      errors.elements[element] = t('general:validation.invalidNumber');
      errors.isValid = false;
    }

    workLog[element] = parseInt(workLog[element], 10);
  });

  if (!errors.isValid) {
    return errors;
  }

  hourCheck.forEach((element) => {
    if (workLog[element] < 0 || workLog[element] > 23) {
      errors.elements[element] = t('workLog:validation.invalidHour');
      errors.isValid = false;
    }
  });

  minuteCheck.forEach((element) => {
    if (workLog[element] < 0 || workLog[element] > 59) {
      errors.elements[element] = t('workLog:validation.invalidMinute');
      errors.isValid = false;
    }
  });

  if (!errors.isValid) {
    return errors;
  }

  if (
    (workLog.startHour * 60) + workLog.startMinute >= (workLog.endHour * 60) + workLog.endMinute
  ) {
    errors.elements.endHour = t('workLog:validation.invalidHour');
    errors.elements.endMinute = t('workLog:validation.invalidMinute');
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
      errors.elements.form = t('workLog:validation.workLogOverlaps');
      errors.isValid = false;
    }
  }

  return errors;
};

export const validateRejectWorkLog = (t, rejectWorkLog) => {
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
    errors.elements.rejectionMessage = t('general:validation.required');
    errors.isValid = false;
  }

  return errors;
};
