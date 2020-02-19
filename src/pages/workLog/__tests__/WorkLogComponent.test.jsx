import Immutable from 'immutable';
import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import WorkLogComponent from '../WorkLogComponent';
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
      deleteBusinessTripWorkLog: () => {},
      deleteHomeOfficeWorkLog: () => {},
      deleteOvertimeWorkLog: () => {},
      deleteSickDayWorkLog: () => {},
      deleteTimeOffWorkLog: () => {},
      deleteVacationWorkLog: () => {},
      deleteWorkLog: () => {},
      fetchBusinessTripWorkLog: () => {},
      fetchConfig: () => {},
      fetchHomeOfficeWorkLog: () => {},
      fetchMaternityProtectionWorkLog: () => {},
      fetchOvertimeWorkLog: () => {},
      fetchSickDayWorkLog: () => {},
      fetchTimeOffWorkLog: () => {},
      fetchVacationWorkLog: () => {},
      fetchWorkHoursList: () => {},
      fetchWorkLog: () => {},
      fetchWorkMonth: () => {},
      fetchWorkMonthList: () => new Promise(() => {}),
      history: {
        push: () => {},
      },
      isFetching: false,
      isPosting: false,
      markWaitingForApproval: () => {},
      uid: 1,
      workHoursList: Immutable.List(),
      workMonth: null,
      workMonthList: Immutable.List(),
    };
    const tree = shallow(<WorkLogComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
