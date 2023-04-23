import Immutable from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';
import ProfileComponent from '../ProfileComponent';
import configMock from '../../../../tests/mocks/configMock';
import token from '../../../../tests/mocks/token';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      config: configMock,
      contracts: Immutable.List([]),
      editUser: () => new Promise(() => {}),
      fetchConfig: () => new Promise(() => {}),
      fetchContractList: () => new Promise(() => {}),
      fetchUser: () => new Promise(() => {}),
      isFetching: false,
      isPosting: false,
      renewUserApiToken: () => new Promise(() => {}),
      renewUserICalToken: () => new Promise(() => {}),
      resetUserApiToken: () => new Promise(() => {}),
      resetUserICalToken: () => new Promise(() => {}),
      token,
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
    };
    const tree = shallow(<ProfileComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
