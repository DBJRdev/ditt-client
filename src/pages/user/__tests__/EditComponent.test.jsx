import Immutable from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';
import EditComponent from '../EditComponent';
import configMock from '../../../../tests/mocks/configMock';
import token from '../../../../tests/mocks/token';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      config: configMock,
      deleteUser: () => {},
      editUser: () => {},
      fetchConfig: () => new Promise(() => {}),
      fetchUser: () => new Promise(() => {}),
      fetchUserList: () => {},
      fetchVacationList: () => {},
      fetchWorkHoursList: () => {},
      history: {
        push: () => {},
      },
      isFetching: false,
      isPosting: false,
      match: {
        params: {
          id: '1',
        },
      },
      token,
      user: Immutable.Map({
        email: 'employee@example.com',
        firstName: 'First',
        id: 1,
        isActive: true,
        lastName: 'Last',
        supervisor: null,
        vacationDays: 10,
      }),
      userList: Immutable.List([]),
      vacations: Immutable.fromJS([
        {
          vacationDays: 20,
          vacationDaysCorrection: -5,
          year: 2017,
        },
        {
          vacationDays: 20,
          vacationDaysCorrection: -5,
          year: 2018,
        },
        {
          vacationDays: 20,
          vacationDaysCorrection: -5,
          year: 2019,
        },
        {
          vacationDays: 20,
          vacationDaysCorrection: -5,
          year: 2020,
        },
      ]),
      workHours: Immutable.List([]),
    };
    const tree = shallow(<EditComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
