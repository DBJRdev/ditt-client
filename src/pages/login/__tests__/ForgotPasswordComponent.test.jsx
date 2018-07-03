import React from 'react';
import { shallow } from 'enzyme';
import ForgotPasswordComponent from '../ForgotPasswordComponent';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      isPosting: false,
      isPostingFailure: false,
      resetPassword: () => {},
    };
    const tree = shallow(<ForgotPasswordComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
