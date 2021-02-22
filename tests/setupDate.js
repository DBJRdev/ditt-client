import sinon from 'sinon';

let clock;

global.beforeEach(() => {
  clock = sinon.useFakeTimers({
    advanceTimeDelta: 1,
    now: new Date(1577836800000),
    shouldAdvanceTime: true,
  });
});

global.afterEach(() => {
  clock.restore();
});
