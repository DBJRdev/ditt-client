import Immutable from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';
import ListComponent from '../ListComponent';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      fetchSupervisedUserList: () => {},
      history: {
        push: () => {},
      },
      isFetching: false,
      supervisedUserList: Immutable.List([]),
      token: 'token',
    };
    const tree = shallow(<ListComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
