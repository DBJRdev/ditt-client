import React from 'react';
import { shallow } from 'enzyme';
import NewPasswordComponent from '../NewPasswordComponent';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      isPosting: false,
      isPostingFailure: false,
      match: {
        params: {
          resetPasswordToken: 'token',
        },
      },
      newPassword: () => {},
    };
    const tree = shallow(<NewPasswordComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
