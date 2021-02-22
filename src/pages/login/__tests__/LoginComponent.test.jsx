import React from 'react';
import { mount } from 'enzyme';
import { StaticRouter } from 'react-router-dom';
import LoginComponent from '../LoginComponent';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      history: {
        push: () => {},
      },
      isLoggedOutLocally: false,
      isPosting: false,
      isPostingFailure: false,
      login: () => {},
      resetLogoutLocally: () => {},
    };

    const tree = mount((
      <StaticRouter context={{}} location="/path">
        <LoginComponent {...props} />
      </StaticRouter>
    ));

    expect(tree).toMatchSnapshot();
  });
});
