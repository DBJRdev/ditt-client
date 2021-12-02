import sinon from 'sinon';

global.beforeEach(() => {
  sinon.useFakeTimers({
    advanceTimeDelta: 1,
    now: 1577836800000,
    shouldAdvanceTime: true,
  });
});
