import Immutable from 'immutable';
import { toMomentDateTime } from '../dateTimeService';
import {
  collapseWorkLogs,
  getWorkedTime,
} from '../workLogService';
import configMock from '../../../tests/mocks/configMock';

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

  it('test calculate approved home office work logs without work logs', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'HOME_OFFICE_WORK_LOG',
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

  it('test calculate unapproved home office work logs without work logs', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        status: 'WAITING_FOR_APPROVAL',
        type: 'HOME_OFFICE_WORK_LOG',
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

  it('test calculate approved home office work logs', () => {
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

  it('test calculate approved home office work logs above lower limit', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'HOME_OFFICE_WORK_LOG',
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

  it('test calculate approved home office work logs above upper limit', () => {
    const workLogs = [
      {
        date: toMomentDateTime('2018-01-01T12:00:00.000Z'),
        status: 'APPROVED',
        type: 'HOME_OFFICE_WORK_LOG',
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
        status: 'APPROVED',
        type: 'HOME_OFFICE_WORK_LOG',
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

describe('collapseWorkLogs', () => {
  it('test collapse no work logs', () => {
    expect(collapseWorkLogs(
      Immutable.List([]),
      configMock.get('supportedHolidays')
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
      configMock.get('supportedHolidays')
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
