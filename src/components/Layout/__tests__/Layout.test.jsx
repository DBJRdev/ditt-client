import React from 'react';
import { shallow } from 'enzyme';
import LayoutComponent from '../LayoutComponent';

describe('rendering', () => {
  it('renders correctly with mandatory props only', () => {
    const tree = shallow((
      <LayoutComponent
        logout={() => {}}
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
        title="Title"
        token="token"
        roles={['ROLE_EMPLOYEE']}
      >
        Content
      </LayoutComponent>
    ));

    expect(tree).toMatchSnapshot();
  });
});
