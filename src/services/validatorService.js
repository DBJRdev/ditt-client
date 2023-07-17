import isEmail from 'validator/lib/isEmail';
import isEmpty from 'validator/lib/isEmpty';
import isNumeric from 'validator/lib/isNumeric';
import {
  BAN_WORK_LOG,
  BUSINESS_TRIP_WORK_LOG,
  HOME_OFFICE_WORK_LOG,
  MATERNITY_PROTECTION_WORK_LOG,
  OVERTIME_WORK_LOG,
  PARENTAL_LEAVE_WORK_LOG,
  SICK_DAY_UNPAID_WORK_LOG,
  SICK_DAY_WORK_LOG,
  SPECIAL_LEAVE_WORK_LOG,
  STATUS_OPENED,
  TIME_OFF_WORK_LOG,
  TRAINING_WORK_LOG,
  VACATION_WORK_LOG,
  WORK_LOG,
} from '../resources/workMonth';
import { VARIANT_SICK_CHILD } from '../resources/sickDayWorkLog';
import {
  getWorkingDays,
  isOverlapping,
  localizedMoment,
  toMomentDateTimeFromDayMonth,
  toMomentDateTimeFromDayMonthYear,
  toMomentDateTimeFromStandardDayMonthYear,
} from './dateTimeService';

export const validateContract = (t, dataAttr) => {
  const data = { ...dataAttr };

  const errors = {
    elements: {
      endDateTime: null,
      startDateTime: null,
      weeklyWorkingDays: null,
      weeklyWorkingHours: null,
    },
    isValid: true,
  };

  let dateFrom = null;
  let dateTo = null;
  let weeklyWorkingDays = null;

  if (data.startDateTime === null || isEmpty(data.startDateTime)) {
    errors.elements.startDateTime = t('general:validation.required');
    errors.isValid = false;
  }

  if (data.weeklyWorkingDays === null || isEmpty(data.weeklyWorkingDays.toString())) {
    errors.elements.weeklyWorkingDays = t('general:validation.required');
    errors.isValid = false;
  } else if (!isNumeric(data.weeklyWorkingDays.toString())) {
    errors.elements.weeklyWorkingDays = t('general:validation.invalidNumber');
    errors.isValid = false;
  } else {
    weeklyWorkingDays = parseInt(data.weeklyWorkingDays, 10);
  }

  if (data.weeklyWorkingHours === null || isEmpty(data.weeklyWorkingHours)) {
    errors.elements.weeklyWorkingHours = t('general:validation.required');
    errors.isValid = false;
  }

  if (!errors.isValid) {
    return errors;
  }

  try {
    dateFrom = toMomentDateTimeFromStandardDayMonthYear(data.startDateTime);
  } catch (ex) {
    errors.elements.startDateTime = t('general:validation.invalidDate');
    errors.isValid = false;
  }

  if (data.endDateTime !== null && !isEmpty(data.endDateTime)) {
    try {
      dateTo = toMomentDateTimeFromStandardDayMonthYear(data.endDateTime);
    } catch (ex) {
      errors.elements.endDateTime = t('general:validation.invalidDate');
      errors.isValid = false;
    }

    if (!errors.isValid) {
      return errors;
    }

    if (dateTo?.isBefore(dateFrom, 'day')) {
      errors.elements.endDateTime = t('general:validation.invalidDate');
      errors.isValid = false;
    }
  }

  if (weeklyWorkingDays < 0 || weeklyWorkingDays > 5) {
    errors.elements.weeklyWorkingDays = t('user:validation.weeklyWorkingDaysInvalid');
    errors.isValid = false;
  }

  const timeRegex = /^([0-9]{1,3}):[0-5][0-9]$/;

  if (
    !timeRegex.test(data.weeklyWorkingHours)
    || parseInt(data.weeklyWorkingHours.split(':')[0], 10) >= 168
  ) {
    errors.elements.weeklyWorkingHours = t('user:validation.weeklyWorkingHoursInvalid');
    errors.isValid = false;
  }

  return errors;
};

