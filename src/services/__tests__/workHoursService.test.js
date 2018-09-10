import {
  getWorkHoursString,
  getWorkHoursValue,
} from '../workHoursService';

describe('getWorkHoursString()', () => {
  it('test expected work hours string', () => {
    expect(getWorkHoursString(1)).toEqual('1:00');
    expect(getWorkHoursString(1.5)).toEqual('1:30');
    expect(getWorkHoursString(1.99)).toEqual('1:59');
  });
});

describe('getWorkHoursValue()', () => {
  it('test expected work hours value', () => {
    expect(getWorkHoursValue('1:00')).toEqual(1);
    expect(getWorkHoursValue('1:30')).toEqual(1.5);
    expect(getWorkHoursValue('1:59').toFixed(3)).toEqual('1.983');
    expect(getWorkHoursValue('1:65').toFixed(3)).toEqual('2.083');
  });
});
