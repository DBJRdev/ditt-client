import React from 'react';
import { mount } from 'enzyme';
import { StaticRouter } from 'react-router-dom';
import ForgotPasswordComponent from '../ForgotPasswordComponent';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      isPosting: false,
      isPostingFailure: false,
      resetPassword: () => {},
    };
    const tree = mount((
      <StaticRouter context={{}} location="/path">
        <ForgotPasswordComponent {...props} />
      </StaticRouter>
    ));

    expect(tree).toMatchSnapshot();
  });
});
