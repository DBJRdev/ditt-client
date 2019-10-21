import Immutable from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';
import ProfileComponent from '../ProfileComponent';
import configMock from '../../../../tests/mocks/configMock';

describe('rendering', () => {
  it('renders correctly', () => {
    // Ignore warning because of old ReactUI
    console.error = () => {};

    const props = {
      config: configMock,
      editUser: () => new Promise(() => {}),
      fetchConfig: () => new Promise(() => {}),
      fetchUser: () => new Promise(() => {}),
      fetchWorkHoursList: () => {},
      isFetching: false,
      isPosting: false,
      renewUserApiToken: () => new Promise(() => {}),
      resetUserApiToken: () => new Promise(() => {}),
      token: 'token',
      user: Immutable.fromJS({
        apiToken: 'apiToken',
        email: 'employee@example.com',
        firstName: 'First',
        id: 1,
        isActive: true,
        lastName: 'Last',
        notifications: {
          supervisorInfoFridayTime: '8:00',
          supervisorInfoMondayTime: '8:00',
          supervisorInfoSaturdayTime: null,
          supervisorInfoSendOnHolidays: false,
          supervisorInfoSundayTime: null,
          supervisorInfoThursdayTime: '8:00',
          supervisorInfoTuesdayTime: '8:00',
          supervisorInfoWednesdayTime: '8:00',
        },
        supervisor: null,
        vacations: [
          {
            remainingVacationDays: 10,
            vacationDays: 20,
            vacationDaysCorrection: -5,
            year: 2018,
          },
          {
            remainingVacationDays: 10,
            vacationDays: 20,
            vacationDaysCorrection: -5,
            year: 2019,
          },
          {
            remainingVacationDays: 10,
            vacationDays: 20,
            vacationDaysCorrection: -5,
            year: 2020,
          },
          {
            remainingVacationDays: 10,
            vacationDays: 20,
            vacationDaysCorrection: -5,
            year: 2021,
          },
        ],
      }),
      workHours: Immutable.List(),
    };
    const tree = shallow(<ProfileComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
