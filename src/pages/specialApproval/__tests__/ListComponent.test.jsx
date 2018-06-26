import Immutable from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';
import ListComponent from '../ListComponent';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      fetchSpecialApprovalList: () => {},
      isFetching: false,
      specialApprovalList: Immutable.fromJS({
        businessTripWorkLogs: [],
        homeOfficeWorkLogs: [],
        timeOffWorkLogs: [],
      }),
      token: 'token',
    };
    const tree = shallow(<ListComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
