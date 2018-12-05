import Immutable from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';
import ProfileComponent from '../ProfileComponent';
import configMock from '../../../../tests/mocks/configMock';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      config: configMock,
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
        remainingVacationDaysByYear: {
          2018: 25,
          2019: 25,
          2020: 25,
          2021: 25,
        },
        supervisor: null,
        vacationDays: 10,
      }),
      workHours: Immutable.List(),
    };
    const tree = shallow(<ProfileComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
