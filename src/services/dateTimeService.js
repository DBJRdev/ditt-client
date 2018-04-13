import moment from 'moment-timezone';

const TIMEZONE = 'Europe/Prague';

export const localizedMoment = () => moment().tz(TIMEZONE);

export const isOverlapping = (dt1Start, dt1End, dt2Start, dt2End) => {
  if (
    dt1Start && moment.isMoment(dt1Start) && dt1Start.isValid()
    && dt1End && moment.isMoment(dt1End) && dt1End.isValid()
    && dt2Start && moment.isMoment(dt2Start) && dt2Start.isValid()
    && dt2End && moment.isMoment(dt2End) && dt2End.isValid()
  ) {
    return (dt1Start > dt2Start && dt1Start < dt2End)
      || (dt2Start > dt1Start && dt2Start < dt1End)
      || (dt1Start.diff(dt2Start, 'minutes') === 0 && dt1End.diff(dt2End, 'minutes') === 0);
  }

  throw new Error('Invalid datetime');
};

export const isWeekend = (momentDateTime) => {
  if (momentDateTime && moment.isMoment(momentDateTime) && momentDateTime.isValid()) {
    return momentDateTime.day() === 0 || momentDateTime.day() === 6;
  }

  throw new Error('Invalid datetime');
};

export const toJson = momentDateTime => momentDateTime.local().format();

export const toMomentDateTime = (dateTimeString) => {
  const momentDateTime = moment(dateTimeString, moment.ISO_8601).tz(TIMEZONE);

  if (momentDateTime.isValid()) {
    return momentDateTime;
  }

  throw new Error('Invalid datetime');
};

export const toDayFormat = (momentDateTime) => {
  if (momentDateTime && moment.isMoment(momentDateTime) && momentDateTime.isValid()) {
    return momentDateTime.format('dddd');
  }

  throw new Error('Invalid datetime');
};

export const toHourMinuteFormat = (momentDateTime) => {
  if (momentDateTime && moment.isMoment(momentDateTime) && momentDateTime.isValid()) {
    return momentDateTime.format('HH:mm');
  }

  throw new Error('Invalid datetime');
};

export const toMonthYearFormat = (momentDateTime) => {
  if (momentDateTime && moment.isMoment(momentDateTime) && momentDateTime.isValid()) {
    return momentDateTime.format('MMMM YYYY');
  }

  throw new Error('Invalid datetime');
};

export const toDayMonthYearFormat = (momentDateTime) => {
  if (momentDateTime && moment.isMoment(momentDateTime) && momentDateTime.isValid()) {
    return momentDateTime.format('L');
  }

  throw new Error('Invalid datetime');
};
