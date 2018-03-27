import {
  toMomentDateTime,
  toDayFormat,
  toDayMonthYearFormat,
  toMonthYearFormat, isWeekend,
} from '../dateTimeService';

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

describe('toTimeFormat()', () => {
  it('should get local time string', () => {
    const momentDateTime = toMomentDateTime('2017-12-24T20:15:30.100Z');
    expect(toDayFormat(momentDateTime)).toEqual('Sunday');
  });
});

describe('toTimeFormat()', () => {
  it('should get local time string', () => {
    const momentDateTime = toMomentDateTime('2017-12-24T20:15:30.100Z');
    expect(toDayMonthYearFormat(momentDateTime)).toEqual('12/24/2017');
  });
});

describe('toTimeFormat()', () => {
  it('should get local time string', () => {
    const momentDateTime = toMomentDateTime('2017-12-24T20:15:30.100Z');
    expect(toMonthYearFormat(momentDateTime)).toEqual('December 2017');
  });
});