export const validateContractTermination = (t, dataAttr, contract, workMonths) => {
  const data = { ...dataAttr };

  const errors = {
    elements: {
      dateTime: null,
    },
    isValid: true,
  };

  let dateTime = null;

  if (data.dateTime === null || isEmpty(data.dateTime)) {
    errors.elements.dateTime = t('general:validation.required');
    errors.isValid = false;
    return errors;
  }

  try {
    dateTime = toMomentDateTimeFromStandardDayMonthYear(data.dateTime);
  } catch (ex) {
    errors.elements.dateTime = t('general:validation.invalidDate');
    errors.isValid = false;
    return errors;
  }

  if (
    dateTime.isBefore(contract.startDateTime, 'day')
    || (contract.endDateTime !== null && dateTime.isAfter(contract.endDateTime, 'day'))
  ) {
    errors.elements.dateTime = t('user:validation.outOfContractRange');
    errors.isValid = false;
    return errors;
  }

  const filteredWorkMonths = workMonths.filter((workMonth) => workMonth.status !== STATUS_OPENED);
  const dateFrom = dateTime;
  const dateTo = contract.endDateTime;

  const yearFrom = dateFrom.year();
  const monthFrom = dateFrom.month() + 1;

  if (dateTo == null) {
    const filteredWorkMonths2 = filteredWorkMonths.filter((workMonth) => (
      (workMonth.year > yearFrom
        || (workMonth.year === yearFrom && workMonth.month >= monthFrom))
    ));

    if (filteredWorkMonths2.length > 0) {
      errors.elements.dateTime = t('user:validation.cannotTerminateContract');
      errors.isValid = false;
    }
  } else {
    const yearTo = dateTo.year();
    const monthTo = dateTo.month() + 1;

    const filteredWorkMonths3 = filteredWorkMonths.filter((workMonth) => (
      (
        (workMonth.year > yearFrom)
        || (workMonth.year === yearFrom && workMonth.month >= monthFrom)
      )
      && (
        (workMonth.year < yearTo)
        || (workMonth.year === yearTo && workMonth.month <= monthTo)
      )
    ));

    if (filteredWorkMonths3.length > 0) {
      errors.elements.dateTime = t('user:validation.cannotTerminateContract');
      errors.isValid = false;
    }
  }

  return errors;
};

export const validateContracts = (contracts) => {
  if (contracts.length < 2) {
    return true;
  }

  let contractsWithoutEndDate = 0;

  for (let i = 0; i < contracts.length; i += 1) {
    if (contracts[i].endDateTime === null) {
      contractsWithoutEndDate += 1;
    }
  }

  if (contractsWithoutEndDate > 1) {
    return false;
  }

  for (let i = 0; i < contracts.length; i += 1) {
    for (let j = 0; j < contracts.length; j += 1) {
      if (i === j) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (contracts[i].endDateTime === null) {
        if (contracts[j].endDateTime === null) {
          return false;
        }
        if (contracts[j].endDateTime >= contracts[i].startDateTime) {
          return false;
        }
      } else if (contracts[j].endDateTime === null) {
        if (contracts[i].endDateTime >= contracts[j].startDateTime) {
          return false;
        }
      } else if (
        contracts[i].endDateTime >= contracts[j].startDateTime
        && contracts[j].endDateTime >= contracts[i].startDateTime
      ) {
        return false;
      }
    }
  }

  return true;
};

export const validateSupportedYear = (t, supportedYear, supportedYears, isNew) => {
  const errors = {
    elements: {
      holidays: null,
      year: null,
    },
    isValid: true,
  };

  if (
    supportedYear.year === null
    || isEmpty(supportedYear.year.toString())
  ) {
    errors.elements.year = t('general:validation.required');
    errors.isValid = false;
  }

  if (supportedYear.holidays !== null) {
    supportedYear.holidays.split('\n').forEach((line) => {
      if (line.trim() === '') {
        return;
      }

      try {
        toMomentDateTimeFromDayMonth(line);
      } catch (ex) {
        errors.elements.holidays = t('general:validation.invalidDate');
        errors.isValid = false;
      }
    });
  }

  if (!errors.isValid) {
    return errors;
  }

  if (!isNumeric(supportedYear.year.toString())) {
    errors.elements.year = t('general:validation.invalidNumber');
    errors.isValid = false;
  }

  if (!errors.isValid) {
    return errors;
  }

  if (isNew && supportedYears.includes(parseInt(supportedYear.year, 10))) {
    errors.elements.year = t('config:validation.notUniqueYear');
    errors.isValid = false;
  }

  return errors;
};

