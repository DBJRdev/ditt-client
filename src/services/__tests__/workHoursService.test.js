import {
  getWorkHoursString,
  getWorkHoursValue,
} from '../workHoursService';

describe('getWorkHoursString()', () => {
  it('test expected work hours string', () => {
    expect(getWorkHoursString(3600)).toEqual('1:00');
    expect(getWorkHoursString(5400)).toEqual('1:30');
    expect(getWorkHoursString(7140)).toEqual('1:59');
  });
});

describe('getWorkHoursValue()', () => {
  it('test expected work hours value', () => {
    expect(getWorkHoursValue('1:00')).toEqual(3600);
    expect(getWorkHoursValue('1:30')).toEqual(5400);
    expect(getWorkHoursValue('1:59')).toEqual(7140);
    expect(getWorkHoursValue('1:65')).toEqual(7500);
  });
});
