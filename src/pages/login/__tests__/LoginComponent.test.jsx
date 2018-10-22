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
      isPosting: false,
      isPostingFailure: false,
      login: () => {},
    };
    const tree = mount((
      <StaticRouter context={{}} location="/path">
        <LoginComponent {...props} />
      </StaticRouter>
    ));

    expect(tree).toMatchSnapshot();
  });
});
