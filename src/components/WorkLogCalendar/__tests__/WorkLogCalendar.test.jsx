import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import WorkLogCalendar from '../WorkLogCalendar';
import { localizedMoment } from '../../../services/dateTimeService';

let fakeTimestamp = null;
let fakeMomentDateTime = null;

beforeEach(() => {
  fakeTimestamp = sinon.useFakeTimers(1514764800000);
  fakeMomentDateTime = localizedMoment();
});

afterEach(() => {
  fakeTimestamp.restore();
});

describe('rendering', () => {
  it('renders correctly with mandatory props only', () => {
    const tree = shallow(<WorkLogCalendar />);

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with all props', () => {
    const tree = shallow(<WorkLogCalendar onSelectedDateChanged={() => {}} />);

    expect(tree).toMatchSnapshot();
  });
});

describe('functionality', () => {
  it('calls onSelectedDateChanged() date when previous month button is clicked', () => {
    const spy = sinon.spy();
    const tree = shallow(<WorkLogCalendar onSelectedDateChanged={spy} />);
    const expectedArgs = fakeMomentDateTime.clone().subtract(1, 'month');

    tree.find('button').first().simulate('click');

    expect(spy.calledOnce).toEqual(true);
    expect(spy.getCall(0).args[0]).toEqual(expectedArgs);
  });

  it('calls onSelectedDateChanged() date when next month button is clicked', () => {
    const spy = sinon.spy();
    const tree = shallow(<WorkLogCalendar onSelectedDateChanged={spy} />);
    const expectedArgs = fakeMomentDateTime.clone().add(1, 'month');

    tree.find('button').last().simulate('click');

    expect(spy.calledOnce).toEqual(true);
    expect(spy.getCall(0).args[0]).toEqual(expectedArgs);
  });
});
