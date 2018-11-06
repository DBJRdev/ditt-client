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
      token: 'token',
      user: Immutable.Map({
        email: 'employee@example.com',
        firstName: 'First',
        id: 1,
        isActive: true,
        lastName: 'Last',
        supervisor: null,
        vacationDays: 10,
      }),
      workHours: Immutable.List(),
    };
    const tree = shallow(<ProfileComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
