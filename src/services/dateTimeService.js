import moment from 'moment-timezone';

const TIMEZONE = 'Europe/Prague';

export const localizedMoment = () => moment().tz(TIMEZONE);

export const isWeekend = (momentDateTime) => {
  if (momentDateTime && moment.isMoment(momentDateTime) && momentDateTime.isValid()) {
    return momentDateTime.day() === 0 || momentDateTime.day() === 6;
  }

  throw new Error('Invalid datetime');
};
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
