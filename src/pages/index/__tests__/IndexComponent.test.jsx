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
      fetchWorkMonth: () => {},
      fetchWorkMonthList: () => new Promise(() => {}),
      history: {
        push: () => {},
      },
      isFetching: false,
      isPosting: false,
      logout: () => {},
      uid: 1,
      workHoursList: Immutable.List(),
      workMonth: null,
      workMonthList: Immutable.List(),
    };
    const tree = shallow(<IndexComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
