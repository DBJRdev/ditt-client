import Immutable from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';
import IndexComponent from '../IndexComponent';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      addWorkLog: () => {},
      deleteWorkLog: () => {},
      fetchWorkLogList: () => {},
      history: {
        push: () => {},
      },
      isFetchingWorkLogList: false,
      isPostingWorkLog: false,
      logout: () => {},
      uid: 1,
      workLogList: Immutable.List(),
    };
    const tree = shallow(<IndexComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
