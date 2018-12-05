import Immutable from 'immutable';
import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import FastAccessAddWorkLogComponent from '../FastAccessAddWorkLogComponent';
import configMock from '../../../../tests/mocks/configMock';

let fakeTimestamp = null;

beforeEach(() => {
  fakeTimestamp = sinon.useFakeTimers(1514764800000);
});

afterEach(() => {
  fakeTimestamp.restore();
});

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      addBusinessTripWorkLog: () => {},
      addHomeOfficeWorkLog: () => {},
      addMultipleVacationWorkLog: () => {},
      addOvertimeWorkLog: () => {},
      addSickDayWorkLog: () => {},
      addTimeOffWorkLog: () => {},
      addWorkLog: () => {},
      config: configMock,
      fetchConfig: () => {},
      fetchUserByApiToken: () => new Promise(() => {}),
      fetchWorkMonth: () => {},
      fetchWorkMonthList: () => new Promise(() => {}),
      isFetching: false,
      isPosting: false,
      match: {
        params: {
          apiToken: 'apiToken',
        },
      },
      workMonth: Immutable.fromJS({
        businessTripWorkLogs: [],
        homeOfficeWorkLogs: [],
        id: 2,
        month: 1,
        overtimeWorkLogs: [],
        sickDayWorkLogs: [],
        status: 'WAITING_FOR_APPROVAL',
        timeOffWorkLogs: [],
        user: {
          remainingVacationDaysByYear: {},
        },
        vacationWorkLogs: [],
        workLogs: [],
        year: 2018,
      }),
      workMonthList: Immutable.fromJS([
        {
          id: 1,
          month: 12,
          year: 2017,
        },
        {
          id: 2,
          month: 1,
          year: 2018,
        },
        {
          id: 3,
          month: 2,
          year: 2018,
        },
      ]),
    };
    const tree = shallow(<FastAccessAddWorkLogComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
