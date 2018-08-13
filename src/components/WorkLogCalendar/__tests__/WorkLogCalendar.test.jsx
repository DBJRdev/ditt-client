import Immutable from 'immutable';
import React from 'react';
import sinon from 'sinon';
import {
  mount,
  shallow,
} from 'enzyme';
import WorkLogCalendar from '../WorkLogCalendar';
import { localizedMoment } from '../../../services/dateTimeService';

let fakeTimestamp = null;
let fakeMomentDateTime = null;

beforeEach(() => {
  fakeTimestamp = sinon.useFakeTimers(1514764800000);
  fakeMomentDateTime = localizedMoment();
});

afterEach(() => {
  fakeTimestamp.restore();
});

describe('rendering', () => {
  it('renders correctly with opened work month', () => {
    const tree = shallow(<WorkLogCalendar
      addBusinessTripWorkLog={() => {}}
      addHomeOfficeWorkLog={() => {}}
      addSickDayWorkLog={() => {}}
      addOvertimeWorkLog={() => {}}
      addTimeOffWorkLog={() => {}}
      addVacationWorkLog={() => {}}
      addWorkLog={() => {}}
      deleteBusinessTripWorkLog={() => {}}
      deleteHomeOfficeWorkLog={() => {}}
      deleteOvertimeWorkLog={() => {}}
      deleteSickDayWorkLog={() => {}}
      deleteTimeOffWorkLog={() => {}}
      deleteVacationWorkLog={() => {}}
      deleteWorkLog={() => {}}
      fetchBusinessTripWorkLog={() => {}}
      fetchHomeOfficeWorkLog={() => {}}
      fetchOvertimeWorkLog={() => {}}
      fetchSickDayWorkLog={() => {}}
      fetchTimeOffWorkLog={() => {}}
      fetchVacationWorkLog={() => {}}
      fetchWorkLog={() => {}}
      isFetching={false}
      isPosting={false}
      changeSelectedDate={() => {}}
      markApproved={() => {}}
      markWaitingForApproval={() => {}}
      selectedDate={fakeMomentDateTime}
      workHoursList={Immutable.List()}
      workMonth={
        Immutable.fromJS({
          businessTripWorkLogs: [],
          homeOfficeWorkLogs: [],
          id: 2,
          month: 1,
          overtimeWorkLogs: [],
          sickDayWorkLogs: [],
          status: 'OPENED',
          timeOffWorkLogs: [],
          vacationWorkLogs: [],
          workLogs: [],
          year: 2018,
        })
      }
      workMonthList={
        Immutable.fromJS([
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
        ])
      }
    />);

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with work month waiting for approval', () => {
    const tree = shallow(<WorkLogCalendar
      addBusinessTripWorkLog={() => {}}
      addHomeOfficeWorkLog={() => {}}
      addOvertimeWorkLog={() => {}}
      addSickDayWorkLog={() => {}}
      addTimeOffWorkLog={() => {}}
      addVacationWorkLog={() => {}}
      addWorkLog={() => {}}
      deleteBusinessTripWorkLog={() => {}}
      deleteHomeOfficeWorkLog={() => {}}
      deleteOvertimeWorkLog={() => {}}
      deleteSickDayWorkLog={() => {}}
      deleteTimeOffWorkLog={() => {}}
      deleteVacationWorkLog={() => {}}
      deleteWorkLog={() => {}}
      fetchBusinessTripWorkLog={() => {}}
      fetchHomeOfficeWorkLog={() => {}}
      fetchOvertimeWorkLog={() => {}}
      fetchSickDayWorkLog={() => {}}
      fetchTimeOffWorkLog={() => {}}
      fetchVacationWorkLog={() => {}}
      fetchWorkLog={() => {}}
      isFetching={false}
      isPosting={false}
      changeSelectedDate={() => {}}
      markApproved={() => {}}
      markWaitingForApproval={() => {}}
      selectedDate={fakeMomentDateTime}
      workHoursList={Immutable.List()}
      workMonth={
        Immutable.fromJS({
          businessTripWorkLogs: [],
          homeOfficeWorkLogs: [],
          id: 2,
          month: 1,
          overtimeWorkLogs: [],
          sickDayWorkLogs: [],
          status: 'WAITING_FOR_APPROVAL',
          timeOffWorkLogs: [],
          vacationWorkLogs: [],
          workLogs: [],
          year: 2018,
        })
      }
      workMonthList={
        Immutable.fromJS([
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
        ])
      }
    />);

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with closed work month', () => {
    const tree = shallow(<WorkLogCalendar
      addBusinessTripWorkLog={() => {}}
      addHomeOfficeWorkLog={() => {}}
      addOvertimeWorkLog={() => {}}
      addSickDayWorkLog={() => {}}
      addTimeOffWorkLog={() => {}}
      addVacationWorkLog={() => {}}
      addWorkLog={() => {}}
      deleteBusinessTripWorkLog={() => {}}
      deleteHomeOfficeWorkLog={() => {}}
      deleteOvertimeWorkLog={() => {}}
      deleteSickDayWorkLog={() => {}}
      deleteTimeOffWorkLog={() => {}}
      deleteVacationWorkLog={() => {}}
      deleteWorkLog={() => {}}
      fetchBusinessTripWorkLog={() => {}}
      fetchHomeOfficeWorkLog={() => {}}
      fetchOvertimeWorkLog={() => {}}
      fetchSickDayWorkLog={() => {}}
      fetchTimeOffWorkLog={() => {}}
      fetchVacationWorkLog={() => {}}
      fetchWorkLog={() => {}}
      isFetching={false}
      isPosting={false}
      changeSelectedDate={() => {}}
      markApproved={() => {}}
      markWaitingForApproval={() => {}}
      selectedDate={fakeMomentDateTime}
      workHoursList={Immutable.List()}
      workMonth={
        Immutable.fromJS({
          businessTripWorkLogs: [],
          homeOfficeWorkLogs: [],
          id: 2,
          month: 1,
          overtimeWorkLogs: [],
          sickDayWorkLogs: [],
          status: 'APPROVED',
          timeOffWorkLogs: [],
          vacationWorkLogs: [],
          workLogs: [],
          year: 2018,
        })
      }
      workMonthList={
        Immutable.fromJS([
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
        ])
      }
    />);

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly supervisor view with opened work month', () => {
    const tree = shallow(<WorkLogCalendar
      addBusinessTripWorkLog={() => {}}
      addHomeOfficeWorkLog={() => {}}
      addOvertimeWorkLog={() => {}}
      addSickDayWorkLog={() => {}}
      addTimeOffWorkLog={() => {}}
      addVacationWorkLog={() => {}}
      addWorkLog={() => {}}
      deleteBusinessTripWorkLog={() => {}}
      deleteHomeOfficeWorkLog={() => {}}
      deleteOvertimeWorkLog={() => {}}
      deleteSickDayWorkLog={() => {}}
      deleteTimeOffWorkLog={() => {}}
      deleteVacationWorkLog={() => {}}
      deleteWorkLog={() => {}}
      fetchBusinessTripWorkLog={() => {}}
      fetchHomeOfficeWorkLog={() => {}}
      fetchOvertimeWorkLog={() => {}}
      fetchSickDayWorkLog={() => {}}
      fetchTimeOffWorkLog={() => {}}
      fetchVacationWorkLog={() => {}}
      fetchWorkLog={() => {}}
      isFetching={false}
      isPosting={false}
      changeSelectedDate={() => {}}
      markApproved={() => {}}
      markWaitingForApproval={() => {}}
      selectedDate={fakeMomentDateTime}
      supervisorView
      workHoursList={Immutable.List()}
      workMonth={
        Immutable.fromJS({
          businessTripWorkLogs: [],
          homeOfficeWorkLogs: [],
          id: 2,
          month: 1,
          overtimeWorkLogs: [],
          sickDayWorkLogs: [],
          status: 'OPENED',
          timeOffWorkLogs: [],
          vacationWorkLogs: [],
          workLogs: [],
          year: 2018,
        })
      }
      workMonthList={
        Immutable.fromJS([
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
        ])
      }
    />);

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly supervisor view with work month waiting for approval', () => {
    const tree = shallow(<WorkLogCalendar
      addBusinessTripWorkLog={() => {}}
      addHomeOfficeWorkLog={() => {}}
      addOvertimeWorkLog={() => {}}
      addSickDayWorkLog={() => {}}
      addTimeOffWorkLog={() => {}}
      addVacationWorkLog={() => {}}
      addWorkLog={() => {}}
      deleteBusinessTripWorkLog={() => {}}
      deleteHomeOfficeWorkLog={() => {}}
      deleteOvertimeWorkLog={() => {}}
      deleteSickDayWorkLog={() => {}}
      deleteTimeOffWorkLog={() => {}}
      deleteVacationWorkLog={() => {}}
      deleteWorkLog={() => {}}
      fetchBusinessTripWorkLog={() => {}}
      fetchHomeOfficeWorkLog={() => {}}
      fetchOvertimeWorkLog={() => {}}
      fetchSickDayWorkLog={() => {}}
      fetchTimeOffWorkLog={() => {}}
      fetchVacationWorkLog={() => {}}
      fetchWorkLog={() => {}}
      isFetching={false}
      isPosting={false}
      changeSelectedDate={() => {}}
      markApproved={() => {}}
      markWaitingForApproval={() => {}}
      selectedDate={fakeMomentDateTime}
      supervisorView
      workHoursList={Immutable.List()}
      workMonth={
        Immutable.fromJS({
          businessTripWorkLogs: [],
          homeOfficeWorkLogs: [],
          id: 2,
          month: 1,
          overtimeWorkLogs: [],
          sickDayWorkLogs: [],
          status: 'WAITING_FOR_APPROVAL',
          timeOffWorkLogs: [],
          vacationWorkLogs: [],
          workLogs: [],
          year: 2018,
        })
      }
      workMonthList={
        Immutable.fromJS([
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
        ])
      }
    />);

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly supervisor view with closed work month', () => {
    const tree = shallow(<WorkLogCalendar
      addBusinessTripWorkLog={() => {}}
      addHomeOfficeWorkLog={() => {}}
      addOvertimeWorkLog={() => {}}
      addSickDayWorkLog={() => {}}
      addTimeOffWorkLog={() => {}}
      addVacationWorkLog={() => {}}
      addWorkLog={() => {}}
      deleteBusinessTripWorkLog={() => {}}
      deleteHomeOfficeWorkLog={() => {}}
      deleteOvertimeWorkLog={() => {}}
      deleteSickDayWorkLog={() => {}}
      deleteTimeOffWorkLog={() => {}}
      deleteVacationWorkLog={() => {}}
      deleteWorkLog={() => {}}
      fetchBusinessTripWorkLog={() => {}}
      fetchHomeOfficeWorkLog={() => {}}
      fetchOvertimeWorkLog={() => {}}
      fetchSickDayWorkLog={() => {}}
      fetchTimeOffWorkLog={() => {}}
      fetchVacationWorkLog={() => {}}
      fetchWorkLog={() => {}}
      isFetching={false}
      isPosting={false}
      changeSelectedDate={() => {}}
      markApproved={() => {}}
      markWaitingForApproval={() => {}}
      selectedDate={fakeMomentDateTime}
      supervisorView
      workHoursList={Immutable.List()}
      workMonth={
        Immutable.fromJS({
          businessTripWorkLogs: [],
          homeOfficeWorkLogs: [],
          id: 2,
          month: 1,
          overtimeWorkLogs: [],
          sickDayWorkLogs: [],
          status: 'APPROVED',
          timeOffWorkLogs: [],
          vacationWorkLogs: [],
          workLogs: [],
          year: 2018,
        })
      }
      workMonthList={
        Immutable.fromJS([
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
        ])
      }
    />);

    expect(tree).toMatchSnapshot();
  });
});

