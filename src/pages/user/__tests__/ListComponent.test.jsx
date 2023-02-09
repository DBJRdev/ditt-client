import Immutable from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';
import token from '../../../../tests/mocks/token';
import ListComponent from '../ListComponent';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      fetchUserList: () => {},
      fetchUserListPartial: () => {},
      history: {
        push: () => {},
      },
      isFetching: false,
      isFetchingPartial: false,
      token,
      userList: Immutable.List([]),
      userListPartial: Immutable.List([]),
    };
    const tree = shallow(<ListComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
