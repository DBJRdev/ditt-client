import Immutable from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';
import AddComponent from '../AddComponent';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      addUser: () => {},
      fetchUserList: () => {},
      history: {
        push: () => {},
      },
      isFetching: false,
      isPosting: false,
      userList: Immutable.List([]),
    };
    const tree = shallow(<AddComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
