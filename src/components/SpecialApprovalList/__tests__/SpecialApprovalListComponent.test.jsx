import Immutable from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';
import SpecialApprovalListComponent from '../SpecialApprovalListComponent';
import configMock from '../../../../tests/mocks/configMock';
import token from '../../../../tests/mocks/token';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      config: configMock,
      fetchBusinessTripWorkLog: () => {},
      fetchConfig: () => {},
      fetchHomeOfficeWorkLog: () => {},
      fetchOvertimeWorkLog: () => {},
      fetchSpecialApprovalList: () => {},
      fetchSpecialLeaveWorkLog: () => {},
      fetchTimeOffWorkLog: () => {},
      fetchVacationWorkLog: () => {},
      isFetching: false,
      isPosting: false,
      markBusinessTripWorkLogApproved: () => {},
      markBusinessTripWorkLogRejected: () => {},
      markHomeOfficeWorkLogApproved: () => {},
      markHomeOfficeWorkLogRejected: () => {},
      markMultipleBusinessTripWorkLogApproved: () => {},
      markMultipleBusinessTripWorkLogRejected: () => {},
      markMultipleHomeOfficeWorkLogApproved: () => {},
      markMultipleHomeOfficeWorkLogRejected: () => {},
      markMultipleOvertimeWorkLogApproved: () => {},
      markMultipleOvertimeWorkLogRejected: () => {},
      markMultipleSpecialLeaveWorkLogApproved: () => {},
      markMultipleSpecialLeaveWorkLogRejected: () => {},
      markMultipleTimeOffWorkLogApproved: () => {},
      markMultipleTimeOffWorkLogRejected: () => {},
      markMultipleVacationWorkLogApproved: () => {},
      markMultipleVacationWorkLogRejected: () => {},
      markOvertimeWorkLogApproved: () => {},
      markOvertimeWorkLogRejected: () => {},
      markSpecialLeaveWorkLogApproved: () => {},
      markSpecialLeaveWorkLogRejected: () => {},
      markTimeOffWorkLogApproved: () => {},
      markTimeOffWorkLogRejected: () => {},
      markVacationWorkLogApproved: () => {},
      markVacationWorkLogRejected: () => {},
      specialApprovalList: Immutable.fromJS({
        businessTripWorkLogs: [],
        homeOfficeWorkLogs: [],
        overtimeWorkLogs: [],
        specialLeaveWorkLogs: [],
        timeOffWorkLogs: [],
        vacationWorkLogs: [],
      }),
      supportBusinessTripWorkLog: () => {},
      supportHomeOfficeWorkLog: () => {},
      supportMultipleBusinessTripWorkLog: () => {},
      supportMultipleHomeOfficeWorkLog: () => {},
      supportMultipleOvertimeWorkLog: () => {},
      supportMultipleSpecialLeaveWorkLog: () => {},
      supportMultipleTimeOffWorkLog: () => {},
      supportMultipleVacationWorkLog: () => {},
      supportOvertimeWorkLog: () => {},
      supportSpecialLeaveWorkLog: () => {},
      supportTimeOffWorkLog: () => {},
      supportVacationWorkLog: () => {},
      token,
    };
    const tree = shallow(<SpecialApprovalListComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
