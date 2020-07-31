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
      addMultipleBanWorkLogs: () => {},
      addMultipleMaternityProtectionWorkLogs: () => {},
      addMultipleParentalLeaveWorkLogs: () => {},
      addMultipleSickDayUnpaidWorkLogs: () => {},
      config: configMock,
      deleteBanWorkLog: () => {},
      deleteMaternityProtectionWorkLog: () => {},
      deleteParentalLeaveWorkLog: () => {},
      deleteSickDayUnpaidWorkLog: () => {},
      editBanWorkLog: () => {},
      editMaternityProtectionWorkLog: () => {},
      editParentalLeaveWorkLog: () => {},
      editSickDayUnpaidWorkLog: () => {},
      fetchBanWorkLog: () => {},
      fetchBusinessTripWorkLog: () => {},
      fetchConfig: () => {},
      fetchHomeOfficeWorkLog: () => {},
      fetchMaternityProtectionWorkLog: () => {},
      fetchOvertimeWorkLog: () => {},
      fetchParentalLeaveWorkLog: () => {},
      fetchSickDayUnpaidWorkLog: () => {},
      fetchSickDayWorkLog: () => {},
      fetchSpecialLeaveWorkLog: () => {},
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
      markApproved: () => {},
      match: {
        params: {
          id: '1',
        },
      },
      setWorkTimeCorrection: () => {},
      token: 'token',
      workHoursList: Immutable.List(),
      workMonth: null,
      workMonthList: Immutable.List(),
    };
    const tree = shallow(<WorkLogComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
