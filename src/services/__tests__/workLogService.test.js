import Immutable from 'immutable';
import { toMomentDateTime } from '../dateTimeService';
import { getWorkedTime } from '../workLogService';

describe('getWorkedTime', () => {
  const workedHoursLimits = {
    lowerLimit: {
      changeBy: -1800,
      limit: 21600,
    },
    upperLimit: {
      changeBy: -2700,
      limit: 32400,
    },
  };

  it('test calculate no work logs', () => {
    expect(getWorkedTime(
      [],
      Immutable.fromJS([]),
      workedHoursLimits
    ).asSeconds()).toEqual(0);
  });

  it('test calculate work logs', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T16:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    expect(getWorkedTime(
      workLogs,
      Immutable.fromJS([]),
      workedHoursLimits
    ).asSeconds()).toEqual(4 * 3600);
  });

  it('test calculate work logs above lower limit', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T17:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    expect(getWorkedTime(
      workLogs,
      Immutable.fromJS([]),
      workedHoursLimits
    ).asSeconds()).toEqual(6.5 * 3600);
  });

  it('test calculate work logs above upper limit', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T20:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    expect(getWorkedTime(
      workLogs,
      Immutable.fromJS([]),
      workedHoursLimits
    ).asSeconds()).toEqual(9.25 * 3600);
  });

  it('test calculate approved business trip work logs without work logs', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'BUSINESS_TRIP_WORK_LOG',
      },
    ];

    expect(getWorkedTime(
      workLogs,
      Immutable.fromJS([{
        month: 1,
        requiredHours: 6,
        year: 2018,
      }]),
      workedHoursLimits
    ).asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate unapproved business trip work logs without work logs', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        status: 'WAITING_FOR_APPROVAL',
        type: 'BUSINESS_TRIP_WORK_LOG',
      },
    ];

    expect(getWorkedTime(
      workLogs,
      Immutable.fromJS([{
        month: 1,
        requiredHours: 6,
        year: 2018,
      }]),
      workedHoursLimits
    ).asSeconds()).toEqual(0);
  });

  it('test calculate approved business trip work logs', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'BUSINESS_TRIP_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T16:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    expect(getWorkedTime(
      workLogs,
      Immutable.fromJS([{
        month: 1,
        requiredHours: 6,
        year: 2018,
      }]),
      workedHoursLimits
    ).asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate approved business trip work logs above lower limit', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'BUSINESS_TRIP_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T17:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    expect(getWorkedTime(
      workLogs,
      Immutable.fromJS([{
        month: 1,
        requiredHours: 6,
        year: 2018,
      }]),
      workedHoursLimits
    ).asSeconds()).toEqual(6.5 * 3600);
  });

  it('test calculate approved business trip work logs above upper limit', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'BUSINESS_TRIP_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T20:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    expect(getWorkedTime(
      workLogs,
      Immutable.fromJS([{
        month: 1,
        requiredHours: 6,
        year: 2018,
      }]),
      workedHoursLimits
    ).asSeconds()).toEqual(9.25 * 3600);
  });

  it('test calculate sick day work logs', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        type: 'SICK_DAY_WORK_LOG',
      },
    ];

    expect(getWorkedTime(
      workLogs,
      Immutable.fromJS([{
        month: 1,
        requiredHours: 6,
        year: 2018,
      }]),
      workedHoursLimits
    ).asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate approved vacation work logs', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'VACATION_WORK_LOG',
      },
    ];

    expect(getWorkedTime(
      workLogs,
      Immutable.fromJS([{
        month: 1,
        requiredHours: 6,
        year: 2018,
      }]),
      workedHoursLimits
    ).asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate unapproved vacation work logs', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        status: 'WAITING_FOR_APPROVAL',
        type: 'VACATION_WORK_LOG',
      },
    ];

    expect(getWorkedTime(
      workLogs,
      Immutable.fromJS([{
        month: 1,
        requiredHours: 6,
        year: 2018,
      }]),
      workedHoursLimits
    ).asSeconds()).toEqual(0);
  });

  it('test all', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'BUSINESS_TRIP_WORK_LOG',
      },
      {
        date: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        type: 'SICK_DAY_WORK_LOG',
      },
      {
        date: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'VACATION_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T18:15:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    expect(getWorkedTime(
      workLogs,
      Immutable.fromJS([{
        month: 1,
        requiredHours: 6,
        year: 2018,
      }]),
      workedHoursLimits
    ).asSeconds()).toEqual(18 * 3600);
  });
});
