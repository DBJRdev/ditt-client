import Immutable from 'immutable';
import { toMomentDateTime } from '../dateTimeService';
import { getWorkedTime } from '../workLogService';

describe('getWorkedTime', () => {
  it('should calculate WORK_LOG total time worked with no break', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2017-11-24T14:15:30.100Z'),
        startTime: toMomentDateTime('2017-11-24T08:15:30.100Z'),
        type: 'WORK_LOG',
      },
    ];

    expect(getWorkedTime(workLogs, Immutable.fromJS([])).asSeconds()).toEqual(6 * 3600);
  });

  it('should calculate WORK_LOG total time worked with 30 minute break 1', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2017-11-24T14:15:31.100Z'),
        startTime: toMomentDateTime('2017-11-24T08:15:30.100Z'),
        type: 'WORK_LOG',
      },
    ];

    expect(getWorkedTime(workLogs, Immutable.fromJS([])).asSeconds())
      .toEqual(((6 * 3600) + 1) - (30 * 60));
  });

  it('should calculate WORK_LOG total time worked with 30 minute break 2', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2017-11-24T17:15:30.100Z'),
        startTime: toMomentDateTime('2017-11-24T08:15:30.100Z'),
        type: 'WORK_LOG',
      },
    ];

    expect(getWorkedTime(workLogs, Immutable.fromJS([])).asSeconds())
      .toEqual((9 * 3600) - (30 * 60));
  });

  it('should calculate WORK_LOG total time worked with 45 minute break', () => {
    const workLogs = [
      {
        endTime: toMomentDateTime('2017-11-24T17:15:31.100Z'),
        startTime: toMomentDateTime('2017-11-24T08:15:30.100Z'),
        type: 'WORK_LOG',
      },
    ];

    expect(getWorkedTime(workLogs, Immutable.fromJS([])).asSeconds())
      .toEqual(((9 * 3600) + 1) - (45 * 60));
  });
});
