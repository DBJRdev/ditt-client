import React from 'react';
import { shallow } from 'enzyme';
import ErrorComponent from '../ErrorComponent';

describe('rendering', () => {
  it('renders correctly', () => {
    const tree = shallow(<ErrorComponent />);
    expect(tree).toMatchSnapshot();
  });
});
