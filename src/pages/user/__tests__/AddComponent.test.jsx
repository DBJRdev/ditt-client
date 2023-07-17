import Immutable from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';
import AddComponent from '../AddComponent';
import configMock from '../../../../tests/mocks/configMock';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      addUser: () => {},
      config: configMock,
      fetchConfig: () => new Promise(() => {}),
      fetchUserListPartial: () => {},
      history: {
        push: () => {},
      },
      isContractPosting: false,
      isFetching: false,
      isPosting: false,
      userListPartial: Immutable.List([]),
    };
    const tree = shallow(<AddComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
