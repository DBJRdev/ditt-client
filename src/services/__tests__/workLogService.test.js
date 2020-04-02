import Immutable from 'immutable';
import { toMomentDateTime } from '../dateTimeService';
import {
  collapseWorkLogs,
  getWorkedTime,
} from '../workLogService';
import configMock from '../../../tests/mocks/configMock';

describe('getWorkedTime', () => {
  const date = toMomentDateTime('2018-01-02T00:00:00.000Z');
  const publicHolidayDate = toMomentDateTime('2018-01-01T00:00:00.000Z');
  const sundayDate = toMomentDateTime('2018-01-07T00:00:00.000Z');
  const workHours = {
    month: 1,
    requiredHours: 6,
    year: 2018,
  };
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
  const supportedHolidays = [
    toMomentDateTime('2018-01-01T00:00:00.000Z'),
    toMomentDateTime('2018-12-24T00:00:00.000Z'),
    toMomentDateTime('2018-12-25T00:00:00.000Z'),
    toMomentDateTime('2018-12-26T00:00:00.000Z'),
    toMomentDateTime('2018-12-31T00:00:00.000Z'),
  ];

  it('test calculate no work logs', () => {
    const result = getWorkedTime(
      date,
      [],
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(0);
  });

  it('test calculate short standard work logs without break', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(4 * 3600);
  });

  it('test calculate short standard work logs with long break', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T17:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T16:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(4 * 3600);
  });

  it('test calculate standard work log more than 6 hours long', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-02T18:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(1800);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600 - 600);
  });

  it('test calculate standard work logs above lower limit without break', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(1800);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6.5 * 3600);
  });

  it('test calculate standard work logs above lower limit with short break', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-02T11:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T11:05:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:20:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(1800);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6.75 * 3600);
  });

  it('test calculate standard work logs above lower limit with long break', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T16:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T17:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(7 * 3600);
  });

  it('test calculate standard work logs above upper limit without break', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0.75 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(9.25 * 3600);
  });

  it('test calculate standard work logs above upper limit with short break', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-02T11:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T11:05:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:20:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0.75 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(9.5 * 3600);
  });

  it('test calculate standard work logs above upper limit with long break', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T21:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T19:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(10 * 3600);
  });

  // Standard work logs during public holidays

  it('test calculate short standard work logs without break during public holidays', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      publicHolidayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(4 * 3600 * 1.35);
  });

  it('test calculate short standard work logs with long break during public holidays', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T15:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T17:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T16:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      publicHolidayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(4 * 3600 * 1.35);
  });

  it('test calculate standard work log more than 6 hours long during public holidays', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-01T18:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      publicHolidayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(1800);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual((6 * 3600 - 600) * 1.35);
  });

  it('test calculate standard work logs above lower limit without break during public holidays', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T15:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      publicHolidayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(1800);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6.5 * 3600 * 1.35);
  });

  it('test calculate standard work logs above lower limit with short break during public holidays', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-01T11:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T12:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T11:05:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T15:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T12:20:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      publicHolidayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(1800);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6.75 * 3600 * 1.35);
  });

  it('test calculate standard work logs above lower limit with long break during public holidays', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T16:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T18:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T17:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      publicHolidayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(7 * 3600 * 1.35);
  });

  it('test calculate standard work logs above upper limit without break during public holidays', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T18:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      publicHolidayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0.75 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(9.25 * 3600 * 1.35);
  });

  it('test calculate standard work logs above upper limit with short break during public holidays', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-01T11:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T12:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T11:05:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T18:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T12:20:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      publicHolidayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0.75 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(9.5 * 3600 * 1.35);
  });

  it('test calculate standard work logs above upper limit with long break during public holidays', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T18:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T21:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T19:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      publicHolidayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(10 * 3600 * 1.35);
  });

  // Standard work log during sunday

  it('test calculate short standard work logs without break during sunday', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-07T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      sundayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(4 * 3600 * 1.25);
  });

  it('test calculate short standard work logs with long break during sunday', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-07T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T15:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T17:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T16:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      sundayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(4 * 3600 * 1.25);
  });

  it('test calculate standard work log more than 6 hours long during sunday', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-07T18:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T12:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      sundayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(1800);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual((6 * 3600 - 600) * 1.25);
  });

  it('test calculate standard work logs above lower limit without break during sunday', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-07T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T15:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      sundayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(1800);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6.5 * 3600 * 1.25);
  });

  it('test calculate standard work logs above lower limit with short break during sunday', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-07T11:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T12:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T11:05:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T15:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T12:20:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      sundayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(1800);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6.75 * 3600 * 1.25);
  });

  it('test calculate standard work logs above lower limit with long break during sunday', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-07T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T16:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T18:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T17:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      sundayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(7 * 3600 * 1.25);
  });

  it('test calculate standard work logs above upper limit without break during sunday', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-07T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T18:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      sundayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0.75 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(9.25 * 3600 * 1.25);
  });

  it('test calculate standard work logs above upper limit with short break during sunday', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-07T11:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T12:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T11:05:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T18:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T12:20:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      sundayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0.75 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(9.5 * 3600 * 1.25);
  });

  it('test calculate standard work logs above upper limit with long break during sunday', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-07T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T18:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T21:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T19:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      sundayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(10 * 3600 * 1.25);
  });

  // Ban work logs

  it('test calculate ban work log with short standard work logs without break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'BAN_WORK_LOG',
        workTimeLimit: 2 * 3600,
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(2 * 3600);
  });

  it('test calculate ban work log with short standard work logs with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'BAN_WORK_LOG',
        workTimeLimit: 2 * 3600,
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T17:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T16:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(2 * 3600);
  });

  it('test calculate ban work log with standard work log more than 6 hours long', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'BAN_WORK_LOG',
        workTimeLimit: 2 * 3600,
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(1800);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(2 * 3600);
  });

  it('test calculate ban work log with standard work logs above lower limit without break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'BAN_WORK_LOG',
        workTimeLimit: 2 * 3600,
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(1800);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(2 * 3600);
  });

  it('test calculate ban work log with standard work logs above lower limit with short break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'BAN_WORK_LOG',
        workTimeLimit: 2 * 3600,
      },
      {
        endTime: toMomentDateTime('2018-01-02T11:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T11:05:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:20:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(1800);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(2 * 3600);
  });

  it('test calculate ban work log with standard work logs above lower limit with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'BAN_WORK_LOG',
        workTimeLimit: 2 * 3600,
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T16:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T17:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(2 * 3600);
  });

  it('test calculate ban work log with standard work logs above upper limit without break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'BAN_WORK_LOG',
        workTimeLimit: 2 * 3600,
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0.75 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(2 * 3600);
  });

  it('test calculate ban work log with standard work logs above upper limit with short break', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2018-01-02T11:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T11:05:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:20:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0.75 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(9.5 * 3600);
  });

  it('test calculate ban work log with standard work logs above upper limit with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'BAN_WORK_LOG',
        workTimeLimit: 2 * 3600,
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T21:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T19:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(2 * 3600);
  });

  // Business trip work logs

  it('test calculate approved business trip work logs without work logs', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'BUSINESS_TRIP_WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate unapproved business trip work logs without work logs', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'WAITING_FOR_APPROVAL',
        type: 'BUSINESS_TRIP_WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(0);
  });

  it('test calculate approved business trip work logs without break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'BUSINESS_TRIP_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(4 * 3600);
  });

  it('test calculate approved business trip work logs without break during public holidays', () => {
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
        endTime: toMomentDateTime('2018-01-01T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      publicHolidayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(4 * 3600 * 1.35);
  });

  it('test calculate approved business trip work logs without break during sunday', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-07T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'BUSINESS_TRIP_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      sundayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(4 * 3600 * 1.25);
  });

  it('test calculate approved business trip work logs with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'BUSINESS_TRIP_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T17:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T16:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(4 * 3600);
  });

  it('test calculate approved business trip work logs with one standard work log more than 6 hours long', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'BUSINESS_TRIP_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(1800);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600 - 600);
  });

  it('test calculate approved business trip work logs above lower limit without break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'BUSINESS_TRIP_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(1800);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6.5 * 3600);
  });

  it('test calculate approved business trip work logs above lower limit with short break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'BUSINESS_TRIP_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T11:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T11:05:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:20:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(1800);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6.75 * 3600);
  });

  it('test calculate approved business trip work logs above lower limit with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'BUSINESS_TRIP_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T16:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T17:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(7 * 3600);
  });

  it('test calculate approved business trip work logs above upper limit without break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'BUSINESS_TRIP_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0.75 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(9.25 * 3600);
  });

  it('test calculate approved business trip work logs above upper limit with short break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'BUSINESS_TRIP_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T11:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T11:05:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:20:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0.75 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(9.5 * 3600);
  });

  it('test calculate approved business trip work logs above upper limit with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'BUSINESS_TRIP_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T21:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T19:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(10 * 3600);
  });

  // Home office work logs

  it('test calculate approved home office work logs without work logs', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'HOME_OFFICE_WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate unapproved home office work logs without work logs', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'WAITING_FOR_APPROVAL',
        type: 'HOME_OFFICE_WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(0);
  });

  it('test calculate approved home office work logs without break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'HOME_OFFICE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(4 * 3600);
  });

  it('test calculate approved home office work logs without break during public holidays', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'HOME_OFFICE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      publicHolidayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(4 * 3600 * 1.35);
  });

  it('test calculate approved home office work logs without break during sunday', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-07T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'HOME_OFFICE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      sundayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(4 * 3600 * 1.25);
  });

  it('test calculate approved home office work logs with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'HOME_OFFICE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T17:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T16:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(4 * 3600);
  });

  it('test calculate approved home office work logs  with one standard work log more than 6 hours long', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'HOME_OFFICE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(1800);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600 - 600);
  });

  it('test calculate approved home office work logs above lower limit without break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'HOME_OFFICE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(1800);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6.5 * 3600);
  });

  it('test calculate approved home office work logs above lower limit with short break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'HOME_OFFICE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T11:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T11:05:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:20:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(1800);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6.75 * 3600);
  });

  it('test calculate approved home office work logs above lower limit with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'HOME_OFFICE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T16:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T17:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(7 * 3600);
  });

  it('test calculate approved home office work logs above upper limit without break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'HOME_OFFICE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0.75 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(9.25 * 3600);
  });

  it('test calculate approved home office work logs above upper limit with short break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'HOME_OFFICE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T11:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T11:05:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:20:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0.75 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(9.5 * 3600);
  });

  it('test calculate approved home office work logs above upper limit with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'HOME_OFFICE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T21:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T19:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(10 * 3600);
  });

  // Maternity protection work logs

  it('test calculate maternity protection work logs without work logs', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'MATERNITY_PROTECTION_WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate maternity protection work logs without break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'MATERNITY_PROTECTION_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate maternity protection work logs without break during public holidays', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        type: 'MATERNITY_PROTECTION_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      publicHolidayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600 * 1.35);
  });

  it('test calculate maternity protection work logs without break during sunday', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-07T12:00:00.000Z'),
        type: 'MATERNITY_PROTECTION_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      sundayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600 * 1.25);
  });

  it('test calculate maternity protection work logs with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'MATERNITY_PROTECTION_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T17:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T16:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate maternity protection work logs with one standard work log more than 6 hours long', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'MATERNITY_PROTECTION_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate maternity protection work logs above lower limit without break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'MATERNITY_PROTECTION_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate maternity protection work logs above lower limit with short break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'MATERNITY_PROTECTION_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T11:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T11:05:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:20:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate maternity protection work logs above lower limit with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'MATERNITY_PROTECTION_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T16:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T17:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate maternity protection work logs above upper limit without break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'MATERNITY_PROTECTION_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate maternity protection work logs above upper limit with short break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'MATERNITY_PROTECTION_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T11:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T11:05:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:20:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate maternity protection work logs above upper limit with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'MATERNITY_PROTECTION_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T21:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T19:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  // Parental leave work logs

  it('test calculate parental leave work logs without work logs', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'PARENTAL_LEAVE_WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(0);
  });

  it('test calculate parental leave work logs without break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'PARENTAL_LEAVE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(4 * 3600);
  });

  it('test calculate parental leave work logs without break during public holidays', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        type: 'PARENTAL_LEAVE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      publicHolidayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(4 * 3600 * 1.35);
  });

  it('test calculate parental leave work logs without break during sunday', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-07T12:00:00.000Z'),
        type: 'PARENTAL_LEAVE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      sundayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(4 * 3600 * 1.25);
  });

  it('test calculate parental leave work logs with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'PARENTAL_LEAVE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T17:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T16:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(4 * 3600);
  });

  it('test calculate parental leave work logs with one standard work log more than 6 hours long', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'PARENTAL_LEAVE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0.5 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate parental leave work logs above lower limit without break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'PARENTAL_LEAVE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0.5 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6.5 * 3600);
  });

  it('test calculate parental leave work logs above lower limit with short break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'PARENTAL_LEAVE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T11:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T11:05:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:20:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0.5 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6.75 * 3600);
  });

  it('test calculate parental leave work logs above lower limit with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'PARENTAL_LEAVE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T16:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T17:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(7 * 3600);
  });

  it('test calculate parental leave work logs above upper limit without break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'PARENTAL_LEAVE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0.75 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(9.25 * 3600);
  });

  it('test calculate parental leave work logs above upper limit with short break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'PARENTAL_LEAVE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T11:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T11:05:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:20:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0.75 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(9.5 * 3600);
  });

  it('test calculate parental leave work logs above upper limit with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'PARENTAL_LEAVE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T21:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T19:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(10 * 3600);
  });

  // Sick day work log

  it('test calculate sick day work logs without work logs', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'SICK_DAY_WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate sick day work logs in sum less that required hours per day', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'SICK_DAY_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T10:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:15:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T10:15:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(4 * 3600);
  });

  it('test calculate sick day work logs in sum greater that required hours per day', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'SICK_DAY_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T11:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T11:05:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:20:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  // Special leave work logs

  it('test calculate approved special leave work logs without work logs', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'SPECIAL_LEAVE_WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate unapproved special leave work logs without work logs', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'WAITING_FOR_APPROVAL',
        type: 'SPECIAL_LEAVE_WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(0);
  });

  it('test calculate approved special leave work logs without break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'SPECIAL_LEAVE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate approved special leave work logs without break during public holidays', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'SPECIAL_LEAVE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      publicHolidayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600 * 1.35);
  });

  it('test calculate approved special leave work logs without break during sunday', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-07T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'SPECIAL_LEAVE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      sundayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600 * 1.25);
  });

  it('test calculate approved special leave work logs with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'SPECIAL_LEAVE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T17:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T16:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate approved special leave work logs  with one standard work log more than 6 hours long', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'SPECIAL_LEAVE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate approved special leave work logs above lower limit without break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'SPECIAL_LEAVE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate approved special leave work logs above lower limit with short break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'SPECIAL_LEAVE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T11:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T11:05:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:20:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate approved special leave work logs above lower limit with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'SPECIAL_LEAVE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T16:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T17:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate approved special leave work logs above upper limit without break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'SPECIAL_LEAVE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate approved special leave work logs above upper limit with short break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'SPECIAL_LEAVE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T11:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T11:05:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:20:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate approved special leave work logs above upper limit with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'SPECIAL_LEAVE_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T21:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T19:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  // Time off work logs

  it('test calculate approved time off work logs without work logs', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'TIME_OFF_WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate unapproved time off work logs without work logs', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'WAITING_FOR_APPROVAL',
        type: 'TIME_OFF_WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(0);
  });

  it('test calculate approved time off work logs without break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'TIME_OFF_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(4 * 3600);
  });

  it('test calculate approved time off work logs without break during public holidays', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'TIME_OFF_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-01T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      publicHolidayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(4 * 3600 * 1.35);
  });

  it('test calculate approved time off work logs without break during sunday', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-07T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'TIME_OFF_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      sundayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(4 * 3600 * 1.25);
  });

  it('test calculate approved time off work logs with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'TIME_OFF_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T17:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T16:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(4 * 3600);
  });

  it('test calculate approved time off work logs  with one standard work log more than 6 hours long', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'TIME_OFF_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(1800);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600 - 600);
  });

  it('test calculate approved time off work logs above lower limit without break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'TIME_OFF_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(1800);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6.5 * 3600);
  });

  it('test calculate approved time off work logs above lower limit with short break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'TIME_OFF_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T11:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T11:05:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:20:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(1800);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6.75 * 3600);
  });

  it('test calculate approved time off work logs above lower limit with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'TIME_OFF_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T16:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T17:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(7 * 3600);
  });

  it('test calculate approved time off work logs above upper limit without break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'TIME_OFF_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0.75 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(9.25 * 3600);
  });

  it('test calculate approved time off work logs above upper limit with short break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'TIME_OFF_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T11:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T11:05:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:20:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0.75 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(9.5 * 3600);
  });

  it('test calculate approved time off work logs above upper limit with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'TIME_OFF_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T21:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T19:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(3 * 3600);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(10 * 3600);
  });

  // Vacation work logs

  it('test calculate approved vacation work logs without work logs', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'VACATION_WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate unapproved vacation work logs without work logs', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'WAITING_FOR_APPROVAL',
        type: 'VACATION_WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(0);
  });

  it('test calculate approved vacation work logs without break during public holidays', () => {
    const workLogs = [
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
        endTime: toMomentDateTime('2018-01-01T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-01T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      publicHolidayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600 * 1.35);
  });

  it('test calculate approved vacation work logs without break during sunday', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-07T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'VACATION_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-07T14:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-07T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      sundayDate,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(true);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600 * 1.25);
  });

  it('test calculate approved vacation work logs with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'VACATION_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T10:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T17:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T16:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate approved vacation work logs  with one standard work log more than 6 hours long', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'VACATION_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate approved vacation work logs above lower limit without break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'VACATION_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate approved vacation work logs above lower limit with short break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'VACATION_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T11:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T11:05:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T15:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:20:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate approved vacation work logs above lower limit with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'VACATION_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T16:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T17:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate approved vacation work logs above upper limit without break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'VACATION_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate approved vacation work logs above upper limit with short break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'VACATION_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T11:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:05:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T11:05:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:20:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T12:20:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });

  it('test calculate approved vacation work logs above upper limit with long break', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'VACATION_WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T08:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T18:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T14:00:00.000Z'),
        type: 'WORK_LOG',
      },
      {
        endTime: toMomentDateTime('2018-01-02T21:00:00.000Z'),
        startTime: toMomentDateTime('2018-01-02T19:00:00.000Z'),
        type: 'WORK_LOG',
      },
    ];

    const result = getWorkedTime(
      date,
      workLogs,
      workHours,
      workedHoursLimits,
      supportedHolidays,
    );

    expect(result.breakTime.asSeconds()).toEqual(0);
    expect(result.isWorkTimeCorrected).toEqual(false);
    expect(result.workTime.asSeconds()).toEqual(6 * 3600);
  });
});

