import Immutable from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';
import EditComponent from '../EditComponent';
import configMock from '../../../../tests/mocks/configMock';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      config: configMock,
      deleteUser: () => {},
      editUser: () => {},
      fetchConfig: () => new Promise(() => {}),
      fetchUser: () => new Promise(() => {}),
      fetchUserList: () => {},
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
      userList: Immutable.List([]),
      workHours: Immutable.List([]),
    };
    const tree = shallow(<EditComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