export const validateUser = (t, user, userList, supportedYears) => {
  const errors = {
    elements: {
      contracts: null,
      email: null,
      employeeId: null,
      firstName: null,
      form: null,
      isActive: null,
      lastName: null,
      plainPassword: null,
      supervisor: null,
      vacations: {},
    },
    isValid: true,
  };

  const emptyCheck = [
    'firstName',
    'lastName',
    'email',
    'employeeId',
    'isActive',
  ];

  if (!user.id) {
    emptyCheck.push('plainPassword');
  }

  emptyCheck.forEach((element) => {
    if (
      user[element] === null
      || isEmpty(user[element].toString())
    ) {
      errors.elements[element] = t('general:validation.required');
      errors.isValid = false;
    }
  });

  supportedYears.forEach((year) => {
    errors.elements.vacations[year] = {
      vacationDays: null,
      vacationDaysCorrection: null,
    };

    if (
      !user.vacations[year]
        || !isNumeric(user.vacations[year].vacationDays.toString())
        || user.vacations[year].vacationDays < 0
    ) {
      errors.elements.vacations[year].vacationDays = t('general:validation.invalidNumber');
      errors.isValid = false;
    }

    if (
      !user.vacations[year]
      || !isNumeric(user.vacations[year].vacationDaysCorrection.toString())
    ) {
      errors.elements.vacations[year].vacationDaysCorrection = t('general:validation.invalidNumber');
      errors.isValid = false;
    }
  });

  if (!errors.elements.email && !isEmail(user.email)) {
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
      },
    );
    errors.isValid = false;
  }

  if (!errors.elements.firstName && !(user.firstName.length >= 2 && user.firstName.length <= 200)) {
    errors.elements.firstName = t(
      'general:validation.invalidLength',
      {
        max: 200,
        min: 2,
      },
    );
    errors.isValid = false;
  }

  if (!errors.elements.lastName && !(user.lastName.length >= 2 && user.lastName.length <= 200)) {
    errors.elements.lastName = t(
      'general:validation.invalidLength',
      {
        max: 200,
        min: 2,
      },
    );
    errors.isValid = false;
  }

  if (!errors.elements.plainPassword && user.plainPassword && (
    user.plainPassword.length < 8 || user.plainPassword.length > 64
  )) {
    errors.elements.plainPassword = t(
      'general:validation.invalidLength',
      {
        max: 64,
        min: 8,
      },
    );
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

  if (!validateContracts(user.contracts)) {
    errors.elements.contracts = t('user:validation.invalidContracts');
    errors.isValid = false;
  }

  return errors;
};

