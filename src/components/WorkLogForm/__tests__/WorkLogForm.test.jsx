import Immutable from 'immutable';
import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';
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
  it('renders correctly with mandatory props', () => {
    const tree = mount(<WorkLogForm
      config={Immutable.Map()}
      closeHandler={() => {}}
      date={fakeMomentDateTime}
      isPosting={false}
      saveHandler={() => {}}
      user={Immutable.fromJS({ remainingVacationDaysByYear: {} })}
      workLogsOfDay={Immutable.List([])}
    />);

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with all props', () => {
    const tree = mount(<WorkLogForm
      config={Immutable.Map()}
      closeHandler={() => {}}
      date={fakeMomentDateTime}
      isPosting={false}
      saveHandler={() => {}}
      showInfoText
      user={Immutable.fromJS({ remainingVacationDaysByYear: {} })}
      workLogsOfDay={Immutable.List([])}
    />);

    expect(tree).toMatchSnapshot();
  });
});

describe('functionality', () => {
  it('calls closeHandler() date when previous month button is clicked', () => {
    const spy = sinon.spy();
    const tree = mount(<WorkLogForm
      config={Immutable.Map()}
      closeHandler={spy}
      date={fakeMomentDateTime}
      isPosting={false}
      saveHandler={() => {}}
      user={Immutable.fromJS({ remainingVacationDaysByYear: {} })}
      workLogsOfDay={Immutable.List([])}
    />);

    tree.find('button').last().simulate('click');

    expect(spy.calledOnce).toEqual(true);
  });
});
