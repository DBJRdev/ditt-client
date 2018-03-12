import Immutable from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';
import IndexComponent from '../IndexComponent';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      data: Immutable.fromJS({
        description: 'Description',
        title: 'Title',
      }),
      fetchData: () => {},
      isFetching: false,
    };
    const tree = shallow(<IndexComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
