import Immutable from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';
import IndexComponent from '../IndexComponent';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      addWorkLog: () => {},
      deleteWorkLog: () => {},
      fetchWorkHoursList: () => {},
      fetchWorkLogList: () => {},
      history: {
        push: () => {},
      },
      isFetching: false,
      isPosting: false,
      logout: () => {},
      uid: 1,
      workHoursList: Immutable.List(),
      workLogList: Immutable.List(),
    };
    const tree = shallow(<IndexComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