describe('functionality', () => {
  it('calls changeSelectedDate() date when previous month button is clicked', () => {
    const spy = sinon.spy();
    const tree = mount(<WorkLogCalendar
      addBusinessTripWorkLog={() => {}}
      addHomeOfficeWorkLog={() => {}}
      addOvertimeWorkLog={() => {}}
      addSickDayWorkLog={() => {}}
      addTimeOffWorkLog={() => {}}
      addVacationWorkLog={() => {}}
      addWorkLog={() => {}}
      deleteBusinessTripWorkLog={() => {}}
      deleteHomeOfficeWorkLog={() => {}}
      deleteOvertimeWorkLog={() => {}}
      deleteSickDayWorkLog={() => {}}
      deleteTimeOffWorkLog={() => {}}
      deleteVacationWorkLog={() => {}}
      deleteWorkLog={() => {}}
      fetchBusinessTripWorkLog={() => {}}
      fetchHomeOfficeWorkLog={() => {}}
      fetchOvertimeWorkLog={() => {}}
      fetchSickDayWorkLog={() => {}}
      fetchTimeOffWorkLog={() => {}}
      fetchVacationWorkLog={() => {}}
      fetchWorkLog={() => {}}
      isFetching={false}
      isPosting={false}
      changeSelectedDate={spy}
      markApproved={() => {}}
      markWaitingForApproval={() => {}}
      selectedDate={fakeMomentDateTime}
      workHoursList={Immutable.List()}
      workMonth={
        Immutable.fromJS({
          businessTripWorkLogs: [],
          homeOfficeWorkLogs: [],
          id: 2,
          month: 1,
          overtimeWorkLogs: [],
          sickDayWorkLogs: [],
          status: 'OPENED',
          timeOffWorkLogs: [],
          vacationWorkLogs: [],
          workLogs: [],
          year: 2018,
        })
      }
      workMonthList={
        Immutable.fromJS([
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
        ])
      }
    />);
    const expectedArgs = fakeMomentDateTime.clone().subtract(1, 'month');

    tree.find('Button').first().simulate('click');

    expect(spy.calledOnce).toEqual(true);
    expect(spy.getCall(0).args[0]).toEqual(expectedArgs);
  });

  it('calls changeSelectedDate() date when next month button is clicked', () => {
    const spy = sinon.spy();
    const tree = mount(<WorkLogCalendar
      addBusinessTripWorkLog={() => {}}
      addHomeOfficeWorkLog={() => {}}
      addOvertimeWorkLog={() => {}}
      addSickDayWorkLog={() => {}}
      addTimeOffWorkLog={() => {}}
      addVacationWorkLog={() => {}}
      addWorkLog={() => {}}
      deleteBusinessTripWorkLog={() => {}}
      deleteHomeOfficeWorkLog={() => {}}
      deleteOvertimeWorkLog={() => {}}
      deleteSickDayWorkLog={() => {}}
      deleteTimeOffWorkLog={() => {}}
      deleteVacationWorkLog={() => {}}
      deleteWorkLog={() => {}}
      fetchBusinessTripWorkLog={() => {}}
      fetchHomeOfficeWorkLog={() => {}}
      fetchOvertimeWorkLog={() => {}}
      fetchSickDayWorkLog={() => {}}
      fetchTimeOffWorkLog={() => {}}
      fetchVacationWorkLog={() => {}}
      fetchWorkLog={() => {}}
      isFetching={false}
      isPosting={false}
      changeSelectedDate={spy}
      markApproved={() => {}}
      markWaitingForApproval={() => {}}
      selectedDate={fakeMomentDateTime}
      workHoursList={Immutable.List()}
      workMonth={
        Immutable.fromJS({
          businessTripWorkLogs: [],
          homeOfficeWorkLogs: [],
          id: 2,
          month: 1,
          overtimeWorkLogs: [],
          sickDayWorkLogs: [],
          status: 'OPENED',
          timeOffWorkLogs: [],
          vacationWorkLogs: [],
          workLogs: [],
          year: 2018,
        })
      }
      workMonthList={
        Immutable.fromJS([
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
        ])
      }
    />);
    const expectedArgs = fakeMomentDateTime.clone().add(1, 'month');

    tree.find('Button').at(1).simulate('click');

    expect(spy.calledOnce).toEqual(true);
    expect(spy.getCall(0).args[0]).toEqual(expectedArgs);
  });

  it('calls markWaitingForApproval() when send for approval button is clicked', () => {
    const spy = sinon.spy();
    const tree = mount(<WorkLogCalendar
      addBusinessTripWorkLog={() => {}}
      addHomeOfficeWorkLog={() => {}}
      addOvertimeWorkLog={() => {}}
      addSickDayWorkLog={() => {}}
      addTimeOffWorkLog={() => {}}
      addVacationWorkLog={() => {}}
      addWorkLog={() => {}}
      deleteBusinessTripWorkLog={() => {}}
      deleteHomeOfficeWorkLog={() => {}}
      deleteOvertimeWorkLog={() => {}}
      deleteSickDayWorkLog={() => {}}
      deleteTimeOffWorkLog={() => {}}
      deleteVacationWorkLog={() => {}}
      deleteWorkLog={() => {}}
      fetchBusinessTripWorkLog={() => {}}
      fetchHomeOfficeWorkLog={() => {}}
      fetchOvertimeWorkLog={() => {}}
      fetchSickDayWorkLog={() => {}}
      fetchTimeOffWorkLog={() => {}}
      fetchVacationWorkLog={() => {}}
      fetchWorkLog={() => {}}
      isFetching={false}
      isPosting={false}
      changeSelectedDate={() => {}}
      markApproved={() => {}}
      markWaitingForApproval={spy}
      selectedDate={fakeMomentDateTime}
      workHoursList={Immutable.List()}
      workMonth={
        Immutable.fromJS({
          businessTripWorkLogs: [],
          homeOfficeWorkLogs: [],
          id: 2,
          month: 1,
          overtimeWorkLogs: [],
          sickDayWorkLogs: [],
          status: 'OPENED',
          timeOffWorkLogs: [],
          vacationWorkLogs: [],
          workLogs: [],
          year: 2018,
        })
      }
      workMonthList={
        Immutable.fromJS([
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
        ])
      }
    />);
    tree.find('Button').last().simulate('click');

    expect(spy.calledOnce).toEqual(true);
    expect(spy.getCall(0).args[0]).toEqual(2);
  });

  it('calls markApproved() when approve button is clicked', () => {
    const spy = sinon.spy();
    const tree = mount(<WorkLogCalendar
      addBusinessTripWorkLog={() => {}}
      addHomeOfficeWorkLog={() => {}}
      addOvertimeWorkLog={() => {}}
      addSickDayWorkLog={() => {}}
      addTimeOffWorkLog={() => {}}
      addVacationWorkLog={() => {}}
      addWorkLog={() => {}}
      deleteBusinessTripWorkLog={() => {}}
      deleteHomeOfficeWorkLog={() => {}}
      deleteOvertimeWorkLog={() => {}}
      deleteSickDayWorkLog={() => {}}
      deleteTimeOffWorkLog={() => {}}
      deleteVacationWorkLog={() => {}}
      deleteWorkLog={() => {}}
      fetchBusinessTripWorkLog={() => {}}
      fetchHomeOfficeWorkLog={() => {}}
      fetchOvertimeWorkLog={() => {}}
      fetchSickDayWorkLog={() => {}}
      fetchTimeOffWorkLog={() => {}}
      fetchVacationWorkLog={() => {}}
      fetchWorkLog={() => {}}
      isFetching={false}
      isPosting={false}
      changeSelectedDate={() => {}}
      markApproved={spy}
      markWaitingForApproval={() => {}}
      selectedDate={fakeMomentDateTime}
      supervisorView
      workHoursList={Immutable.List()}
      workMonth={
        Immutable.fromJS({
          businessTripWorkLogs: [],
          homeOfficeWorkLogs: [],
          id: 2,
          month: 1,
          overtimeWorkLogs: [],
          sickDayWorkLogs: [],
          status: 'WAITING_FOR_APPROVAL',
          timeOffWorkLogs: [],
          vacationWorkLogs: [],
          workLogs: [],
          year: 2018,
        })
      }
      workMonthList={
        Immutable.fromJS([
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
        ])
      }
    />);
    tree.find('Button').at(1).simulate('click');

    expect(spy.calledOnce).toEqual(true);
    expect(spy.getCall(0).args[0]).toEqual(2);
  });
});
