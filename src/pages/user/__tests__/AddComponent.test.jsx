import Immutable from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';
import AddComponent from '../AddComponent';
import { createDate } from '../../../services/dateTimeService';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      addUser: () => {},
      config: Immutable.fromJS({
        supportedHolidays: [
          createDate(2018, 0, 1),
          createDate(2018, 11, 24),
          createDate(2018, 11, 25),
          createDate(2018, 11, 26),
          createDate(2018, 11, 31),
          createDate(2019, 0, 1),
          createDate(2019, 11, 24),
          createDate(2019, 11, 25),
          createDate(2019, 11, 26),
          createDate(2019, 11, 31),
          createDate(2020, 0, 1),
          createDate(2020, 11, 24),
          createDate(2020, 11, 25),
          createDate(2020, 11, 26),
          createDate(2020, 11, 31),
          createDate(2021, 0, 1),
          createDate(2021, 11, 24),
          createDate(2021, 11, 25),
          createDate(2021, 11, 26),
          createDate(2021, 11, 31),
        ],
        supportedYear: [
          2018,
          2019,
          2020,
          2021,
        ],
        workedHoursLimits: {
          lowerLimit: {
            changeBy: -1800,
            limit: 21600,
          },
          upperLimit: {
            changeBy: -2700,
            limit: 32400,
          },
        },
      }),
      fetchConfig: () => new Promise(() => {}),
      fetchUserList: () => {},
      history: {
        push: () => {},
      },
      isFetching: false,
      isPosting: false,
      userList: Immutable.List([]),
    };
    const tree = shallow(<AddComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});
