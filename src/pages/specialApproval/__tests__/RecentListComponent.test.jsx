import Immutable from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';
import RecentListComponent from '../RecentListComponent';
import configMock from '../../../../tests/mocks/configMock';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      config: configMock,
      fetchBusinessTripWorkLog: () => {},
      fetchConfig: () => {},
      fetchHomeOfficeWorkLog: () => {},
      fetchOvertimeWorkLog: () => {},
      fetchSpecialApprovalList: () => {},
      fetchTimeOffWorkLog: () => {},
      fetchVacationWorkLog: () => {},
      isFetching: false,
      isPosting: false,
      markBusinessTripWorkLogApproved: () => {},
      markBusinessTripWorkLogRejected: () => {},
      markHomeOfficeWorkLogApproved: () => {},
      markHomeOfficeWorkLogRejected: () => {},
      markMultipleVacationWorkLogApproved: () => {},
      markMultipleVacationWorkLogRejected: () => {},
      markOvertimeWorkLogApproved: () => {},
      markOvertimeWorkLogRejected: () => {},
      markTimeOffWorkLogApproved: () => {},
      markTimeOffWorkLogRejected: () => {},
      markVacationWorkLogApproved: () => {},
      markVacationWorkLogRejected: () => {},
      specialApprovalList: Immutable.fromJS({
        businessTripWorkLogs: [],
        homeOfficeWorkLogs: [],
        overtimeWorkLogs: [],
        timeOffWorkLogs: [],
        vacationWorkLogs: [],
      }),
      token: 'token',
    };
    const tree = shallow(<RecentListComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
