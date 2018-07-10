import Immutable from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';
import ListComponent from '../ListComponent';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      fetchUserList: () => {},
      history: {
        push: () => {},
      },
      isFetching: false,
      token: 'token',
      userList: Immutable.List([]),
    };
    const tree = shallow(<ListComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
