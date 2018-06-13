import React from 'react';
import sinon from 'sinon';
import {
  mount,
  shallow,
} from 'enzyme';
import WorkLogForm from '../WorkLogForm';
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
  it('renders correctly with all props', () => {
    const tree = shallow(<WorkLogForm
      closeHandler={() => {}}
      date={fakeMomentDateTime}
      isPosting={false}
      saveHandler={() => {}}
      workLogsOfDay={[]}
    />);

    expect(tree).toMatchSnapshot();
  });
});

describe('functionality', () => {
  it('calls closeHandler() date when previous month button is clicked', () => {
    const spy = sinon.spy();
    const tree = mount(<WorkLogForm
      closeHandler={spy}
      date={fakeMomentDateTime}
      isPosting={false}
      saveHandler={() => {}}
      workLogsOfDay={[]}
    />);

    tree.find('Button').last().simulate('click');

    expect(spy.calledOnce).toEqual(true);
  });
});