describe('collapseWorkLogs', () => {
  it('test collapse no work logs', () => {
    expect(collapseWorkLogs(
      Immutable.List([]),
      configMock.get('supportedHolidays'),
    ).length).toEqual(0);
  });

  it('test collapse work logs', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
        id: 1,
        status: 'APPROVED',
        type: 'VACATION_WORK_LOG',
      },
      {
        date: toMomentDateTime('2018-01-03T12:00:00.000Z'),
        id: 2,
        status: 'APPROVED',
        type: 'VACATION_WORK_LOG',
      },
      {
        date: toMomentDateTime('2018-01-04T12:00:00.000Z'),
        id: 3,
        status: 'APPROVED',
        type: 'VACATION_WORK_LOG',
      },
      {
        date: toMomentDateTime('2018-01-09T12:00:00.000Z'),
        id: 4,
        rejectionMessage: 'Message 1',
        status: 'REJECTED',
        type: 'VACATION_WORK_LOG',
      },
      {
        date: toMomentDateTime('2018-01-10T12:00:00.000Z'),
        id: 5,
        rejectionMessage: 'Message 1',
        status: 'REJECTED',
        type: 'VACATION_WORK_LOG',
      },
      {
        date: toMomentDateTime('2018-01-11T12:00:00.000Z'),
        id: 6,
        rejectionMessage: 'Message 2',
        status: 'REJECTED',
        type: 'VACATION_WORK_LOG',
      },
      {
        date: toMomentDateTime('2018-12-23T12:00:00.000Z'),
        id: 7,
        status: 'APPROVED',
        type: 'VACATION_WORK_LOG',
      },
      {
        date: toMomentDateTime('2018-12-27T12:00:00.000Z'),
        id: 8,
        status: 'APPROVED',
        type: 'VACATION_WORK_LOG',
      },
    ];

    const collapsedWorkLogs = collapseWorkLogs(
      Immutable.fromJS(workLogs),
      configMock.get('supportedHolidays'),
    );

    expect(collapsedWorkLogs.length).toEqual(4);
    expect(collapsedWorkLogs[0]).toEqual(Immutable.fromJS({
      bulkIds: [1, 2, 3],
      date: toMomentDateTime('2018-01-02T12:00:00.000Z'),
      dateTo: toMomentDateTime('2018-01-04T12:00:00.000Z'),
      id: 1,
      isBulk: true,
      status: 'APPROVED',
      type: 'VACATION_WORK_LOG',
    }));
    expect(collapsedWorkLogs[1]).toEqual(Immutable.fromJS({
      bulkIds: [7, 8],
      date: toMomentDateTime('2018-12-23T12:00:00.000Z'),
      dateTo: toMomentDateTime('2018-12-27T12:00:00.000Z'),
      id: 7,
      isBulk: true,
      status: 'APPROVED',
      type: 'VACATION_WORK_LOG',
    }));
    expect(collapsedWorkLogs[2]).toEqual(Immutable.fromJS({
      bulkIds: [4, 5],
      date: toMomentDateTime('2018-01-09T12:00:00.000Z'),
      dateTo: toMomentDateTime('2018-01-10T12:00:00.000Z'),
      id: 4,
      isBulk: true,
      rejectionMessage: 'Message 1',
      status: 'REJECTED',
      type: 'VACATION_WORK_LOG',
    }));
    expect(collapsedWorkLogs[3]).toEqual(Immutable.fromJS({
      date: toMomentDateTime('2018-01-11T12:00:00.000Z'),
      id: 6,
      isBulk: false,
      rejectionMessage: 'Message 2',
      status: 'REJECTED',
      type: 'VACATION_WORK_LOG',
    }));
  });
});
