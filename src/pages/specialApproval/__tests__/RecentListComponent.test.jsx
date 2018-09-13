import Immutable from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';
import RecentListComponent from '../RecentListComponent';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      fetchBusinessTripWorkLog: () => {},
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
