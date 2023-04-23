import moment from 'moment-timezone';

export const TIMEZONE = 'Europe/Prague';

export const localizedMoment = () => moment().tz(TIMEZONE);

const isMomentValid = (momentDateTime) => momentDateTime
  && moment.isMoment(momentDateTime)
  && momentDateTime.isValid();

export const createDate = (year, month, date) => moment({
  date,
  month,
  year,
}).tz(TIMEZONE);

export const includesSameDate = (momentDateTime, momentDateTimeArr) => {
  if (isMomentValid(momentDateTime)) {
    const sameDate = momentDateTimeArr.find((date) => {
      if (isMomentValid(date)) {
        return momentDateTime.isSame(date, 'day');
      }

      throw new Error('Invalid datetime');
    });

    return !!sameDate;
  }

  throw new Error('Invalid datetime');
};

export const isOverlapping = (dt1Start, dt1End, dt2Start, dt2End) => {
  if (
    isMomentValid(dt1Start)
    && isMomentValid(dt1Start)
    && isMomentValid(dt2Start)
    && isMomentValid(dt2End)
  ) {
    return (dt1Start > dt2Start && dt1Start < dt2End)
      || (dt2Start > dt1Start && dt2Start < dt1End)
      || (dt1Start.diff(dt2Start, 'minutes') === 0 && dt1End.diff(dt2End, 'minutes') === 0);
  }

  throw new Error('Invalid datetime');
};

export const isWeekend = (momentDateTime) => {
  if (isMomentValid(momentDateTime)) {
    return momentDateTime.day() === 0 || momentDateTime.day() === 6;
  }

  throw new Error('Invalid datetime');
};

export const toJson = (momentDateTime) => momentDateTime.local().format();

export const toMomentDateTime = (dateTimeString) => {
  const momentDateTime = moment(dateTimeString, moment.ISO_8601).tz(TIMEZONE);

  if (isMomentValid(momentDateTime)) {
    return momentDateTime;
  }

  throw new Error('Invalid datetime');
};

export const toMomentDateTimeFromDayMonth = (dateTimeString) => {
  const momentDateTime = moment(dateTimeString, 'DD.MM.').tz(TIMEZONE);

  if (isMomentValid(momentDateTime)) {
    return momentDateTime;
  }

  throw new Error('Invalid datetime');
};

export const toMomentDateTimeFromDayMonthYear = (dateTimeString) => {
  const momentDateTime = moment(dateTimeString, 'DD.MM.YYYY').tz(TIMEZONE);

  if (isMomentValid(momentDateTime)) {
    return momentDateTime;
  }

  throw new Error('Invalid datetime');
};

export const toDayFormat = (momentDateTime) => {
  if (isMomentValid(momentDateTime)) {
    return momentDateTime.format('dddd');
  }

  throw new Error('Invalid datetime');
};

export const toHourMinuteFormat = (momentDateTime) => {
  if (isMomentValid(momentDateTime)) {
    return momentDateTime.format('HH:mm');
  }

  throw new Error('Invalid datetime');
};

export const toHourMinuteFormatFromInt = (rawSeconds, isPlusDisplayed = false) => {
  const toBeCorrected = rawSeconds < 0;
  let rawSecondsCorrected = rawSeconds;

  if (toBeCorrected) {
    rawSecondsCorrected *= -1;
  }

  const plusSymbol = isPlusDisplayed ? '+' : '';
  const hours = Math.floor(rawSecondsCorrected / 3600);
  const minutes = Math.floor((rawSecondsCorrected - (hours * 3600)) / 60);

  return `${toBeCorrected ? '-' : plusSymbol}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
};

export const toAbsoluteHourMinuteFormatFromInt = (rawSeconds) => {
  let rawSecondsCorrected = rawSeconds;

  if (rawSecondsCorrected < 0) {
    rawSecondsCorrected *= -1;
  }

  const hours = Math.floor(rawSecondsCorrected / 3600);
  const minutes = Math.floor((rawSecondsCorrected - (hours * 3600)) / 60);

  return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
};

export const toMonthFormat = (momentDateTime) => {
  if (isMomentValid(momentDateTime)) {
    return momentDateTime.format('MMMM');
  }

  throw new Error('Invalid datetime');
};

export const toMonthYearFormat = (momentDateTime) => {
  if (isMomentValid(momentDateTime)) {
    return momentDateTime.format('MMMM YYYY');
  }

  throw new Error('Invalid datetime');
};

export const toDayMonthYearFormat = (momentDateTime) => {
  if (isMomentValid(momentDateTime)) {
    return momentDateTime.format('DD.MM.YYYY');
  }

  throw new Error('Invalid datetime');
};

export const toDayDayMonthYearFormat = (momentDateTime) => {
  if (isMomentValid(momentDateTime)) {
    return momentDateTime.format('ddd DD.MM.YYYY');
  }

  throw new Error('Invalid datetime');
};

export const getWorkingDays = (firstDay, lastDay, holidays) => {
  const currentDay = firstDay.clone();
  const workingDays = [];

  while (currentDay.isSameOrBefore(lastDay, 'day')) {
    if (!isWeekend(currentDay) && !includesSameDate(currentDay, holidays)) {
      workingDays.push(currentDay.clone());
    }

    currentDay.add(1, 'day');
  }

  return workingDays;
};

export const getAllDays = (firstDay, lastDay) => {
  const currentDay = firstDay.clone();
  const workingDays = [];

  while (currentDay.isSameOrBefore(lastDay, 'day')) {
    workingDays.push(currentDay.clone());
    currentDay.add(1, 'day');
  }

  return workingDays;
};

export const isWorkingDay = (date, holidays) => !isWeekend(date) && !includesSameDate(date, holidays);
