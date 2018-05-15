import React from 'react';
import { shallow } from 'enzyme';
import LoginComponent from '../LoginComponent';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      isPosting: false,
      isPostingFailure: false,
      login: () => {},
    };
    const tree = shallow(<LoginComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
