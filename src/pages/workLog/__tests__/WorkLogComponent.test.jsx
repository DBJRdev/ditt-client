import Immutable from 'immutable';
import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import WorkLogComponent from '../WorkLogComponent';

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
      addOvertimeWorkLog: () => {},
      addSickDayWorkLog: () => {},
      addTimeOffWorkLog: () => {},
      addVacationWorkLog: () => {},
      addWorkLog: () => {},
      deleteBusinessTripWorkLog: () => {},
      deleteHomeOfficeWorkLog: () => {},
      deleteOvertimeWorkLog: () => {},
      deleteSickDayWorkLog: () => {},
      deleteTimeOffWorkLog: () => {},
      deleteVacationWorkLog: () => {},
      deleteWorkLog: () => {},
      fetchBusinessTripWorkLog: () => {},
      fetchHomeOfficeWorkLog: () => {},
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
