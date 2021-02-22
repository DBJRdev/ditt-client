import React from 'react';
import { mount } from 'enzyme';
import { StaticRouter } from 'react-router-dom';
import token from '../../../../tests/mocks/token';
import NewPasswordComponent from '../NewPasswordComponent';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      isPosting: false,
      isPostingFailure: false,
      match: {
        params: {
          resetPasswordToken: token,
        },
      },
      setNewPassword: () => {},
    };
    const tree = mount((
      <StaticRouter context={{}} location="/path">
        <NewPasswordComponent {...props} />
      </StaticRouter>
    ));

    expect(tree).toMatchSnapshot();
  });
});
