import React from 'react';
import { shallow } from 'enzyme';
import LayoutComponent from '../LayoutComponent';

describe('rendering', () => {
  const props = {
    logout: () => {},
    setLogoutLocally: () => {},
    token: {
      exp: 1577836800000,
      iat: 1577836800000,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0IiwidWlkIjoxLCJmaXJzdE5hbWUiOiJKYW4iLCJsYXN0TmFtZSI6Ik5vdmFrIiwicm9sZXMiOlsiUk9MRV9TVVBFUl9BRE1JTiIsIlJPTEVfRU1QTE9ZRUUiXSwiaWF0IjoxNTc3ODM2ODAwMDAwLCJleHAiOjE1Nzc4MzY4MDAwMDB9.D0JsAR_gABmhJo6bf8AzKp7dazsvZdN0_5-YOW2dKgI',
    },
    user: {
      firstName: 'Jan',
      lastName: 'Novak',
      roles: ['ROLE_SUPER_ADMIN', 'ROLE_EMPLOYEE'],
    },
  };

  it('renders correctly with mandatory props only', () => {
    const tree = shallow((
      <LayoutComponent {...props}>
        Content
      </LayoutComponent>
    ));

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with title', () => {
    const tree = shallow((
      <LayoutComponent
        {...props}
        loading={false}
        title="Title"
      >
        Content
      </LayoutComponent>
    ));

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly in loading state', () => {
    const tree = shallow((
      <LayoutComponent
        {...props}
        loading
        title="Title"
      >
        Content
      </LayoutComponent>
    ));

    expect(tree).toMatchSnapshot();
  });
});