export const validateWorkLog = (t, workLogAttr, config, user, workLogsOfDay, banWorkLogsOfDay, contracts) => {
  const errors = {
    elements: {
      comment: null,
      destination: null,
      endHour: null,
      endMinute: null,
      expectedArrival: null,
      expectedDeparture: null,
      form: null,
      plannedEndHour: null,
      plannedEndMinute: null,
      plannedStartHour: null,
      plannedStartMinute: null,
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
    SPECIAL_LEAVE_WORK_LOG,
    TIME_OFF_WORK_LOG,
    TRAINING_WORK_LOG,
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
        || isEmpty(workLog[element])
      ) {
        errors.elements[element] = t('general:validation.required');
        errors.isValid = false;
      }
    });

    const hourCheck = [
      'plannedEndHour',
      'plannedStartHour',
    ];

    const minuteCheck = [
      'plannedEndMinute',
      'plannedStartMinute',
    ];

    [...hourCheck, ...minuteCheck].forEach((element) => {
      if (
        workLog[element] === null
        || isEmpty(workLog[element].toString())
        || !isNumeric(workLog[element].toString())
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

    return errors;
  }

  if (workLog.type === HOME_OFFICE_WORK_LOG) {
    const hourCheck = [
      'plannedEndHour',
      'plannedStartHour',
    ];

    const minuteCheck = [
      'plannedEndMinute',
      'plannedStartMinute',
    ];

    [...hourCheck, ...minuteCheck].forEach((element) => {
      if (
        workLog[element] === null
        || isEmpty(workLog[element].toString())
        || !isNumeric(workLog[element].toString())
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

    return errors;
  }

  if (workLog.type === OVERTIME_WORK_LOG) {
    if (workLog.reason === null || isEmpty(workLog.reason)) {
      errors.elements.reason = t('general:validation.required');
      errors.isValid = false;
    }

    return errors;
  }

  if (workLog.type === SICK_DAY_WORK_LOG && workLog.variant === VARIANT_SICK_CHILD) {
    if (workLog.childName === null || isEmpty(workLog.childName)) {
      errors.elements.childName = t('general:validation.required');
      errors.isValid = false;
    }

    if (workLog.childDateOfBirth === null || isEmpty(workLog.childDateOfBirth)) {
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

  if (workLog.type === SPECIAL_LEAVE_WORK_LOG) {
    if (workLog.dateTo === null || isEmpty(workLog.dateTo)) {
      errors.elements.dateTo = t('general:validation.required');
      errors.isValid = false;

      return errors;
    }

    const dateFrom = toMomentDateTimeFromDayMonthYear(workLog.date);
    let dateTo = null;

    try {
      dateTo = toMomentDateTimeFromDayMonthYear(workLog.dateTo);
    } catch (ex) {
      errors.elements.dateTo = t('general:validation.invalidDate');
      errors.isValid = false;

      return errors;
    }

    if (dateTo.isBefore(dateFrom, 'day')) {
      errors.elements.dateTo = t('general:validation.invalidDate');
      errors.isValid = false;
    }

    return errors;
  }

  if (workLog.type === TRAINING_WORK_LOG) {
    const emptyCheck = [
      'title',
    ];

    emptyCheck.forEach((element) => {
      if (
        workLog[element] === null
        || isEmpty(workLog[element])
      ) {
        errors.elements[element] = t('general:validation.required');
        errors.isValid = false;
      }
    });

    return errors;
  }

  if (workLog.type === VACATION_WORK_LOG) {
    if (workLog.dateTo === null || isEmpty(workLog.dateTo)) {
      errors.elements.dateTo = t('general:validation.required');
      errors.isValid = false;

      return errors;
    }

    const dateFrom = toMomentDateTimeFromDayMonthYear(workLog.date);
    let dateTo = null;

    try {
      dateTo = toMomentDateTimeFromDayMonthYear(workLog.dateTo);
    } catch (ex) {
      errors.elements.dateTo = t('general:validation.invalidDate');
      errors.isValid = false;

      return errors;
    }

    if (dateTo.isBefore(dateFrom, 'day')) {
      errors.elements.dateTo = t('general:validation.invalidDate');
      errors.isValid = false;
    }

    const vacationDaysByYear = {};
    const workingDays = getWorkingDays(
      toMomentDateTimeFromDayMonthYear(workLog.date),
      toMomentDateTimeFromDayMonthYear(workLog.dateTo),
      config.supportedHolidays,
      contracts,
    );

    config.supportedYears.forEach((supportedYear) => {
      vacationDaysByYear[supportedYear] = 0;
    });
    workingDays.forEach((workingDay) => {
      vacationDaysByYear[workingDay.year()] += 1;
    });

    config.supportedYears.forEach((supportedYear) => {
      const vacation = user.vacations.find((vacationItem) => vacationItem.year === supportedYear);

      if (vacationDaysByYear[supportedYear] > vacation.remainingVacationDays) {
        errors.elements.form = t('workLog:validation.vacationDaysExceeded');
        errors.isValid = false;
      }
    });

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
      || isEmpty(workLog[element].toString())
      || !isNumeric(workLog[element].toString())
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

  let workLogsTime = 0;

  if (workLogsOfDay.length > 0) {
    let overlapping = false;
    const todayDate = workLogsOfDay[0].startTime;
    const startTime = todayDate.clone().hour(workLog.startHour).minute(workLog.startMinute);
    const endTime = todayDate.clone().hour(workLog.endHour).minute(workLog.endMinute);

    workLogsOfDay.forEach((workLogItem) => {
      if (
        workLog.id !== workLogItem.id
        && isOverlapping(startTime, endTime, workLogItem.startTime, workLogItem.endTime)
      ) {
        overlapping = true;
      }

      workLogsTime += workLogItem.endTime.diff(workLogItem.startTime) / 1000;
    });

    if (overlapping) {
      errors.elements.form = t('workLog:validation.workLogOverlaps');
      errors.isValid = false;
    }
  }

  if (banWorkLogsOfDay.length > 0) {
    let { workTimeLimit } = banWorkLogsOfDay[0];

    if (banWorkLogsOfDay.length > 1) {
      banWorkLogsOfDay.forEach((banWorkLog) => {
        if (banWorkLog.workTimeLimit < workTimeLimit) {
          workTimeLimit = banWorkLog.workTimeLimit;
        }
      });
    }

    const startTime = localizedMoment().clone().hour(workLog.startHour).minute(workLog.startMinute);
    const endTime = localizedMoment().clone().hour(workLog.endHour).minute(workLog.endMinute);
    const newWorkLogDuration = endTime.diff(startTime) / 1000;

    if (newWorkLogDuration + workLogsTime > workTimeLimit) {
      errors.elements.form = t('workLog:validation.workLogExceededLimit');
      errors.isValid = false;
    }
  }

  return errors;
};

export const validateSupervisorWorkLog = (t, workLogAttr) => {
  const workLog = { ...workLogAttr };
  const errors = {
    elements: {
      date: null,
      dateTo: null,
      form: null,
      hour: null,
      minute: null,
      type: null,
    },
    isValid: true,
  };

  // Check if current type of supervisor work log is supported

  if ([
    BAN_WORK_LOG,
    MATERNITY_PROTECTION_WORK_LOG,
    PARENTAL_LEAVE_WORK_LOG,
    SICK_DAY_UNPAID_WORK_LOG,
  ].indexOf(workLog.type) === -1) {
    errors.elements.type = t('workLog:validation.invalidType');
    errors.isValid = false;

    return errors;
  }

  // Validate date from and date to fields

  let dateFrom = null;
  let dateTo = null;

  if (workLog.date === null || isEmpty(workLog.date)) {
    errors.elements.date = t('general:validation.required');
    errors.isValid = false;

    return errors;
  }

  if (workLog.dateTo === null || isEmpty(workLog.dateTo)) {
    errors.elements.dateTo = t('general:validation.required');
    errors.isValid = false;

    return errors;
  }

  try {
    dateFrom = toMomentDateTimeFromDayMonthYear(workLog.date);
  } catch (ex) {
    errors.elements.date = t('general:validation.invalidDate');
    errors.isValid = false;

    return errors;
  }

  try {
    dateTo = toMomentDateTimeFromDayMonthYear(workLog.dateTo);
  } catch (ex) {
    errors.elements.dateTo = t('general:validation.invalidDate');
    errors.isValid = false;

    return errors;
  }

  if (dateTo.isBefore(dateFrom, 'day')) {
    errors.elements.dateTo = t('general:validation.invalidDate');
    errors.isValid = false;

    return errors;
  }

  if (workLog.type === BAN_WORK_LOG) {
    const requiredCheck = [
      'hour',
      'minute',
    ];

    requiredCheck.forEach((element) => {
      if (
        workLog[element] === null
        || isEmpty(workLog[element].toString())
        || !isNumeric(workLog[element].toString())
      ) {
        errors.elements[element] = t('general:validation.invalidNumber');
        errors.isValid = false;
      }

      workLog[element] = parseInt(workLog[element], 10);
    });

    if (!errors.isValid) {
      return errors;
    }

    if (workLog.hour < 0 || workLog.hour > 23) {
      errors.elements.hour = t('workLog:validation.invalidHour');
      errors.isValid = false;
    }

    if (workLog.minute < 0 || workLog.minute > 59) {
      errors.elements.minute = t('workLog:validation.invalidMinute');
      errors.isValid = false;
    }
  }

  return errors;
};

export const validateWorkTimeCorrection = (t, data) => {
  const cData = { ...data };
  const errors = {
    elements: {
      form: null,
      hour: null,
      minute: null,
    },
    isValid: true,
  };

  const requiredCheck = [
    'hour',
    'minute',
  ];

  requiredCheck.forEach((element) => {
    if (
      cData[element] === null
      || isEmpty(cData[element].toString())
      || !isNumeric(cData[element].toString())
    ) {
      errors.elements[element] = t('general:validation.invalidNumber');
      errors.isValid = false;
    }

    cData[element] = parseInt(cData[element], 10);
  });

  if (!errors.isValid) {
    return errors;
  }

  if (data.hour < 0) {
    errors.elements.hour = t('workLog:validation.invalidHour');
    errors.isValid = false;
  }

  if (data.minute < 0 || data.minute > 59) {
    errors.elements.minute = t('workLog:validation.invalidMinute');
    errors.isValid = false;
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
    || isEmpty(rejectWorkLog.rejectionMessage)
  ) {
    errors.elements.rejectionMessage = t('general:validation.required');
    errors.isValid = false;
  }

  return errors;
};
