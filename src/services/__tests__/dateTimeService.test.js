import {
  isOverlapping,
  isWeekend,
  toMomentDateTime,
  toDayFormat,
  toDayMonthYearFormat,
  toHourMinuteFormat,
  toMonthYearFormat,
} from '../dateTimeService';

describe('isOverlapping()', () => {
  it('should check whether is overlapping or not', () => {
    const dt1 = toMomentDateTime('2017-12-24T20:15:30.100Z');
    const dt2 = toMomentDateTime('2017-12-24T21:15:30.100Z');
    const dt3 = toMomentDateTime('2017-12-24T22:15:30.100Z');
    const dt4 = toMomentDateTime('2017-12-24T23:15:30.100Z');
    expect(isOverlapping(dt1, dt2, dt3, dt4)).toEqual(false);
    expect(isOverlapping(dt3, dt4, dt1, dt2)).toEqual(false);
    expect(isOverlapping(dt1, dt3, dt2, dt4)).toEqual(true);
    expect(isOverlapping(dt2, dt4, dt1, dt3)).toEqual(true);
    expect(isOverlapping(dt1, dt4, dt2, dt3)).toEqual(true);
  });
});

describe('isWeekend()', () => {
  it('should check whether is weekend or not', () => {
    const momentDateTime = toMomentDateTime('2017-12-24T20:15:30.100Z');
    expect(isWeekend(momentDateTime)).toEqual(true);
    expect(isWeekend(momentDateTime.add(1, 'day'))).toEqual(false);
    expect(isWeekend(momentDateTime.add(1, 'day'))).toEqual(false);
    expect(isWeekend(momentDateTime.add(1, 'day'))).toEqual(false);
    expect(isWeekend(momentDateTime.add(1, 'day'))).toEqual(false);
    expect(isWeekend(momentDateTime.add(1, 'day'))).toEqual(false);
    expect(isWeekend(momentDateTime.add(1, 'day'))).toEqual(true);
  });
});

describe('toMomentDateTime()', () => {
  it('should get local moment date time object', () => {
    const momentDateTime = toMomentDateTime('2017-12-24T20:15:30.100Z');

    expect(momentDateTime.year()).toEqual(2017);
    expect(momentDateTime.month()).toEqual(11);
    expect(momentDateTime.date()).toEqual(24);
    expect(momentDateTime.hour()).toEqual(21);
    expect(momentDateTime.minute()).toEqual(15);
    expect(momentDateTime.second()).toEqual(30);
    expect(momentDateTime.millisecond()).toEqual(100);
  });
});

describe('toDayFormat()', () => {
  it('should get day string', () => {
    const momentDateTime = toMomentDateTime('2017-12-24T20:15:30.100Z');
    expect(toDayFormat(momentDateTime)).toEqual('Sunday');
  });
});

describe('toTimeFormat()', () => {
  it('should get hour with minute string', () => {
    const momentDateTime = toMomentDateTime('2017-12-24T20:15:30.100Z');
    expect(toHourMinuteFormat(momentDateTime)).toEqual('21:15');
  });
});

describe('toDayMonthYearFormat()', () => {
  it('should get day with month and year string', () => {
    const momentDateTime = toMomentDateTime('2017-12-24T20:15:30.100Z');
    expect(toDayMonthYearFormat(momentDateTime)).toEqual('12/24/2017');
  });
});

describe('toMonthYearFormat()', () => {
  it('should get month with year string', () => {
    const momentDateTime = toMomentDateTime('2017-12-24T20:15:30.100Z');
    expect(toMonthYearFormat(momentDateTime)).toEqual('December 2017');
  });
});

