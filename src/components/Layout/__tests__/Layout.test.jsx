import React from 'react';
import { shallow } from 'enzyme';
import token from '../../../../tests/mocks/token';
import LayoutComponent from '../LayoutComponent';

describe('rendering', () => {
  it('renders correctly with mandatory props only', () => {
    const tree = shallow((
      <LayoutComponent
        logout={() => {}}
        setLogoutLocally={() => {}}
        title="Title"
        roles={['ROLE_EMPLOYEE']}
      >
        Content
      </LayoutComponent>
    ));

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with all props', () => {
    const tree = shallow((
      <LayoutComponent
        loading={false}
        logout={() => {}}
        setLogoutLocally={() => {}}
        title="Title"
        token={token}
        roles={['ROLE_EMPLOYEE']}
      >
        Content
      </LayoutComponent>
    ));

    expect(tree).toMatchSnapshot();
  });
});
