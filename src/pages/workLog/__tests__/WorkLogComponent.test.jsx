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
      addMultipleBusinessTripWorkLog: () => {},
      addMultipleHomeOfficeWorkLog: () => {},
      addMultipleSickDayWorkLog: () => {},
      addMultipleSpecialLeaveWorkLog: () => {},
      addMultipleTimeOffWorkLog: () => {},
      addMultipleVacationWorkLog: () => {},
      addOvertimeWorkLog: () => {},
      addSickDayWorkLog: () => {},
      addSpecialLeaveWorkLog: () => {},
      addTimeOffWorkLog: () => {},
      addVacationWorkLog: () => {},
      addWorkLog: () => {},
      config: configMock,
      deleteBusinessTripWorkLog: () => {},
      deleteHomeOfficeWorkLog: () => {},
      deleteOvertimeWorkLog: () => {},
      deleteSickDayWorkLog: () => {},
      deleteSpecialLeaveWorkLog: () => {},
      deleteTimeOffWorkLog: () => {},
      deleteVacationWorkLog: () => {},
      deleteWorkLog: () => {},
      editBanWorkLog: () => {},
      editBusinessTripWorkLog: () => {},
      editHomeOfficeWorkLog: () => {},
      editMaternityProtectionWorkLog: () => {},
      editOvertimeWorkLog: () => {},
      editParentalLeaveWorkLog: () => {},
      editSickDayUnpaidWorkLog: () => {},
      editSickDayWorkLog: () => {},
      editSpecialLeaveWorkLog: () => {},
      editTimeOffWorkLog: () => {},
      editVacationWorkLog: () => {},
      editWorkLog: () => {},
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
